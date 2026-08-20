import {fireEvent, render, screen} from '@testing-library/vue'
import {nextTick} from 'vue'
import {describe, expect, it, vi} from 'vitest'
import HorizontalCarousel from '~/components/HorizontalCarousel.vue'

let resize: ResizeObserverCallback
let disconnect: ReturnType<typeof vi.fn>

class ResizeObserverMock {
    constructor(callback: ResizeObserverCallback) {
        resize = callback;
        disconnect = vi.fn()
    }

    observe = vi.fn()
    disconnect = (...args: unknown[]) => disconnect(...args)
    unobserve = vi.fn()
}

globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver

function dimensions(element: HTMLElement, values: Partial<Record<'scrollWidth' | 'clientWidth' | 'scrollLeft', number>>) {
    for (const [key, value] of Object.entries(values)) Object.defineProperty(element, key, {
        configurable: true,
        writable: true,
        value
    })
}

describe('carrousel horizontal', () => {
    it('masque les contrôles sans débordement', async () => {
        const view = render(HorizontalCarousel, {
            props: {label: 'les univers'},
            slots: {default: '<div>A</div><div>B</div>'}
        })
        const track = screen.getByText('A').parentElement!
        dimensions(track, {scrollWidth: 200, clientWidth: 200, scrollLeft: 0})
        resize([], {} as ResizeObserver)
        await nextTick()
        expect(document.querySelector<HTMLButtonElement>('button[aria-label$="droite"]')).not.toBeVisible()
        await view.rerender({label: 'la collection'})
        view.unmount()
        expect(disconnect).toHaveBeenCalledOnce()
    })

    it('fait défiler les éléments et met à jour les flèches', async () => {
        render(HorizontalCarousel, {
            props: {label: 'les univers'},
            slots: {default: '<div>A</div><div>B</div><div>C</div>'}
        })
        const track = screen.getByText('A').parentElement!
        dimensions(track, {scrollWidth: 750, clientWidth: 250, scrollLeft: 0})
        Array.from(track.children).forEach((child, index) => {
            Object.defineProperty(child, 'offsetLeft', {value: index * 250})
            Object.defineProperty(child, 'offsetWidth', {value: 250})
        })
        track.scrollTo = vi.fn()
        resize([], {} as ResizeObserver)
        await nextTick()
        const next = screen.getByRole('button', {name: /droite/})
        expect(next).toBeVisible()
        await fireEvent.click(next)
        expect(track.scrollTo).toHaveBeenCalledWith({left: 250, behavior: 'smooth'})
        const previous = screen.getByRole('button', {name: /gauche/})
        expect(previous).toBeVisible()
        await fireEvent.click(previous)
        expect(track.scrollTo).toHaveBeenLastCalledWith({left: 0, behavior: 'smooth'})
        await fireEvent.click(next)
        dimensions(track, {scrollLeft: 250})
        await fireEvent(track, new Event('scrollend'))
        expect(next).toBeVisible()
        dimensions(track, {scrollLeft: 500})
        await fireEvent(track, new Event('scrollend'))
        expect(next).not.toBeVisible()
    })

    it('aligne les onglets sur leur bord gauche', async () => {
        render(HorizontalCarousel, {
            props: {label: "les onglets d’administration"},
            slots: {default: '<button>A</button><button>B</button>'}
        })
        const track = screen.getByText('A').parentElement!
        dimensions(track, {scrollWidth: 400, clientWidth: 200, scrollLeft: 0})
        Object.defineProperty(track.children[1], 'offsetLeft', {value: 180})
        track.scrollTo = vi.fn()
        resize([], {} as ResizeObserver)
        await nextTick()
        await fireEvent.click(screen.getByRole('button', {name: /droite/}))
        expect(track.scrollTo).toHaveBeenCalledWith({left: 180, behavior: 'smooth'})
        dimensions(track, {scrollLeft: 180})
        await fireEvent(track, new Event('scrollend'))
        expect(track).toHaveAttribute('role', 'tablist')
    })

    it('centre au chargement l’onglet actif lorsque la barre déborde', async () => {
        render(HorizontalCarousel, {
            props: {label: "les onglets d’administration"},
            slots: {default: '<button>A</button><button aria-selected="true">B</button><button>C</button>'}
        })
        const track = screen.getByText('A').parentElement!
        dimensions(track, {scrollWidth: 600, clientWidth: 200, scrollLeft: 0})
        Object.defineProperty(track.children[1], 'offsetLeft', {value: 220})
        Object.defineProperty(track.children[1], 'offsetWidth', {value: 80})
        track.scrollTo = vi.fn()
        resize([], {} as ResizeObserver)
        await nextTick()
        await nextTick()
        expect(track.scrollTo).toHaveBeenCalledWith({left: 160, behavior: 'auto'})
        expect(screen.getByRole('button', {name: /gauche/})).toBeVisible()
    })
})
