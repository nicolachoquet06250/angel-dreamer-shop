import {fireEvent, waitFor, within} from '@testing-library/vue'
import {flushPromises, mount} from '@vue/test-utils'
import {defineComponent, h, ref, Suspense} from 'vue'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import StoreHeader from '~/components/StoreHeader.vue'

const categories = [
    {id: 1, label: 'Nouveautés', slug: 'nouveautes', position: 0, active: true},
    {id: 2, label: 'Maison', slug: 'maison', position: 1, active: true},
]

async function mountHeader(user: { email: string; role: string } | null = null, customized = true) {
    Object.assign(globalThis, {
        useShopCart: () => ({count: ref(2)}),
        useFetch: vi.fn((url: string, options?: { default?: () => unknown }) => {
            options?.default?.()
            return url === '/api/auth/me' ? {data: ref({user})} : {data: ref(categories)}
        }),
    })
    const Host = defineComponent({
        setup: () => () => h(Suspense, null, {
            default: () => h('div', [h(StoreHeader, customized ? {
                announcement: 'Livraison offerte',
                logoText: 'TEST SHOP'
            } : {})]), fallback: () => h('span', 'Chargement')
        }),
    })
    const wrapper = mount(Host, {
        attachTo: document.body,
        global: {stubs: {NuxtLink: {props: ['to'], template: '<a :href="to"><slot /></a>'}}}
    })
    await flushPromises()
    return {wrapper, ...within(wrapper.element as HTMLElement)}
}

describe('en-tête de boutique', () => {
    beforeEach(() => localStorage.setItem('angel-theme', 'dark'))

    it('charge la navigation, restaure le thème et permet de le changer', async () => {
        const ui = await mountHeader()
        expect(ui.getByText('TEST SHOP')).toBeInTheDocument()
        expect(ui.getByText('Livraison offerte')).toBeInTheDocument()
        expect(ui.getByText('Nouveautés')).toHaveAttribute('href', '/categories/nouveautes')
        expect(ui.getByText('Maison')).toBeInTheDocument()
        expect(ui.getByText('2')).toBeInTheDocument()
        await waitFor(() => expect(document.documentElement.dataset.theme).toBe('dark'))
        const theme = ui.getByRole('button', {name: 'Mode clair'})
        await fireEvent.click(theme)
        expect(document.documentElement.dataset.theme).toBe('light')
        expect(localStorage.getItem('angel-theme')).toBe('light')
        expect(ui.getByLabelText('Se connecter')).toHaveAttribute('href', '/connexion')
        ui.wrapper.unmount()
    })

    it('affiche les accès du compte administrateur et ouvre le menu', async () => {
        const ui = await mountHeader({email: 'admin@example.test', role: 'admin'})
        expect(ui.getByText('Administrer')).toHaveAttribute('href', '/admin')
        expect(ui.getByLabelText('Mon compte')).toHaveAttribute('href', '/compte')
        await fireEvent.click(ui.getByRole('button', {name: 'Menu'}))
        expect(ui.getByRole('navigation').className).toContain('navOpen')
        ui.wrapper.unmount()
    })

    it('applique les libellés par défaut à un compte client', async () => {
        localStorage.removeItem('angel-theme')
        const ui = await mountHeader({email: 'client@example.test', role: 'customer'}, false)
        expect(ui.getByText(/Imprimé en France/)).toBeInTheDocument()
        expect(ui.getByText('ANGEL DREAMER')).toBeInTheDocument()
        expect(ui.queryByText('Administrer')).not.toBeInTheDocument()
        expect(ui.getByLabelText('Mon compte')).toHaveAttribute('href', '/compte')
        expect(document.documentElement.dataset.theme).toBe('light')
        ui.wrapper.unmount()
    })
})
