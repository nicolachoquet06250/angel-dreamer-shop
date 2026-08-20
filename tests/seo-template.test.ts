import {describe, expect, it} from 'vitest'
import {renderSeoTemplate} from '~/utils/seo-template'

describe('modèles SEO dynamiques', () => {
    it('remplace toutes les occurrences et normalise les espaces', () => {
        expect(renderSeoTemplate('  [Produit]  par [Site] — [Produit] ', {Produit: 'Mug', Site: 'Angel Dreamer'}))
            .toBe('Mug par Angel Dreamer — Mug')
    })

    it('remplace les valeurs absentes par une chaîne vide', () => {
        expect(renderSeoTemplate('[Nom] [Option]', {Nom: 'Affiche', Option: null})).toBe('Affiche')
        expect(renderSeoTemplate('', {})).toBe('')
    })

    it('accepte les valeurs numériques', () => {
        expect(renderSeoTemplate('[Total] produits', {Total: 4})).toBe('4 produits')
    })
})
