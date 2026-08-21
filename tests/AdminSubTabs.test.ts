import {fireEvent, render, screen} from '@testing-library/vue'
import {defineComponent} from 'vue'
import {describe, expect, it} from 'vitest'
import AdminSubTabs from '~/components/AdminSubTabs.vue'
import AdminSubTabsSource from '~/components/AdminSubTabs.vue?raw'

const HorizontalCarouselStub = defineComponent({
    props: {
        label: {type: String, required: true},
        trackClass: {type: String, default: undefined}
    },
    template: '<div role="tablist" :aria-label="label" :class="trackClass"><slot /></div>'
})

describe('sous-onglets de l’administration', () => {
    const tabs = [
        {id: 'home', label: 'Page d’accueil'},
        {id: 'category', label: 'Page catégorie'}
    ]

    it('identifie l’onglet actif et le panneau associé', () => {
        render(AdminSubTabs, {
            props: {tabs, active: 'home', label: 'les pages', idPrefix: 'page-tab', panelPrefix: 'panel'},
            global: {stubs: {HorizontalCarousel: HorizontalCarouselStub}}
        })

        const [home, category] = screen.getAllByRole('tab')
        expect(screen.getByRole('tablist', {name: 'les pages'})).toBeVisible()
        expect(home).toHaveAttribute('id', 'page-tab-home')
        expect(home).toHaveAttribute('aria-selected', 'true')
        expect(home).toHaveAttribute('aria-controls', 'panel-home')
        expect(category).toHaveAttribute('aria-selected', 'false')
    })

    it('demande la sélection du sous-onglet cliqué', async () => {
        const view = render(AdminSubTabs, {
            props: {tabs, active: 'home', label: 'les pages', idPrefix: 'page-tab', panelPrefix: 'panel'},
            global: {stubs: {HorizontalCarousel: HorizontalCarouselStub}}
        })

        await fireEvent.click(screen.getByRole('tab', {name: 'Page catégorie'}))

        expect(view.emitted().select).toEqual([['category']])
    })

    it('garde les libellés sur une ligne et rend la piste défilable', () => {
        const styles = AdminSubTabsSource.match(/<style module>([\s\S]*?)<\/style>/)?.[1] ?? ''

        expect(styles).toMatch(/\.subTabs\s*\{[^}]*overflow-x:\s*auto;/)
        expect(styles).toMatch(/\.subTabs button\s*\{[^}]*flex:\s*0 0 auto;/)
        expect(styles).toMatch(/\.subTabs button\s*\{[^}]*white-space:\s*nowrap;/)
    })
})