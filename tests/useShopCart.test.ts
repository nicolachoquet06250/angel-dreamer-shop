import {describe, expect, it} from 'vitest'
import {product} from './fixtures'
import {useShopCart} from '~/composables/useShopCart'

describe('panier', () => {
    it('ajoute, incrémente et retire un produit en recalculant les totaux', () => {
        const shop = useShopCart()
        shop.add(product)
        shop.add(product)
        expect(shop.cart.value).toEqual([{product, quantity: 2}])
        expect(shop.count.value).toBe(2)
        expect(shop.total.value).toBe(2980)
        expect(JSON.parse(localStorage.getItem('angel-cart')!)[0].quantity).toBe(2)
        shop.remove(product.id)
        expect(shop.cart.value).toEqual([])
        expect(shop.total.value).toBe(0)
    })

    it('restaure un panier valide depuis le stockage local', () => {
        localStorage.setItem('angel-cart', JSON.stringify([{product, quantity: 3}]))
        const shop = useShopCart()
        expect(shop.count.value).toBe(3)
    })

    it('ignore un stockage corrompu et permet une sauvegarde explicite', () => {
        localStorage.setItem('angel-cart', '{invalide')
        const shop = useShopCart()
        expect(shop.cart.value).toEqual([])
        shop.save()
        expect(localStorage.getItem('angel-cart')).toBe('[]')
    })
})
