import {afterEach, describe, expect, it, vi} from 'vitest'
import {
    clearAuthSession,
    hashPassword,
    requireAdmin,
    requireUser,
    sessionUser,
    signSession,
    verifyPassword
} from '~/server/utils/auth'

afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
})

describe('mots de passe', () => {
    it('produit un hash salé vérifiable sans stocker le mot de passe', async () => {
        const hash = await hashPassword('Mot-de-passe-très-solide')
        expect(hash).not.toContain('Mot-de-passe-très-solide')
        await expect(verifyPassword('Mot-de-passe-très-solide', hash)).resolves.toBe(true)
        await expect(verifyPassword('mauvais', hash)).resolves.toBe(false)
    })

    it('refuse les formats de hash invalides', async () => {
        await expect(verifyPassword('secret', '')).resolves.toBe(false)
        await expect(verifyPassword('secret', 'sel.')).resolves.toBe(false)
    })
})

describe('session JWT', () => {
    it('refuse de signer sans secret', async () => {
        vi.stubGlobal('useRuntimeConfig', () => ({jwtSecret: ''}))
        vi.stubGlobal('createError', (value: unknown) => value)
        await expect(signSession({} as any, {id: 1, email: 'a@example.test', role: 'admin'}))
            .rejects.toMatchObject({statusCode: 503})
    })

    it('signe un cookie sécurisé puis retrouve uniquement un utilisateur actif', async () => {
        let token = ''
        const user = {id: 4, email: 'admin@example.test', role: 'admin', active: 1, must_change_password: 0}
        vi.stubGlobal('useRuntimeConfig', () => ({jwtSecret: 'un-secret-de-test-suffisamment-long'}))
        vi.stubGlobal('setCookie', (_event: unknown, name: string, value: string, options: any) => {
            expect(name).toBe('angel_session')
            expect(options).toMatchObject({httpOnly: true, sameSite: 'lax', path: '/', maxAge: 604800})
            token = value
        })
        await signSession({} as any, user)
        vi.stubGlobal('getCookie', () => token)
        vi.stubGlobal('database', () => ({prepare: () => ({bind: () => ({first: async () => user})})}))
        vi.stubGlobal('ready', vi.fn())
        await expect(sessionUser({} as any)).resolves.toEqual(user)
    })

    it('rejette une absence de cookie et un JWT altéré', async () => {
        vi.stubGlobal('getCookie', () => undefined)
        await expect(sessionUser({} as any)).resolves.toBeNull()
        vi.stubGlobal('getCookie', () => 'abc.def.signature-invalide')
        vi.stubGlobal('useRuntimeConfig', () => ({jwtSecret: 'secret'}))
        await expect(sessionUser({} as any)).resolves.toBeNull()
        vi.stubGlobal('getCookie', () => '%.%.%')
        await expect(sessionUser({} as any)).resolves.toBeNull()
    })

    it('applique les droits utilisateur, le changement obligatoire et le rôle admin', async () => {
        vi.stubGlobal('createError', (value: unknown) => value)
        vi.stubGlobal('getCookie', () => undefined)
        await expect(requireUser({} as any)).rejects.toMatchObject({statusCode: 401})

        let token = ''
        let currentUser: any = {id: 1, role: 'admin', must_change_password: 1}
        vi.stubGlobal('useRuntimeConfig', () => ({jwtSecret: 'secret-de-test-pour-les-droits'}))
        vi.stubGlobal('setCookie', (_event: unknown, _name: string, value: string) => {
            token = value
        })
        await signSession({} as any, {id: 1, email: 'user@example.test', role: 'admin'})
        vi.stubGlobal('getCookie', () => token)
        vi.stubGlobal('database', () => ({prepare: () => ({bind: () => ({first: async () => currentUser})})}))
        vi.stubGlobal('ready', vi.fn())

        await expect(requireUser({} as any)).rejects.toMatchObject({statusCode: 428})
        currentUser = {id: 1, role: 'customer', must_change_password: 0}
        await expect(requireAdmin({} as any)).rejects.toMatchObject({statusCode: 403})
        currentUser = {id: 1, role: 'admin', must_change_password: 0}
        await expect(requireAdmin({} as any)).resolves.toMatchObject({role: 'admin'})
        currentUser = {id: 2, role: 'demo', must_change_password: 0}
        await expect(requireAdmin({method: 'GET'} as any)).resolves.toMatchObject({role: 'demo'})
        await expect(requireAdmin({method: 'POST'} as any)).rejects.toMatchObject({
            statusCode: 403,
            statusMessage: expect.stringContaining('lecture seule')
        })
    })

    it('supprime le cookie de session sur tout le site', () => {
        const remove = vi.fn()
        vi.stubGlobal('deleteCookie', remove)
        clearAuthSession({} as any)
        expect(remove).toHaveBeenCalledWith({}, 'angel_session', {path: '/'})
    })
})
