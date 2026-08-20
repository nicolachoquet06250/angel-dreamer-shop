import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import type {H3Event} from "h3";

beforeEach(() => {
    vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
    vi.stubGlobal('createError', (value: unknown) => value)
    vi.stubGlobal('ready', vi.fn())
})

afterEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
})

const load = {
    // @ts-ignore
    login: () => import('~/server/api/auth/login.post.ts'),
    // @ts-ignore
    register: () => import('~/server/api/auth/register.post.ts'),
    // @ts-ignore
    changePassword: () => import('~/server/api/auth/change-password.post.ts'),
    // @ts-ignore
    profile: () => import('~/server/api/auth/profile.put.ts'),
    // @ts-ignore
    me: () => import('~/server/api/auth/me.get.ts'),
    // @ts-ignore
    logout: () => import('~/server/api/auth/logout.post.ts')
}

describe('connexion', () => {
    it('normalise l’e-mail, vérifie le mot de passe et ouvre une session', async () => {
        const user = {
            id: 1,
            email: 'admin@example.test',
            password_hash: 'hash',
            role: 'admin',
            active: 1,
            must_change_password: 1
        }
        const bind = vi.fn(() => ({first: async () => user}))
        vi.stubGlobal('readBody', async () => ({email: ' ADMIN@Example.Test ', password: 'secret'}))
        vi.stubGlobal('database', () => ({prepare: () => ({bind})}))
        vi.stubGlobal('verifyPassword', vi.fn(async () => true))
        const signSession = vi.fn()
        vi.stubGlobal('signSession', signSession)
        const {default: handler} = await load.login()

        await expect(handler({} as H3Event<EventHandlerRequest>)).resolves.toEqual({
            user: {
                id: 1, email: user.email, role: 'admin', mustChangePassword: true
            }
        })
        expect(bind).toHaveBeenCalledWith('admin@example.test')
        expect(signSession).toHaveBeenCalledWith({}, user)
    })

    it.each([
        ['utilisateur absent', null, true], ['compte désactivé', {active: 0}, true], ['mauvais mot de passe', {
            active: 1,
            password_hash: 'hash'
        }, false]
    ])('refuse : %s', async (_label, user, valid) => {
        vi.stubGlobal('readBody', async () => ({email: 'a@example.test', password: 'bad'}))
        vi.stubGlobal('database', () => ({prepare: () => ({bind: () => ({first: async () => user})})}))
        vi.stubGlobal('verifyPassword', async () => valid)
        const {default: handler} = await load.login()
        await expect(handler({} as H3Event<EventHandlerRequest>)).rejects.toMatchObject({statusCode: 401})
    })

    it('traite un formulaire vide comme des identifiants invalides', async () => {
        vi.stubGlobal('readBody', async () => ({}))
        vi.stubGlobal('database', () => ({prepare: () => ({bind: () => ({first: async () => null})})}))
        const {default: handler} = await load.login()
        await expect(handler({} as H3Event<EventHandlerRequest>)).rejects.toMatchObject({statusCode: 401})
    })
})

describe('inscription', () => {
    it.each([
        [{firstName: '', lastName: 'Nom', email: 'a@example.test', password: '1234567890'}, 'prénom'],
        [{firstName: 'Prénom', lastName: 'Nom', email: 'invalide', password: '1234567890'}, 'e-mail'],
        [{firstName: 'Prénom', lastName: 'Nom', email: 'a@example.test', password: 'court'}, 'mot de passe']
    ])('valide les données obligatoires (%s)', async (body) => {
        vi.stubGlobal('readBody', async () => body)
        const {default: handler} = await load.register()
        await expect(handler({} as H3Event<EventHandlerRequest>)).rejects.toMatchObject({statusCode: 400})
    })

    it.each([
        {firstName: 'a'.repeat(81), lastName: 'Nom', email: 'a@example.test', password: '1234567890'},
        {firstName: 'Ada', lastName: 'b'.repeat(81), email: 'a@example.test', password: '1234567890'},
        {firstName: 'Ada', lastName: 'Nom', email: 'a@example.test', password: 'x'.repeat(129)}
    ])('refuse les valeurs dépassant les limites', async body => {
        vi.stubGlobal('readBody', async () => body)
        const {default: handler} = await load.register()
        await expect(handler({} as H3Event<EventHandlerRequest>)).rejects.toMatchObject({statusCode: 400})
    })

    it('refuse un e-mail déjà utilisé', async () => {
        vi.stubGlobal('readBody', async () => ({
            firstName: 'Ada',
            lastName: 'Lovelace',
            email: 'ADA@example.test',
            password: '1234567890'
        }))
        vi.stubGlobal('database', () => ({prepare: () => ({bind: () => ({first: async () => ({id: 1})})})}))
        const {default: handler} = await load.register()
        await expect(handler({} as H3Event<EventHandlerRequest>)).rejects.toMatchObject({statusCode: 409})
    })

    it('crée un client, le connecte et renvoie HTTP 201', async () => {
        const run = vi.fn()
        let selectCount = 0
        const db = {
            prepare: vi.fn((sql: string) => ({
                bind: (...args: unknown[]) => ({
                    first: async () =>
                        sql.startsWith('SELECT id FROM')
                            ? (() => {
                                selectCount++
                                return undefined;
                            })() : ({
                                id: 8,
                                email: 'ada@example.test',
                                role: 'customer'
                            }),
                    run: async () => run(...args)
                })
            }))
        }
        vi.stubGlobal('readBody', async () => ({
            firstName: ' Ada ',
            lastName: ' Lovelace ',
            email: ' ADA@example.test ',
            password: '1234567890'
        }))
        vi.stubGlobal('database', () => db)
        vi.stubGlobal('hashPassword', async () => 'hash-securise')
        const signSession = vi.fn()
        vi.stubGlobal('signSession', signSession)
        const status = vi.fn()
        vi.stubGlobal('setResponseStatus', status)
        const {default: handler} = await load.register()

        await expect(handler({} as H3Event<EventHandlerRequest>)).resolves.toEqual({user: {id: 8, email: 'ada@example.test', role: 'customer'}})
        expect(run).toHaveBeenCalled()
        expect(signSession).toHaveBeenCalled()
        expect(status).toHaveBeenCalledWith({}, 201)
        expect(selectCount).toBe(1)
    })
})

describe('compte utilisateur', () => {
    it('retourne null sans session et mappe une session complète', async () => {
        vi.stubGlobal('sessionUser', vi.fn(async () => null))
        let module = await load.me()
        await expect(module.default({} as H3Event<EventHandlerRequest>)).resolves.toEqual({user: null})
        vi.resetModules()
        vi.stubGlobal('sessionUser', vi.fn(async () => ({
            id: 2,
            email: 'a@b.fr',
            first_name: null,
            last_name: 'Nom',
            role: 'customer',
            must_change_password: 1,
            created_at: 'date'
        })))
        module = await load.me()
        await expect(module.default({} as H3Event<EventHandlerRequest>)).resolves.toEqual({
            user: {
                id: 2,
                email: 'a@b.fr',
                firstName: '',
                lastName: 'Nom',
                role: 'customer',
                mustChangePassword: true,
                createdAt: 'date'
            }
        })
        vi.stubGlobal('sessionUser', vi.fn(async () => ({
            id: 3, email: 'c@d.fr', first_name: 'Ada', last_name: null, role: 'customer',
            must_change_password: 0, created_at: 'date'
        })))
        await expect(module.default({} as H3Event<EventHandlerRequest>)).resolves.toEqual({
            user: {id: 3, email: 'c@d.fr', firstName: 'Ada', lastName: '', role: 'customer', mustChangePassword: false, createdAt: 'date'}
        })
    })

    it('valide puis enregistre le profil', async () => {
        const run = vi.fn()
        vi.stubGlobal('requireUser', async () => ({id: 5}))
        vi.stubGlobal('database', () => ({prepare: () => ({bind: (...args: unknown[]) => ({run: () => run(...args)})})}))
        vi.stubGlobal('readBody', async () => ({firstName: ' Ada ', lastName: ' Lovelace '}))
        const {default: handler} = await load.profile()
        await expect(handler({} as H3Event<EventHandlerRequest>)).resolves.toEqual({user: {firstName: 'Ada', lastName: 'Lovelace'}})
        expect(run).toHaveBeenCalledWith('Ada', 'Lovelace', 5)
    })

    it.each([{firstName: '', lastName: 'Nom'}, {
        firstName: 'a'.repeat(81),
        lastName: 'Nom'
    }])('refuse un profil invalide', async body => {
        vi.stubGlobal('requireUser', async () => ({id: 5}))
        vi.stubGlobal('readBody', async () => body)
        const {default: handler} = await load.profile()
        await expect(handler({} as H3Event<EventHandlerRequest>)).rejects.toMatchObject({statusCode: 400})
    })

    it('refuse également un nom trop long', async () => {
        vi.stubGlobal('requireUser', async () => ({id: 5}))
        vi.stubGlobal('readBody', async () => ({firstName: 'Ada', lastName: 'b'.repeat(81)}))
        const {default: handler} = await load.profile()
        await expect(handler({} as H3Event<EventHandlerRequest>)).rejects.toMatchObject({statusCode: 400})
    })

    it('impose une session et un mot de passe fort avant le changement', async () => {
        vi.stubGlobal('sessionUser', async () => null)
        let module = await load.changePassword()
        await expect(module.default({} as H3Event<EventHandlerRequest>)).rejects.toMatchObject({statusCode: 401})
        vi.resetModules()
        vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
        vi.stubGlobal('sessionUser', async () => ({id: 1}))
        vi.stubGlobal('readBody', async () => ({password: 'trop-court'}))
        module = await load.changePassword()
        await expect(module.default({} as H3Event<EventHandlerRequest>)).rejects.toMatchObject({statusCode: 400})
    })

    it('change le mot de passe, lève l’obligation et renouvelle la session', async () => {
        const run = vi.fn()
        const user = {id: 1, email: 'admin@example.test', role: 'admin'}
        vi.stubGlobal('sessionUser', async () => user)
        vi.stubGlobal('readBody', async () => ({password: 'mot-de-passe-solide'}))
        vi.stubGlobal('hashPassword', async () => 'nouveau-hash')
        vi.stubGlobal('database', () => ({prepare: () => ({bind: (...args: unknown[]) => ({run: () => run(...args)})})}))
        const signSession = vi.fn()
        vi.stubGlobal('signSession', signSession)
        const {default: handler} = await load.changePassword()
        await expect(handler({} as H3Event<EventHandlerRequest>)).resolves.toEqual({ok: true})
        expect(run).toHaveBeenCalledWith('nouveau-hash', 1)
        expect(signSession).toHaveBeenCalledWith({}, user)
    })

    it('détruit la session à la déconnexion', async () => {
        const clear = vi.fn()
        vi.stubGlobal('clearAuthSession', clear)
        const {default: handler} = await load.logout()
        expect(handler({} as H3Event<EventHandlerRequest>)).toEqual({ok: true})
        expect(clear).toHaveBeenCalledWith({})
    })
})
