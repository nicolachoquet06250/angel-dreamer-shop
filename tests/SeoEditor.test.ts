import {fireEvent, render, screen} from '@testing-library/vue'
import {defineComponent} from 'vue'
import {describe, expect, it, vi} from 'vitest'
import SeoEditor from '~/components/SeoEditor.vue'
import {defaultSiteContent} from '~/types/shop'

Object.assign(globalThis, {
    useRequestURL: () => new URL('https://angel-dreamer.test/admin/seo/accueil')
})

const AdminSubTabsStub = defineComponent({
    props: {
        tabs: {type: Array, required: true},
        active: {type: String, required: true}
    },
    emits: ['select'],
    template: '<div><span data-testid="active-section">{{ active }}</span><button type="button" @click="$emit(\'select\', \'category\')">Changer de section</button></div>'
})

const SeoPageTemplatesStub = defineComponent({
    props: {page: {type: String, required: true}},
    template: '<div data-testid="page-template">{{ page }}</div>'
})

describe('éditeur de référencement', () => {
    it('affiche la section contrôlée par le parent et demande les changements', async () => {
        const updateSection = vi.fn()
        const content = {...defaultSiteContent}
        const view = render(SeoEditor, {
            props: {
                modelValue: content,
                section: 'product',
                'onUpdate:section': updateSection
            },
            global: {
                stubs: {
                    AdminSubTabs: AdminSubTabsStub,
                    SeoPageTemplates: SeoPageTemplatesStub,
                    FieldValidation: true,
                    ImageUpload: true
                }
            }
        })

        expect(screen.getByTestId('active-section')).toHaveTextContent('product')
        expect(screen.getByTestId('page-template')).toHaveTextContent('product')

        await fireEvent.click(screen.getByRole('button', {name: 'Changer de section'}))

        expect(updateSection).toHaveBeenCalledWith('category')
        expect(screen.getByTestId('page-template')).toHaveTextContent('product')

        await view.rerender({
            modelValue: content,
            section: 'universe',
            'onUpdate:section': updateSection
        })

        expect(screen.getByTestId('active-section')).toHaveTextContent('universe')
        expect(screen.getByTestId('page-template')).toHaveTextContent('universe')
    })
})