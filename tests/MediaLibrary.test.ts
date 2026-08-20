import {fireEvent, render, screen, waitFor} from '@testing-library/vue'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import MediaLibrary from '~/components/MediaLibrary.vue'

describe('glisser-déposer de la médiathèque', () => {
    beforeEach(() => vi.stubGlobal('$fetch', vi.fn().mockResolvedValue([])))

    it('affecte les fichiers déposés aux variantes claire et sombre', async () => {
        render(MediaLibrary, {global: {stubs: {FieldValidation: true}}})
        await waitFor(() => expect(globalThis.$fetch).toHaveBeenCalledWith('/api/admin/images'))

        const lightZone = screen.getByText('Choisir la version claire').closest('label')!
        const light = new File(['light'], 'visuel-clair.png', {type: 'image/png'})
        await fireEvent.dragEnter(lightZone, {dataTransfer: {files: [light]}})
        expect(screen.getByText('Déposez la version claire ici')).toBeInTheDocument()
        await fireEvent.drop(lightZone, {dataTransfer: {files: [light]}})
        expect(screen.getByText('visuel-clair.png')).toBeInTheDocument()

        const darkZone = screen.getByText('Choisir une alternative sombre').closest('label')!
        const dark = new File(['dark'], 'visuel-sombre.webp', {type: 'image/webp'})
        await fireEvent.drop(darkZone, {dataTransfer: {files: [dark]}})
        expect(screen.getByText('visuel-sombre.webp')).toBeInTheDocument()
    })

    it('affiche la validation habituelle pour un fichier déposé invalide', async () => {
        render(MediaLibrary, {
            global: {
                stubs: {
                    FieldValidation: {
                        props: ['issues', 'field'],
                        template: '<p>{{ issues?.find((item) => item.field === field)?.message }}</p>'
                    }
                }
            }
        })
        const zone = screen.getByText('Choisir la version claire').closest('label')!
        await fireEvent.drop(zone, {dataTransfer: {files: [new File(['texte'], 'document.txt', {type: 'text/plain'})]}})
        expect(screen.getByText('Formats acceptés : JPG, PNG, WebP ou GIF.')).toBeInTheDocument()
    })

    it('désactive les uploads et ignore le glisser-déposer en lecture seule', async () => {
        render(MediaLibrary, {props: {readonly: true}, global: {stubs: {FieldValidation: true}}})
        expect(screen.getByText(/consultation uniquement/)).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Ajouter à la médiathèque'})).toBeDisabled()
        const zone = screen.getByText('Choisir la version claire').closest('label')!
        await fireEvent.drop(zone, {dataTransfer: {files: [new File(['light'], 'interdit.png', {type: 'image/png'})]}})
        expect(screen.queryByText('interdit.png')).not.toBeInTheDocument()
    })
})
