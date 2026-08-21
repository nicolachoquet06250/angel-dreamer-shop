import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import type {H3Event} from 'h3'
import {createResetToken, createSecurityCode, hashSecurityCode, safeEqual} from '#server/utils/password-reset'

beforeEach(() => {
    vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
    vi.stubGlobal('createError', (value: unknown) => value)
    vi.stubGlobal('ready', vi.fn())
})
afterEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    vi.restoreAllMocks()
})

describe('codes de sécurité', () => {
    it('génère un code à six chiffres et compare sans arrêt anticipé', () => {
        expect(createSecurityCode()).toMatch(/^\d{6}$/)
        expect(safeEqual('abc', 'abc')).toBe(true)
        expect(safeEqual('abc', 'abd')).toBe(false)
        expect(safeEqual('a', 'ab')).toBe(false)
    })
    it('génère un jeton de réinitialisation URL-safe et suffisamment aléatoire', () => {
        const first = createResetToken()
        const second = createResetToken()
        expect(first).toMatch(/^[A-Za-z0-9_-]{43}$/)
        expect(second).not.toBe(first)
    })
    it('lie le hash au compte et au secret JWT', async () => {
        vi.stubGlobal('useRuntimeConfig', () => ({jwtSecret: 'secret-test'}))
        expect(await hashSecurityCode({} as H3Event, 1, '123456')).toHaveLength(64)
        expect(await hashSecurityCode({} as H3Event, 1, '123456')).not.toBe(await hashSecurityCode({} as H3Event, 2, '123456'))
        vi.stubGlobal('useRuntimeConfig', () => ({jwtSecret: ''}))
        await expect(hashSecurityCode({} as H3Event, 1, '123456')).rejects.toMatchObject({statusCode: 503})
    })
})

describe('demande de code', () => {
    it('répond de façon générique aux adresses invalides', async () => {
        vi.stubGlobal('readBody', async () => ({email: 'invalide'}));
        vi.stubGlobal('sessionUser', async () => null)
        // @ts-ignore
        const {default: handler} = await import('#server/api/auth/password-code/request.post.ts')
        await expect(handler({} as H3Event)).resolves.toMatchObject({message: expect.any(String)})
    })
    it('crée un code haché, invalide le précédent et envoie le mail', async () => {
        const run = vi.fn(async () => ({lastInsertRowid: 9}))
        const db = {
            prepare: vi.fn((sql: string) => ({
                bind: (...args: unknown[]) => ({
                    first: async () => sql.startsWith('SELECT id,email') ? {
                        id: 3,
                        email: 'ada@example.test',
                        active: 1
                        // @ts-ignore
                    } : null, run: () => run(sql, ...args)
                })
            }))
        }
        vi.stubGlobal('readBody', async () => ({email: ' ADA@example.test '}));
        vi.stubGlobal('sessionUser', async () => null);
        vi.stubGlobal('database', () => db)
        vi.stubGlobal('createSecurityCode', () => '123456');
        vi.stubGlobal('hashSecurityCode', async () => 'hash');
        const send = vi.fn();
        vi.stubGlobal('sendPasswordCode', send)
        // @ts-ignore
        const {default: handler} = await import('#server/api/auth/password-code/request.post.ts')
        await handler({} as H3Event)
        expect(send).toHaveBeenCalledWith({}, 'ada@example.test', '123456')
        expect(db.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO password_reset_codes'))
    })
    it('utilise exclusivement l’adresse de la session pour un utilisateur connecté', async () => {
        const session = {id: 4, email: 'session@example.test', role: 'customer', active: 1}
        const db = {
            prepare: vi.fn((sql: string) => ({
                bind: () => ({
                    first: async () => null,
                    run: async () => sql.startsWith('INSERT') ? {lastInsertRowid: 10} : {}
                })
            }))
        }
        vi.stubGlobal('readBody', async () => ({email: 'substitution@example.test'}))
        vi.stubGlobal('sessionUser', async () => session)
        vi.stubGlobal('database', () => db)
        vi.stubGlobal('createSecurityCode', () => '123456')
        vi.stubGlobal('hashSecurityCode', async () => 'hash')
        const send = vi.fn()
        vi.stubGlobal('sendPasswordCode', send)
        // @ts-ignore
        const {default: handler} = await import('#server/api/auth/password-code/request.post.ts')
        await handler({} as H3Event)
        expect(send).toHaveBeenCalledWith({}, 'session@example.test', '123456')
        expect(db.prepare).not.toHaveBeenCalledWith(expect.stringContaining('WHERE email=?'))
    })
    it('limite les renvois trop rapprochés et ne révèle pas un compte absent', async () => {
        vi.stubGlobal('readBody', async () => ({email: 'a@example.test'}));
        vi.stubGlobal('sessionUser', async () => null)
        const database = (user: any, latest?: any) => ({prepare: (sql: string) => ({bind: () => ({first: async () => sql.startsWith('SELECT id,email') ? user : latest})})})
        vi.stubGlobal('database', () => database(null));
        // @ts-ignore
        let module = await import('#server/api/auth/password-code/request.post.ts');
        await expect(module.default({} as H3Event)).resolves.toMatchObject({message: expect.any(String)})
        vi.resetModules();
        vi.stubGlobal('database', () => database({
            id: 1,
            email: 'a@example.test',
            active: 1
        }, {created_at: new Date().toISOString()}));
        // @ts-ignore
        module = await import('#server/api/auth/password-code/request.post.ts');
        await expect(module.default({} as H3Event)).resolves.toMatchObject({message: expect.any(String)})
    })
    it('masque une panne SMTP à un visiteur et supprime le code inutilisable', async () => {
        const run = vi.fn(async () => ({lastInsertRowid: 7}));
        const error = vi.spyOn(console, 'error').mockImplementation(() => {
        })
        const db = {
            prepare: (sql: string) => ({
                bind: (...args: unknown[]) => ({
                    first: async () => sql.startsWith('SELECT id,email') ? {
                        id: 1,
                        email: 'a@example.test',
                        active: 1
                        // @ts-ignore
                    } : null, run: () => run(sql, ...args)
                })
            })
        }
        vi.stubGlobal('readBody', async () => ({email: 'a@example.test'}));
        vi.stubGlobal('sessionUser', async () => null);
        vi.stubGlobal('database', () => db);
        vi.stubGlobal('createSecurityCode', () => '123456');
        vi.stubGlobal('hashSecurityCode', async () => 'hash');
        vi.stubGlobal('sendPasswordCode', async () => {
            throw new Error('smtp')
        })
        // @ts-ignore
        const {default: handler} = await import('#server/api/auth/password-code/request.post.ts')
        await expect(handler({} as H3Event)).resolves.toMatchObject({message: expect.any(String)})
        expect(run).toHaveBeenCalledWith('DELETE FROM password_reset_codes WHERE id=?', 7);
        expect(error).toHaveBeenCalled()
    })
})

describe('confirmation du code', () => {
    it.each([{}, {code: '123', password: 'mot-de-passe-tres-long'}, {
        code: '123456',
        password: 'court'
    }, {code: '123456', password: 'x'.repeat(129)}])('refuse un formulaire invalide', async body => {
        vi.stubGlobal('readBody', async () => body)
        // @ts-ignore
        const {default: handler} = await import('#server/api/auth/password-code/confirm.post.ts')
        await expect(handler({} as H3Event)).rejects.toMatchObject({statusCode: 400})
    })
    it('refuse un code expiré ou après cinq essais', async () => {
        vi.stubGlobal('readBody', async () => ({
            email: 'a@example.test',
            code: '123456',
            password: 'mot-de-passe-tres-long'
        }));
        vi.stubGlobal('sessionUser', async () => null)
        vi.stubGlobal('database', () => ({
            prepare: (sql: string) => ({
                bind: () => ({
                    first: async () => sql.startsWith('SELECT id,email') ? {
                        id: 1,
                        active: 1
                    } : {id: 2, attempts: 5, expires_at: new Date(Date.now() + 10000).toISOString()}
                })
            })
        }))
        // @ts-ignore
        const {default: handler} = await import('#server/api/auth/password-code/confirm.post.ts')
        await expect(handler({} as H3Event)).rejects.toMatchObject({statusCode: 400})
    })
    it('refuse un compte désactivé et une demande sans code actif', async () => {
        vi.stubGlobal('readBody', async () => ({
            email: 'a@example.test',
            code: '123456',
            password: 'mot-de-passe-tres-long'
        }));
        vi.stubGlobal('sessionUser', async () => null)
        vi.stubGlobal('database', () => ({prepare: () => ({bind: () => ({first: async () => ({id: 1, active: 0})})})}));
        // @ts-ignore
        let module = await import('#server/api/auth/password-code/confirm.post.ts');
        await expect(module.default({} as H3Event)).rejects.toMatchObject({statusCode: 400})
        vi.resetModules();
        let calls = 0;
        vi.stubGlobal('database', () => ({
            prepare: () => ({
                bind: () => ({
                    first: async () => ++calls === 1 ? {
                        id: 1,
                        active: 1
                    } : null
                })
            })
        }));
        // @ts-ignore
        module = await import('#server/api/auth/password-code/confirm.post.ts');
        await expect(module.default({} as H3Event)).rejects.toMatchObject({statusCode: 400})
    })
    it('consomme le code, change le mot de passe et connecte un visiteur', async () => {
        const run = vi.fn();
        const batch = vi.fn()
        const db = {
            prepare: vi.fn((sql: string) => ({
                bind: (...args: unknown[]) => ({
                    first: async () => sql.startsWith('SELECT id,email') ? {
                        id: 1,
                        email: 'a@example.test',
                        role: 'customer',
                        active: 1
                    } : {id: 2, code_hash: 'hash', attempts: 0, expires_at: new Date(Date.now() + 60000).toISOString()},
                    run: async () => run(sql, ...args)
                })
            })), batch
        }
        vi.stubGlobal('readBody', async () => ({
            email: 'a@example.test',
            code: '123456',
            password: 'mot-de-passe-tres-long'
        }));
        vi.stubGlobal('sessionUser', async () => null);
        vi.stubGlobal('database', () => db)
        vi.stubGlobal('hashSecurityCode', async () => 'hash');
        vi.stubGlobal('safeEqual', () => true);
        vi.stubGlobal('hashPassword', async () => 'password-hash');
        const sign = vi.fn();
        vi.stubGlobal('signSession', sign)
        // @ts-ignore
        const {default: handler} = await import('#server/api/auth/password-code/confirm.post.ts')
        await expect(handler({} as H3Event)).resolves.toEqual({success: true})
        expect(batch).toHaveBeenCalledOnce();
        expect(sign).toHaveBeenCalledOnce()
    })
    it('compte un mauvais essai sans modifier le mot de passe', async () => {
        const run = vi.fn();
        const batch = vi.fn()
        const db = {
            prepare: (sql: string) => ({
                bind: () => ({
                    first: async () => sql.startsWith('SELECT id,email') ? {
                        id: 1,
                        active: 1
                    } : {
                        id: 2,
                        code_hash: 'bon-hash',
                        attempts: 0,
                        expires_at: new Date(Date.now() + 60000).toISOString()
                    }, run
                })
            }), batch
        }
        vi.stubGlobal('readBody', async () => ({
            email: 'a@example.test',
            code: '123456',
            password: 'mot-de-passe-tres-long'
        }));
        vi.stubGlobal('sessionUser', async () => null);
        vi.stubGlobal('database', () => db);
        vi.stubGlobal('hashSecurityCode', async () => 'mauvais-hash');
        vi.stubGlobal('safeEqual', () => false)
        // @ts-ignore
        const {default: handler} = await import('#server/api/auth/password-code/confirm.post.ts')
        await expect(handler({} as H3Event)).rejects.toMatchObject({statusCode: 400});
        expect(run).toHaveBeenCalled();
        expect(batch).not.toHaveBeenCalled()
    })
    it('utilise directement le compte de la session sans recréer une session', async () => {
        const session = {id: 4, email: 'session@example.test', role: 'customer', active: 1};
        const batch = vi.fn()
        const db = {
            prepare: (sql: string) => ({
                bind: () => ({
                    first: async () => ({
                        id: 2,
                        code_hash: 'hash',
                        attempts: 0,
                        expires_at: new Date(Date.now() + 60000).toISOString()
                    }), run: vi.fn()
                })
            }), batch
        }
        vi.stubGlobal('readBody', async () => ({code: '654321', password: 'mot-de-passe-tres-long'}));
        vi.stubGlobal('sessionUser', async () => session);
        vi.stubGlobal('database', () => db);
        vi.stubGlobal('hashSecurityCode', async () => 'hash');
        vi.stubGlobal('safeEqual', () => true);
        vi.stubGlobal('hashPassword', async () => 'password-hash');
        const sign = vi.fn();
        vi.stubGlobal('signSession', sign)
        // @ts-ignore
        const {default: handler} = await import('#server/api/auth/password-code/confirm.post.ts')
        await expect(handler({} as H3Event)).resolves.toEqual({success: true});
        expect(batch).toHaveBeenCalled();
        expect(sign).not.toHaveBeenCalled()
    })
    it('accepte le lien personnel envoyé par un administrateur et le consomme', async () => {
        const batch = vi.fn()
        const db = {
            prepare: vi.fn((sql: string) => ({
                bind: () => ({
                    first: async () => sql.includes('FROM users WHERE id=') ? {
                        id: 8, email: 'client@example.test', role: 'customer', active: 1
                    } : {
                        id: 12, code_hash: 'token-hash', attempts: 0,
                        expires_at: new Date(Date.now() + 60_000).toISOString()
                    },
                    run: vi.fn()
                })
            })),
            batch
        }
        vi.stubGlobal('readBody', async () => ({userId: 8, token: 'a'.repeat(43), password: 'mot-de-passe-tres-long'}))
        vi.stubGlobal('sessionUser', async () => null)
        vi.stubGlobal('database', () => db)
        vi.stubGlobal('hashSecurityCode', async () => 'token-hash')
        vi.stubGlobal('safeEqual', () => true)
        vi.stubGlobal('hashPassword', async () => 'password-hash')
        const sign = vi.fn()
        vi.stubGlobal('signSession', sign)
        // @ts-ignore
        const {default: handler} = await import('#server/api/auth/password-code/confirm.post.ts')
        await expect(handler({} as H3Event)).resolves.toEqual({success: true})
        expect(db.prepare).toHaveBeenCalledWith(expect.stringContaining('purpose=?'))
        expect(batch).toHaveBeenCalledOnce()
        expect(sign).toHaveBeenCalledWith({}, expect.objectContaining({id: 8}))
    })
})

describe('réinitialisation initiée par un administrateur', () => {
    it('crée un lien à usage unique et envoie le modèle de mail au bon utilisateur', async () => {
        const run = vi.fn(async (sql: string) => sql.startsWith('INSERT') ? {lastInsertRowid: 21} : {})
        const db = {
            prepare: vi.fn((sql: string) => ({
                bind: (...args: unknown[]) => ({
                    first: async () => ({id: 8, email: 'client@example.test', active: 1}),
                    // @ts-ignore
                    run: () => run(sql, ...args)
                })
            }))
        }
        vi.stubGlobal('requireAdmin', vi.fn())
        vi.stubGlobal('getRouterParam', () => '8')
        vi.stubGlobal('database', () => db)
        vi.stubGlobal('createResetToken', () => 'jeton-test-url-safe'.padEnd(43, 'x'))
        vi.stubGlobal('hashSecurityCode', async () => 'hash-du-jeton')
        vi.stubGlobal('useRuntimeConfig', () => ({public: {siteUrl: 'https://boutique.example/'}}))
        vi.stubGlobal('getRequestURL', () => new URL('http://localhost:3000/admin/users'))
        const send = vi.fn()
        vi.stubGlobal('sendAdminPasswordReset', send)
        // @ts-ignore
        const {default: handler} = await import('#server/api/admin/users/[id]/password-reset.post.ts')
        await expect(handler({} as H3Event)).resolves.toEqual({message: 'Le lien de réinitialisation a été envoyé.'})
        expect(send).toHaveBeenCalledWith({}, 'client@example.test', expect.stringMatching(/^https:\/\/boutique\.example\/mot-de-passe-oublie\?uid=8&token=/))
        expect(run).toHaveBeenCalledWith(expect.stringContaining("'admin-link'"), 8, 'hash-du-jeton', expect.any(String), expect.any(String))
    })

    it('refuse une cible invalide ou inactive', async () => {
        vi.stubGlobal('requireAdmin', vi.fn())
        vi.stubGlobal('getRouterParam', () => 'abc')
        // @ts-ignore
        let module = await import('#server/api/admin/users/[id]/password-reset.post.ts')
        await expect(module.default({} as H3Event)).rejects.toMatchObject({statusCode: 400})
        vi.resetModules()
        vi.stubGlobal('getRouterParam', () => '5')
        vi.stubGlobal('database', () => ({prepare: () => ({bind: () => ({first: async () => ({id: 5, active: 0})})})}))
        // @ts-ignore
        module = await import('#server/api/admin/users/[id]/password-reset.post.ts')
        await expect(module.default({} as H3Event)).rejects.toMatchObject({statusCode: 404})
    })

    it('supprime le jeton si l’envoi SMTP échoue', async () => {
        const deleted = vi.fn()
        const db = {
            prepare: (sql: string) => ({
                bind: () => ({
                    first: async () => ({id: 3, email: 'client@example.test', active: 1}),
                    run: async () => sql.startsWith('INSERT') ? {lastInsertRowid: 31} : (sql.startsWith('DELETE') ? deleted() : {})
                })
            })
        }
        vi.stubGlobal('requireAdmin', vi.fn())
        vi.stubGlobal('getRouterParam', () => '3')
        vi.stubGlobal('database', () => db)
        vi.stubGlobal('createResetToken', () => 'x'.repeat(43))
        vi.stubGlobal('hashSecurityCode', async () => 'hash')
        vi.stubGlobal('useRuntimeConfig', () => ({public: {siteUrl: ''}}))
        vi.stubGlobal('getRequestURL', () => new URL('https://shop.example/admin/users'))
        vi.stubGlobal('sendAdminPasswordReset', async () => {
            throw new Error('smtp')
        })
        // @ts-ignore
        const {default: handler} = await import('#server/api/admin/users/[id]/password-reset.post.ts')
        await expect(handler({} as H3Event)).rejects.toThrow('smtp')
        expect(deleted).toHaveBeenCalledOnce()
    })
})
