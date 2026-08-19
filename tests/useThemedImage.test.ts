import {beforeEach, describe, expect, it} from 'vitest'
import {darkImage, lightImage} from './fixtures'
import {resolveImageVariant, useThemedImage} from '~/composables/useThemedImage'

describe('gestion des variantes d’image', () => {
    beforeEach(() => {
        lightImage.darkVariant = darkImage
    })

    it('retourne null sans image et conserve la version claire', () => {
        expect(resolveImageVariant(null, false)).toBeNull()
        expect(resolveImageVariant(lightImage, false)).toBe(lightImage)
    })

    it('utilise le contenu sombre sans perdre les dimensions administrées', () => {
        expect(resolveImageVariant(lightImage, true)).toEqual({...darkImage, width: 300, height: 200})
    })

    it('suit le thème global et revient à la version claire sans alternative', () => {
        const themed = useThemedImage()
        const theme = useState<boolean>('theme', () => false)
        expect(themed(lightImage)?.content).toBe('light.png')
        theme.value = true
        expect(themed(lightImage)?.content).toBe('dark.png')
        lightImage.darkVariant = null
        expect(themed(lightImage)).toBe(lightImage)
    })
})
