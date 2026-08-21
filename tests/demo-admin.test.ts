import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import type {H3Event} from 'h3'

beforeEach(() => {
    vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
    vi.stubGlobal('createError', (value: unknown) => value)
    vi.stubGlobal('ready', vi.fn())
})

afterEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

describe('création d’un utilisateur de démonstration', () => {
    it('crée un compte actif avec le rôle demo et un mot de passe fort', async () => {
        const run = vi.fn(async () => ({lastInsertRowid: 42}))
        const prepare = vi.fn(() => ({bind: (...args: unknown[]) =>
                // @ts-ignore
                ({run: () => run(...args)})}))
        vi.stubGlobal('requireAdmin', vi.fn(async () => ({id: 1, role: 'admin'})))
        vi.stubGlobal('database', () => ({prepare}))
        vi.stubGlobal('hashPassword', vi.fn(async () => 'mot-de-passe-hache'))
        // @ts-ignore
        const {default: handler} = await import('#server/api/admin/users/demo.post.ts')
        const result = await handler({method: 'POST'} as H3Event)
        expect(result.user).toMatchObject({id: 42, role: 'demo', active: true})
        expect(result.user.email).toMatch(/^demo-[a-f0-9]{16}@demo\.angel-dreamer\.local$/)
        expect(result.password).toHaveLength(24)
        expect(prepare).toHaveBeenCalledWith(expect.stringContaining("'demo',1,0"))
        expect(run).toHaveBeenCalledWith(result.user.email, 'mot-de-passe-hache', 1, expect.any(String))
    })

    it('vérifie les droits avant toute écriture', async () => {
        const denied = {statusCode: 403}
        vi.stubGlobal('requireAdmin', vi.fn(async () => {
            throw denied
        }))
        const database = vi.fn()
        vi.stubGlobal('database', database)
        // @ts-ignore
        const {default: handler} = await import('#server/api/admin/users/demo.post.ts')
        await expect(handler({method: 'POST'} as H3Event)).rejects.toBe(denied)
        expect(database).not.toHaveBeenCalled()
    })
})

describe('suppression d’un utilisateur de démonstration', () => {
    it('supprime uniquement un compte portant le rôle demo', async () => {
        const deleted = vi.fn()
        const db = {
            prepare: vi.fn((sql: string) => ({
                bind: (...args: unknown[]) => ({
                    first: async () => ({id: 9, role: 'demo'}),
                    run: async () => deleted(sql, ...args)
                })
            }))
        }
        vi.stubGlobal('requireAdmin', vi.fn())
        vi.stubGlobal('getRouterParam', () => '9')
        vi.stubGlobal('database', () => db)
        // @ts-ignore
        const {default: handler} = await import('#server/api/admin/users/[id].delete.ts')
        await expect(handler({method: 'DELETE'} as H3Event)).resolves.toEqual({ok: true})
        expect(deleted).toHaveBeenCalledWith('DELETE FROM users WHERE id=?', 9)
    })

    it('refuse un identifiant invalide, un compte absent ou tout rôle non-demo', async () => {
        vi.stubGlobal('requireAdmin', vi.fn())
        vi.stubGlobal('getRouterParam', () => 'abc')
        // @ts-ignore
        let module = await import('#server/api/admin/users/[id].delete.ts')
        await expect(module.default({method: 'DELETE'} as H3Event)).rejects.toMatchObject({statusCode: 400})

        vi.resetModules()
        vi.stubGlobal('getRouterParam', () => '4')
        vi.stubGlobal('database', () => ({prepare: () => ({bind: () => ({first: async () => null})})}))
        // @ts-ignore
        module = await import('#server/api/admin/users/[id].delete.ts')
        await expect(module.default({method: 'DELETE'} as H3Event)).rejects.toMatchObject({statusCode: 404})

        vi.resetModules()
        vi.stubGlobal('database', () => ({
            prepare: () => ({
                bind: () => ({
                    first: async () => ({
                        id: 4,
                        role: 'admin'
                    })
                })
            })
        }))
        // @ts-ignore
        module = await import('#server/api/admin/users/[id].delete.ts')
        await expect(module.default({method: 'DELETE'} as H3Event)).rejects.toMatchObject({statusCode: 403})
    })
})
