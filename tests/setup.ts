import '@testing-library/jest-dom/vitest'
import {cleanup} from '@testing-library/vue'
import {afterEach, beforeEach, vi} from 'vitest'
import {computed, nextTick, onBeforeUnmount, onMounted, onUpdated, reactive, ref, useCssModule} from 'vue'

const states = new Map<string, ReturnType<typeof ref>>()

Object.assign(globalThis, {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    onUpdated,
    reactive,
    ref,
    useCssModule,
    useState: <T>(key: string, init: () => T) => {
        if (!states.has(key)) states.set(key, ref(init()))
        return states.get(key)
    },
})

beforeEach(() => {
    states.clear()
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
})

afterEach(() => {
    cleanup()
    vi.useRealTimers()
})
