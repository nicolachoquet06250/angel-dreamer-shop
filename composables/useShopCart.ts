import type {CartLine, Product} from '~/types/shop'

export function useShopCart() {
    const cart = useState<CartLine[]>('cart', () => [])
    const client = typeof window !== 'undefined'
    if (client && !cart.value.length) {
        try {
            cart.value = JSON.parse(localStorage.getItem('angel-cart') || '[]')
        } catch {
        }
    }
    const save = () => {
        if (client) localStorage.setItem('angel-cart', JSON.stringify(cart.value))
    }
    const add = (product: Product) => {
        const line = cart.value.find(l => l.product.id === product.id);
        if (line) line.quantity++; else cart.value.push({product, quantity: 1});
        save()
    }
    const remove = (id: number) => {
        cart.value = cart.value.filter(l => l.product.id !== id);
        save()
    }
    const count = computed(() => cart.value.reduce((s, l) => s + l.quantity, 0));
    const total = computed(() => cart.value.reduce((s, l) => s + l.product.priceCents * l.quantity, 0))
    return {cart, add, remove, count, total, save}
}
