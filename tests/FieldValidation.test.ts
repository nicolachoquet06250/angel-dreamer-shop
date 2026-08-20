import {render, screen} from '@testing-library/vue'
import {describe, expect, it} from 'vitest'
import FieldValidation from '~/components/FieldValidation.vue'

describe('FieldValidation', () => {
    it('affiche uniquement les messages associés au champ avec leur niveau', () => {
        render(FieldValidation, {
            props: {
                field: 'title', issues: [
                    {field: 'title', level: 'error', message: 'Titre requis'},
                    {field: 'title', level: 'warning', message: 'Titre court'},
                    {field: 'other', level: 'info', message: 'Invisible'},
                ]
            }
        })
        expect(screen.getByText('Titre requis')).toBeInTheDocument()
        expect(screen.getByText('Titre court')).toBeInTheDocument()
        expect(screen.queryByText('Invisible')).not.toBeInTheDocument()
    })

    it('ne rend rien en absence de message', () => {
        const {container} = render(FieldValidation, {props: {field: 'title'}})
        expect(container).toBeEmptyDOMElement()
    })
})
