import {fireEvent, render, screen} from '@testing-library/vue'
import {describe, expect, it, vi} from 'vitest'
import ProductCard from '~/components/ProductCard.vue'
import {product} from './fixtures'

const add = vi.fn()
Object.assign(globalThis, {
    useThemedImage: () => (image: unknown) => image,
    useShopCart: () => ({add}),
})

describe('carte produit', () => {
    it('présente les informations commerciales et ajoute le produit au panier', async () => {
        vi.useFakeTimers()
        render(ProductCard, {
            props: {product},
            global: {stubs: {NuxtLink: {props: ['to'], template: '<a :href="to"><slot /></a>'}}},
        })
        expect(screen.getByRole('heading', {name: product.name})).toBeInTheDocument()
        expect(screen.getByText('14,90 €')).toBeInTheDocument()
        expect(screen.getByRole('img', {name: product.name})).toHaveAttribute('src', 'light.png?size=300x200')
        const button = screen.getByRole('button', {name: `Ajouter ${product.name}`})
        await fireEvent.click(button)
        expect(add).toHaveBeenCalledWith(product)
        expect(button).toHaveTextContent('✓')
        vi.advanceTimersByTime(1500)
        await Promise.resolve()
        expect(button).toHaveTextContent('+')
    })

    it('ne rend pas d’image lorsqu’un produit n’en possède pas', () => {
        render(ProductCard, {
            props: {product: {...product, image: null}},
            global: {stubs: {NuxtLink: {template: '<a><slot /></a>'}}}
        })
        expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })
})
