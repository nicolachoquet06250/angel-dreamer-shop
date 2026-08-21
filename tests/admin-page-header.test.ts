import {describe, expect, it} from 'vitest'
import AdminPageSource from '~/pages/admin.vue?raw'

const pagesPanelStart = AdminPageSource.indexOf(`<section v-if="activeMainTab==='pages'" :class="styles.adminPanel">`)
const seoPanelStart = AdminPageSource.indexOf(`<section v-else-if="activeTab==='seo'"`)
const pagesPanel = pagesPanelStart >= 0 && seoPanelStart > pagesPanelStart
    ? AdminPageSource.slice(pagesPanelStart, seoPanelStart)
    : ''

describe('design de la section Pages', () => {
    it('regroupe le titre, les actions, les sous-onglets et les éditeurs dans une seule carte', () => {
        expect(pagesPanel).not.toBe('')
        expect(pagesPanel.match(/:class="styles\.adminPanel"/g)).toHaveLength(1)
        expect(pagesPanel.match(/styles\.panelTitle/g)).toHaveLength(1)

        const headerIndex = pagesPanel.indexOf(':class="[styles.panelTitle,actionStyles.responsivePanelTitle]"')
        const actionsIndex = pagesPanel.indexOf(':class="actionStyles.actions"')
        const saveIndex = pagesPanel.indexOf('@click="saveActivePage"')
        const subTabsIndex = pagesPanel.indexOf('<AdminSubTabs')
        const firstEditorIndex = pagesPanel.indexOf(`id="panel-content"`)

        expect(headerIndex).toBeGreaterThan(-1)
        expect(actionsIndex).toBeGreaterThan(headerIndex)
        expect(saveIndex).toBeGreaterThan(actionsIndex)
        expect(subTabsIndex).toBeGreaterThan(saveIndex)
        expect(firstEditorIndex).toBeGreaterThan(subTabsIndex)
        expect(pagesPanel).toContain('<small>CONTENU ET APPARENCE</small>')
        expect(pagesPanel).toContain('<h2>Pages</h2>')
        expect(pagesPanel).toContain('<p>Gérez le contenu et l’apparence des différentes pages de votre boutique.</p>')
    })

    it('utilise des en-têtes légers dans les huit panneaux de page', () => {
        expect(pagesPanel.match(/:class="actionStyles\.pageEditorHeader"/g)).toHaveLength(8)
        expect(pagesPanel.match(/role="tabpanel"/g)).toHaveLength(8)
    })

    it('raccorde les contrôles communs aux états et sauvegardes de chaque page', () => {
        expect(AdminPageSource).toContain('const showPageThemePreview = computed(')
        expect(AdminPageSource).toContain('const activePagePreviewDark = computed<boolean>({')
        expect(pagesPanel).toContain('v-if="showPageThemePreview"')
        expect(pagesPanel).toContain(':aria-pressed="activePagePreviewDark"')

        const saveActions = AdminPageSource.match(/const pageSaveActions:[\s\S]*?\n};/)?.[0] ?? ''
        expect(saveActions).toContain('content: saveContent')
        expect(saveActions).toContain('category: saveCategoryPage')
        expect(saveActions).toContain('universe: saveUniversePage')
        expect(saveActions).toContain('cart: saveCartSeo')
        expect(saveActions).toContain('profile: saveProfileSeo')
        expect(saveActions).toContain('contact: saveContact')
        expect(saveActions).toContain('cgu: saveCgu')
        expect(saveActions).toContain('cgv: saveCgv')
    })
})