import BetterSqlite3 from 'better-sqlite3'
import mysql, {type Pool} from 'mysql2/promise'
import {dirname, resolve} from 'node:path'
import {mkdirSync} from 'node:fs'
import type {H3Event} from 'h3'
import {defaultSiteContent, type ImageAsset, imageContentKeys, type Product} from '~/types/shop'

export type BoundStatement = {
    sql: string;
    values: unknown[];
    bind(...values: unknown[]): BoundStatement;
    all<T = unknown>(): Promise<{ results: T[] }>;
    first<T = unknown>(): Promise<T | null>;
    run(): Promise<any>;
    runSync(): any
}
export type AppDatabase = {
    dialect: 'sqlite' | 'mysql';
    prepare(sql: string): BoundStatement;
    batch(statements: BoundStatement[]): Promise<unknown>
}
let connection: BetterSqlite3.Database | undefined
let connectionPath = ''
let mysqlPool: Pool | undefined
let mysqlUrl = ''

const defaults = [
    ['t-shirt-horizon', 'T-shirt Horizon', 'Un t-shirt en coton doux illustré d’une vague japonaise et d’un soleil vermillon.', 2990, 'Vêtements', 1],
    ['mug-visage', 'Mug Visage', 'Mug en céramique imprimé en France, finition brillante et motif abstrait.', 1490, 'Maison & déco', 1],
    ['tote-ascension', 'Tote bag Ascension', 'Sac en toile naturelle épaisse, imprimé à la demande avec des encres à l’eau.', 1990, 'Accessoires', 1],
    ['coussin-bauhaus', 'Coussin Bauhaus', 'Housse de coussin en toile texturée aux formes géométriques iconiques.', 2490, 'Maison & déco', 1]
]

export function database(event: H3Event): AppDatabase {
    const config = useRuntimeConfig(event)
    const driver = String(config.databaseDriver || (process.env.NODE_ENV === 'production' && config.mysqlUrl ? 'mysql' : 'sqlite')).toLowerCase()
    if (driver === 'mysql') {
        const url = String(config.mysqlUrl || '')
        if (!url) throw createError({statusCode: 503, statusMessage: 'Connexion MySQL non configurée'})
        if (!mysqlPool || mysqlUrl !== url) {
            mysqlPool = mysql.createPool({uri: url, connectionLimit: 10, enableKeepAlive: true, charset: 'utf8mb4'})
            mysqlUrl = url
        }
        const pool = mysqlPool
        const normalizeSql = (sql: string) => sql
            .replace(/^INSERT OR IGNORE /i, 'INSERT IGNORE ')
            .replace(/ ON CONFLICT\(key\) DO UPDATE SET value=excluded\.value$/i, ' ON DUPLICATE KEY UPDATE value=VALUES(value)')
            .replace(/ ON CONFLICT\(key\) DO UPDATE SET image_id=excluded\.image_id$/i, ' ON DUPLICATE KEY UPDATE image_id=VALUES(image_id)')
            .replace(/ ON CONFLICT\(email\) DO UPDATE SET password_hash=excluded\.password_hash,role='admin',active=1,must_change_password=1$/i, " ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash),role='admin',active=1,must_change_password=1")
        const wrap = (sql: string, values: unknown[] = []): BoundStatement => ({
            sql,
            values,
            bind: (...next) => wrap(sql, next),
            all: async <T>() => {
                // @ts-ignore
                const [rows] = await pool.execute(normalizeSql(sql), values.map(value => value === undefined ? null : value))
                return {results: rows as T[]}
            },
            first: async <T>() => {
                // @ts-ignore
                const [rows] = await pool.execute(normalizeSql(sql), values.map(value => value === undefined ? null : value))
                return ((rows as T[])[0] ?? null)
            },
            run: async () => {
                // @ts-ignore
                const [result] = await pool.execute(normalizeSql(sql), values.map(value => value === undefined ? null : value))
                const packet = result as {insertId?: number; affectedRows?: number}
                return {lastInsertRowid: packet.insertId ?? 0, changes: packet.affectedRows ?? 0}
            },
            runSync: () => { throw new Error('runSync est réservé à SQLite') }
        })
        return {
            dialect: 'mysql',
            prepare: wrap,
            batch: async statements => {
                const connection = await pool.getConnection()
                try {
                    await connection.beginTransaction()
                    // @ts-ignore
                    for (const statement of statements) await connection.execute(normalizeSql(statement.sql), statement.values.map(value => value === undefined ? null : value))
                    await connection.commit()
                } catch (error) {
                    await connection.rollback()
                    throw error
                } finally {
                    connection.release()
                }
            }
        }
    }
    if (driver !== 'sqlite') throw createError({statusCode: 503, statusMessage: 'Moteur de base de données invalide'})
    const configured = String(config.databasePath || './data/angel-dreamer.sqlite')
    const path = configured === ':memory:' ? configured : resolve(process.cwd(), configured)
    if (!connection || connectionPath !== path) {
        if (path !== ':memory:') mkdirSync(dirname(path), {recursive: true});
        connection?.close();
        connection = new BetterSqlite3(path);
        connectionPath = path;
        connection.pragma('journal_mode = WAL');
        connection.pragma('foreign_keys = ON')
    }
    const native = connection
    const wrap = (sql: string, values: unknown[] = []): BoundStatement => ({
        sql,
        values,
        bind: (...next) => wrap(sql, next),
        all: async <T>() => ({results: native.prepare(sql).all(...values) as T[]}),
        first: async <T>() => (native.prepare(sql).get(...values) as T | undefined) ?? null,
        run: async () => native.prepare(sql).run(...values),
        runSync: () => native.prepare(sql).run(...values)
    })
    return {
        dialect: 'sqlite',
        prepare: wrap,
        batch: async statements => native.transaction((items: BoundStatement[]) => items.map(item => item.runSync()))(statements)
    }
}

export async function ready(db: AppDatabase) {
    if (db.dialect === 'mysql') return readyMySql(db)
    await db.batch([
        db.prepare('CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL, mime_type TEXT NOT NULL, width INTEGER NOT NULL, height INTEGER NOT NULL, natural_width INTEGER NOT NULL, natural_height INTEGER NOT NULL, dark_image_id INTEGER REFERENCES images(id) ON DELETE SET NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)'),
        db.prepare('CREATE TABLE IF NOT EXISTS site_content (`key` TEXT PRIMARY KEY, value TEXT NOT NULL)'),
        db.prepare('CREATE TABLE IF NOT EXISTS site_content_images (`key` TEXT PRIMARY KEY, image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE)'),
        db.prepare('CREATE TABLE IF NOT EXISTS universes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, slug TEXT, image_id INTEGER REFERENCES images(id) ON DELETE SET NULL, position INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1)'),
        db.prepare('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, position INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1)'),
        db.prepare('CREATE TABLE IF NOT EXISTS product_categories (product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE, category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE, PRIMARY KEY(product_id,category_id))'),
        db.prepare('CREATE TABLE IF NOT EXISTS product_universes (product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE, universe_id INTEGER NOT NULL REFERENCES universes(id) ON DELETE CASCADE, PRIMARY KEY(product_id,universe_id))'),
        db.prepare('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, first_name TEXT, last_name TEXT, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT \'customer\', active INTEGER NOT NULL DEFAULT 1, must_change_password INTEGER NOT NULL DEFAULT 0, created_by_admin_id INTEGER REFERENCES users(id) ON DELETE SET NULL, created_at TEXT NOT NULL)'),
        db.prepare('CREATE TABLE IF NOT EXISTS password_reset_codes (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, code_hash TEXT NOT NULL, purpose TEXT NOT NULL, expires_at TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, used_at TEXT, created_at TEXT NOT NULL)'),
        db.prepare('CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, provider TEXT NOT NULL, provider_order_id TEXT NOT NULL, amount_cents INTEGER NOT NULL, status TEXT NOT NULL, customer_email TEXT, created_at TEXT NOT NULL)'),
        db.prepare('CREATE TABLE IF NOT EXISTS discounts (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT NOT NULL, type TEXT NOT NULL, value INTEGER NOT NULL, active INTEGER NOT NULL DEFAULT 1, starts_at TEXT, ends_at TEXT, created_at TEXT NOT NULL)'),
        db.prepare('CREATE TABLE IF NOT EXISTS discount_rules (id INTEGER PRIMARY KEY AUTOINCREMENT, discount_id INTEGER NOT NULL REFERENCES discounts(id) ON DELETE CASCADE, scope TEXT NOT NULL, target_id INTEGER NOT NULL)'),
        db.prepare('CREATE TABLE IF NOT EXISTS promo_codes (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL UNIQUE, active INTEGER NOT NULL DEFAULT 1, starts_at TEXT, ends_at TEXT, created_at TEXT NOT NULL)'),
        db.prepare('CREATE TABLE IF NOT EXISTS promo_code_rules (id INTEGER PRIMARY KEY AUTOINCREMENT, promo_code_id INTEGER NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE, scope TEXT NOT NULL, target_id INTEGER, type TEXT NOT NULL, value INTEGER NOT NULL)'),
        db.prepare('CREATE TABLE IF NOT EXISTS contact_attachments (id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT NOT NULL, mimetype TEXT NOT NULL, size INTEGER NOT NULL, data BLOB NOT NULL, created_at INTEGER NOT NULL DEFAULT (unixepoch()))')
    ])
    const {results: imageColumns} = await db.prepare('PRAGMA table_info(images)').all<any>();
    if (!imageColumns.some(column => column.name === 'dark_image_id')) await db.prepare('ALTER TABLE images ADD COLUMN dark_image_id INTEGER REFERENCES images(id) ON DELETE SET NULL').run()
    const {results: universeColumns} = await db.prepare('PRAGMA table_info(universes)').all<any>();
    if (!universeColumns.some(column => column.name === 'slug')) await db.prepare('ALTER TABLE universes ADD COLUMN slug TEXT').run()
    const {results: productColumns} = await db.prepare('PRAGMA table_info(products)').all<any>()
    if (!productColumns.length) {
        await db.prepare('CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, description TEXT NOT NULL, price_cents INTEGER NOT NULL, image_id INTEGER REFERENCES images(id) ON DELETE SET NULL, category TEXT NOT NULL, featured INTEGER NOT NULL DEFAULT 0, featured_position INTEGER, active INTEGER NOT NULL DEFAULT 1)').run()
    } else if (!productColumns.some(column => column.name === 'image_id')) {
        const now = new Date().toISOString()
        await db.prepare("INSERT INTO images(content,mime_type,width,height,natural_width,natural_height,created_at,updated_at) SELECT DISTINCT image_url,CASE WHEN image_url LIKE 'data:image/%' THEN substr(image_url,6,instr(image_url,';')-6) ELSE 'image/unknown' END,1,1,1,1,?,? FROM products WHERE image_url<>''").bind(now, now).run()
        await db.batch([
            db.prepare('ALTER TABLE products RENAME TO products_legacy_images'),
            db.prepare('CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, description TEXT NOT NULL, price_cents INTEGER NOT NULL, image_id INTEGER REFERENCES images(id) ON DELETE SET NULL, category TEXT NOT NULL, featured INTEGER NOT NULL DEFAULT 0, featured_position INTEGER, active INTEGER NOT NULL DEFAULT 1)'),
            db.prepare('INSERT INTO products(id,slug,name,description,price_cents,image_id,category,featured,active) SELECT p.id,p.slug,p.name,p.description,p.price_cents,(SELECT i.id FROM images i WHERE i.content=p.image_url LIMIT 1),p.category,p.featured,p.active FROM products_legacy_images p'),
            db.prepare('DROP TABLE products_legacy_images')
        ])
    }
    const {results: currentProductColumns} = await db.prepare('PRAGMA table_info(products)').all<any>();
    if (!currentProductColumns.some(column => column.name === 'featured_position')) await db.prepare('ALTER TABLE products ADD COLUMN featured_position INTEGER').run()
    await db.batch([
        db.prepare('CREATE INDEX IF NOT EXISTS idx_images_dark_image_id ON images(dark_image_id)'), db.prepare('CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug)'), db.prepare('CREATE INDEX IF NOT EXISTS idx_products_active_featured ON products(active,featured)'), db.prepare('CREATE INDEX IF NOT EXISTS idx_products_image_id ON products(image_id)'), db.prepare('CREATE INDEX IF NOT EXISTS idx_site_content_images_image_id ON site_content_images(image_id)'), db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_universes_slug ON universes(slug) WHERE slug IS NOT NULL AND slug<>''"), db.prepare('CREATE INDEX IF NOT EXISTS idx_universes_position ON universes(position)'), db.prepare('CREATE INDEX IF NOT EXISTS idx_universes_image_id ON universes(image_id)'), db.prepare('CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug)'), db.prepare('CREATE INDEX IF NOT EXISTS idx_categories_position ON categories(position)'), db.prepare('CREATE INDEX IF NOT EXISTS idx_product_categories_category ON product_categories(category_id,product_id)'), db.prepare('CREATE INDEX IF NOT EXISTS idx_product_universes_universe ON product_universes(universe_id,product_id)'), db.prepare('CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_provider_id ON orders(provider,provider_order_id)'), db.prepare('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email)'), db.prepare('CREATE INDEX IF NOT EXISTS idx_password_reset_user_created ON password_reset_codes(user_id,created_at)')
    ])
    const {results: userColumns} = await db.prepare('PRAGMA table_info(users)').all<any>();
    const userNames = new Set(userColumns.map(column => column.name));
    if (!userNames.has('first_name')) await db.prepare('ALTER TABLE users ADD COLUMN first_name TEXT').run();
    if (!userNames.has('last_name')) await db.prepare('ALTER TABLE users ADD COLUMN last_name TEXT').run();
    if (!userNames.has('created_by_admin_id')) await db.prepare('ALTER TABLE users ADD COLUMN created_by_admin_id INTEGER REFERENCES users(id) ON DELETE SET NULL').run()
    for (const key of imageContentKeys) {
        const legacy = await db.prepare('SELECT value FROM site_content WHERE `key`=?').bind(key).first<{
            value: string
        }>();
        if (legacy?.value) {
            const imageId = await persistImage(db, {
                id: 0,
                content: legacy.value,
                mimeType: mimeFromContent(legacy.value),
                width: 1,
                height: 1,
                naturalWidth: 1,
                naturalHeight: 1
            });
            if (imageId) await db.prepare('INSERT OR IGNORE INTO site_content_images(`key`,image_id) VALUES(?,?)').bind(key, imageId).run()
        }
        await db.prepare('DELETE FROM site_content WHERE `key`=?').bind(key).run()
    }
    const universeCount = await db.prepare('SELECT COUNT(*) total FROM universes').first<{ total: number }>();
    if (!universeCount?.total) {
        const titles = ['Art & design', 'Manga & Japon', 'Cinéma & musique', 'Humour'];
        for (let index = 1; index <= 4; index++) {
            const title = await db.prepare('SELECT value FROM site_content WHERE `key`=?').bind(`universe${index}Title`).first<{
                value: string
            }>();
            const linked = await db.prepare('SELECT image_id FROM site_content_images WHERE `key`=?').bind(`universe${index}Image`).first<{
                image_id: number
            }>();
            await db.prepare('INSERT INTO universes(title,image_id,position,active) VALUES(?,?,?,1)').bind(title?.value || titles[index - 1], linked?.image_id || null, index - 1).run()
        }
    }
    for (let index = 1; index <= 4; index++) {
        await db.prepare('DELETE FROM site_content WHERE `key`=?').bind(`universe${index}Title`).run();
        await db.prepare('DELETE FROM site_content_images WHERE `key`=?').bind(`universe${index}Image`).run()
    }
    const count = await db.prepare('SELECT COUNT(*) AS total FROM products').first<{ total: number }>();
    if (!count?.total) await db.batch(defaults.map(p => db.prepare('INSERT INTO products(slug,name,description,price_cents,image_id,category,featured,active) VALUES(?,?,?,?,NULL,?,?,1)').bind(...p)))
    const categoryCount = await db.prepare('SELECT COUNT(*) total FROM categories').first<{ total: number }>();
    if (!categoryCount?.total) {
        const seeds = [['Nouveautés', 'nouveautes'], ['Vêtements', 'vetements'], ['Maison & déco', 'maison-deco']];
        for (const [index, item] of seeds.entries()) await db.prepare('INSERT INTO categories(label,slug,position,active) VALUES(?,?,?,1)').bind(item[0], item[1], index).run()
    }
    const linkedCategories = await db.prepare('SELECT COUNT(*) total FROM product_categories').first<{
        total: number
    }>();
    if (!linkedCategories?.total) {
        const fallback = await db.prepare("SELECT id FROM categories WHERE slug='nouveautes'").first<{ id: number }>();
        if (fallback) await db.prepare('INSERT OR IGNORE INTO product_categories(product_id,category_id) SELECT id,? FROM products').bind(fallback.id).run()
    }
    const linkedUniverses = await db.prepare('SELECT COUNT(*) total FROM product_universes').first<{ total: number }>();
    if (!linkedUniverses?.total) {
        const fallback = await db.prepare('SELECT id FROM universes ORDER BY position,id LIMIT 1').first<{
            id: number
        }>();
        if (fallback) await db.prepare('INSERT OR IGNORE INTO product_universes(product_id,universe_id) SELECT id,? FROM products').bind(fallback.id).run()
    }
    const textDefaults = Object.entries(defaultSiteContent).filter(([key]) => !imageContentKeys.includes(key as any));
    await db.batch(textDefaults.map(([key, value]) => db.prepare('INSERT OR IGNORE INTO site_content(`key`,value) VALUES(?,?)').bind(key, String(value))))
}

let mysqlReady: Promise<void> | undefined

function readyMySql(db: AppDatabase) {
    mysqlReady ||= initializeMySql(db).catch(error => {
        mysqlReady = undefined
        throw error
    })
    return mysqlReady
}

async function initializeMySql(db: AppDatabase) {
    const statements = [
        `CREATE TABLE IF NOT EXISTS images (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            content LONGTEXT NOT NULL,
            mime_type VARCHAR(64) NOT NULL,
            width INT UNSIGNED NOT NULL,
            height INT UNSIGNED NOT NULL,
            natural_width INT UNSIGNED NOT NULL,
            natural_height INT UNSIGNED NOT NULL,
            dark_image_id INT UNSIGNED NULL,
            created_at VARCHAR(32) NOT NULL,
            updated_at VARCHAR(32) NOT NULL,
            INDEX idx_images_dark_image_id (dark_image_id),
            CONSTRAINT fk_images_dark_image FOREIGN KEY (dark_image_id) REFERENCES images(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS products (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            slug VARCHAR(191) NOT NULL UNIQUE,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price_cents INT UNSIGNED NOT NULL,
            image_id INT UNSIGNED NULL,
            category VARCHAR(191) NOT NULL DEFAULT '',
            featured TINYINT(1) NOT NULL DEFAULT 0,
            featured_position INT NULL,
            active TINYINT(1) NOT NULL DEFAULT 1,
            INDEX idx_products_active_featured (active,featured),
            INDEX idx_products_image_id (image_id),
            CONSTRAINT fk_products_image FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS site_content (
            \`key\` VARCHAR(191) NOT NULL PRIMARY KEY,
            value TEXT NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS universes (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(191) NULL UNIQUE,
            image_id INT UNSIGNED NULL,
            position INT NOT NULL DEFAULT 0,
            active TINYINT(1) NOT NULL DEFAULT 1,
            INDEX idx_universes_position (position),
            INDEX idx_universes_image_id (image_id),
            CONSTRAINT fk_universes_image FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS categories (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            label VARCHAR(255) NOT NULL,
            slug VARCHAR(191) NOT NULL UNIQUE,
            position INT NOT NULL DEFAULT 0,
            active TINYINT(1) NOT NULL DEFAULT 1,
            INDEX idx_categories_position (position)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS site_content_images (
            \`key\` VARCHAR(191) NOT NULL PRIMARY KEY,
            image_id INT UNSIGNED NOT NULL,
            INDEX idx_site_content_images_image_id (image_id),
            CONSTRAINT fk_site_content_images_image FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS product_categories (
            product_id INT UNSIGNED NOT NULL,
            category_id INT UNSIGNED NOT NULL,
            PRIMARY KEY(product_id,category_id),
            INDEX idx_product_categories_category (category_id,product_id),
            CONSTRAINT fk_product_categories_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            CONSTRAINT fk_product_categories_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS product_universes (
            product_id INT UNSIGNED NOT NULL,
            universe_id INT UNSIGNED NOT NULL,
            PRIMARY KEY(product_id,universe_id),
            INDEX idx_product_universes_universe (universe_id,product_id),
            CONSTRAINT fk_product_universes_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            CONSTRAINT fk_product_universes_universe FOREIGN KEY (universe_id) REFERENCES universes(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS users (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(191) NOT NULL UNIQUE,
            first_name VARCHAR(80) NULL,
            last_name VARCHAR(80) NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(32) NOT NULL DEFAULT 'customer',
            active TINYINT(1) NOT NULL DEFAULT 1,
            must_change_password TINYINT(1) NOT NULL DEFAULT 0,
            created_by_admin_id INT UNSIGNED NULL,
            created_at VARCHAR(32) NOT NULL,
            CONSTRAINT fk_users_created_by_admin FOREIGN KEY (created_by_admin_id) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS password_reset_codes (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED NOT NULL,
            code_hash VARCHAR(255) NOT NULL,
            purpose VARCHAR(32) NOT NULL,
            expires_at VARCHAR(32) NOT NULL,
            attempts INT UNSIGNED NOT NULL DEFAULT 0,
            used_at VARCHAR(32) NULL,
            created_at VARCHAR(32) NOT NULL,
            INDEX idx_password_reset_user_created (user_id,created_at),
            CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS orders (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            provider VARCHAR(32) NOT NULL,
            provider_order_id VARCHAR(191) NOT NULL,
            amount_cents INT UNSIGNED NOT NULL,
            status VARCHAR(64) NOT NULL,
            customer_email VARCHAR(191) NULL,
            created_at VARCHAR(32) NOT NULL,
            UNIQUE KEY idx_orders_provider_id (provider,provider_order_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS discounts (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            label VARCHAR(255) NOT NULL,
            type VARCHAR(16) NOT NULL,
            value INT UNSIGNED NOT NULL,
            active TINYINT(1) NOT NULL DEFAULT 1,
            starts_at VARCHAR(32) NULL,
            ends_at VARCHAR(32) NULL,
            created_at VARCHAR(32) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS discount_rules (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            discount_id INT UNSIGNED NOT NULL,
            scope VARCHAR(16) NOT NULL,
            target_id INT UNSIGNED NOT NULL,
            CONSTRAINT fk_discount_rules_discount FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS promo_codes (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            code VARCHAR(64) NOT NULL UNIQUE,
            active TINYINT(1) NOT NULL DEFAULT 1,
            starts_at VARCHAR(32) NULL,
            ends_at VARCHAR(32) NULL,
            created_at VARCHAR(32) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS promo_code_rules (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            promo_code_id INT UNSIGNED NOT NULL,
            scope VARCHAR(16) NOT NULL,
            target_id INT UNSIGNED NULL,
            type VARCHAR(16) NOT NULL,
            value INT UNSIGNED NOT NULL,
            CONSTRAINT fk_promo_code_rules_code FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS contact_attachments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            mimetype VARCHAR(100) NOT NULL,
            size INT NOT NULL,
            data LONGBLOB NOT NULL,
            created_at INT NOT NULL DEFAULT (UNIX_TIMESTAMP())
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    ]
    for (const sql of statements) await db.prepare(sql).run()

    const creatorColumn = await db.prepare("SELECT COUNT(*) total FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='users' AND COLUMN_NAME='created_by_admin_id'").first<{total:number}>()
    if (!Number(creatorColumn?.total)) await db.prepare('ALTER TABLE users ADD COLUMN created_by_admin_id INT UNSIGNED NULL, ADD CONSTRAINT fk_users_created_by_admin FOREIGN KEY (created_by_admin_id) REFERENCES users(id) ON DELETE SET NULL').run()

    const productCount = await db.prepare('SELECT COUNT(*) total FROM products').first<{total:number}>()
    if (!Number(productCount?.total)) for (const product of defaults) await db.prepare('INSERT INTO products(slug,name,description,price_cents,image_id,category,featured,active) VALUES(?,?,?,?,NULL,?,?,1)').bind(...product).run()

    const universeCount = await db.prepare('SELECT COUNT(*) total FROM universes').first<{total:number}>()
    if (!Number(universeCount?.total)) for (const [position, title] of ['Art & design', 'Manga & Japon', 'Cinéma & musique', 'Humour'].entries()) await db.prepare('INSERT INTO universes(title,position,active) VALUES(?,?,1)').bind(title, position).run()

    const categoryCount = await db.prepare('SELECT COUNT(*) total FROM categories').first<{total:number}>()
    if (!Number(categoryCount?.total)) for (const [position, category] of [['Nouveautés','nouveautes'],['Vêtements','vetements'],['Maison & déco','maison-deco']].entries()) await db.prepare('INSERT INTO categories(label,slug,position,active) VALUES(?,?,?,1)').bind(category[0], category[1], position).run()

    const novelty = await db.prepare("SELECT id FROM categories WHERE slug='nouveautes'").first<{id:number}>()
    if (novelty) await db.prepare('INSERT IGNORE INTO product_categories(product_id,category_id) SELECT id,? FROM products').bind(novelty.id).run()
    const firstUniverse = await db.prepare('SELECT id FROM universes ORDER BY position,id LIMIT 1').first<{id:number}>()
    if (firstUniverse) await db.prepare('INSERT IGNORE INTO product_universes(product_id,universe_id) SELECT id,? FROM products').bind(firstUniverse.id).run()

    const textDefaults = Object.entries(defaultSiteContent).filter(([key]) => !imageContentKeys.includes(key as any))
    for (const [key, value] of textDefaults) await db.prepare('INSERT IGNORE INTO site_content(`key`,value) VALUES(?,?)').bind(key, String(value)).run()
}

function mimeFromContent(content: string) {
    const match = /^data:(image\/[\w.+-]+);/.exec(content);
    return match?.[1] || 'image/unknown'
}

export function mapImage(row: any, prefix = 'image'): ImageAsset | null {
    const id = Number(row[`${prefix}_id`]);
    if (!id) return null;
    const image: ImageAsset = {
        id,
        content: `/images/${id}`,
        mimeType: String(row[`${prefix}_mime_type`]),
        width: Number(row[`${prefix}_width`]),
        height: Number(row[`${prefix}_height`]),
        naturalWidth: Number(row[`${prefix}_natural_width`]),
        naturalHeight: Number(row[`${prefix}_natural_height`])
    };
    const darkId = Number(row[`${prefix}_dark_id`]);
    if (darkId) image.darkVariant = {
        id: darkId,
        content: `/images/${darkId}`,
        mimeType: String(row[`${prefix}_dark_mime_type`]),
        width: image.width,
        height: image.height,
        naturalWidth: Number(row[`${prefix}_dark_natural_width`]),
        naturalHeight: Number(row[`${prefix}_dark_natural_height`]),
        darkVariant: null
    }; else image.darkVariant = null;
    return image
}

export async function persistImage(db: AppDatabase, input: ImageAsset | null | undefined) {
    if (!input) return null;
    const content = String(input.content || '');
    if (!content) return null;
    if (content.length > 3_000_000) throw createError({statusCode: 413, statusMessage: 'Image trop volumineuse'});
    const naturalWidth = Math.max(1, Math.round(Number(input.naturalWidth) || 1));
    const naturalHeight = Math.max(1, Math.round(Number(input.naturalHeight) || 1));
    const width = Math.max(1, Math.round(Number(input.width) || naturalWidth));
    const height = Math.max(1, Math.round(width * naturalHeight / naturalWidth));
    const mimeType = String(input.mimeType || mimeFromContent(content));
    const now = new Date().toISOString();
    if (Number(input.id) > 0 && (content === `/images/${Number(input.id)}` || content === `/api/images/${Number(input.id)}`)) {
        await db.prepare('UPDATE images SET width=?,height=?,updated_at=? WHERE id=?').bind(width, height, now, Number(input.id)).run();
        return Number(input.id)
    }
    if (Number(input.id) > 0) {
        await db.prepare('UPDATE images SET content=?,mime_type=?,width=?,height=?,natural_width=?,natural_height=?,updated_at=? WHERE id=?').bind(content, mimeType, width, height, naturalWidth, naturalHeight, now, Number(input.id)).run();
        return Number(input.id)
    }
    const result = await db.prepare('INSERT INTO images(content,mime_type,width,height,natural_width,natural_height,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)').bind(content, mimeType, width, height, naturalWidth, naturalHeight, now, now).run();
    return Number(result.lastInsertRowid)
}

export const productSelect = 'SELECT p.*,i.id image_id,i.mime_type image_mime_type,i.width image_width,i.height image_height,i.natural_width image_natural_width,i.natural_height image_natural_height,di.id image_dark_id,di.mime_type image_dark_mime_type,di.width image_dark_width,di.height image_dark_height,di.natural_width image_dark_natural_width,di.natural_height image_dark_natural_height FROM products p LEFT JOIN images i ON i.id=p.image_id LEFT JOIN images di ON di.id=i.dark_image_id'

export function mapProduct(row: any): Product {
    return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description,
        priceCents: row.price_cents,
        image: mapImage(row),
        categories: [],
        universes: [],
        categoryIds: [],
        universeIds: [],
        featured: Boolean(row.featured),
        featuredPosition: row.featured_position === null || row.featured_position === undefined ? null : Number(row.featured_position),
        active: Boolean(row.active)
    }
}

export const universeSelect = 'SELECT u.*,i.id image_id,i.mime_type image_mime_type,i.width image_width,i.height image_height,i.natural_width image_natural_width,i.natural_height image_natural_height,di.id image_dark_id,di.mime_type image_dark_mime_type,di.width image_dark_width,di.height image_dark_height,di.natural_width image_dark_natural_width,di.natural_height image_dark_natural_height FROM universes u LEFT JOIN images i ON i.id=u.image_id LEFT JOIN images di ON di.id=i.dark_image_id'

export function mapUniverse(row: any) {
    return {
        id: Number(row.id),
        title: String(row.title),
        slug: String(row.slug || ''),
        image: mapImage(row),
        position: Number(row.position),
        active: Boolean(row.active)
    }
}

export function mapCategory(row: any) {
    return {
        id: Number(row.id),
        label: String(row.label),
        slug: String(row.slug),
        position: Number(row.position),
        active: Boolean(row.active)
    }
}

export async function mapProductsWithRelations(db: AppDatabase, rows: any[]) {
    const products = rows.map(mapProduct);
    if (!products.length) return products;
    const ids = products.map(item => item.id);
    const placeholders = ids.map(() => '?').join(',');
    const {results: categoryRows} = await db.prepare(`SELECT pc.product_id, c.*
                                                      FROM product_categories pc
                                                               JOIN categories c ON c.id = pc.category_id
                                                      WHERE pc.product_id IN (${placeholders})
                                                      ORDER BY c.position, c.id`).bind(...ids).all<any>();
    const {results: universeRows} = await db.prepare(`SELECT pu.product_id, u.*
                                                      FROM product_universes pu
                                                               JOIN universes u ON u.id = pu.universe_id
                                                      WHERE pu.product_id IN (${placeholders})
                                                      ORDER BY u.position, u.id`).bind(...ids).all<any>();
    for (const product of products) {
        product.categories = categoryRows.filter(row => row.product_id === product.id).map(mapCategory);
        product.universes = universeRows.filter(row => row.product_id === product.id).map(row => ({
            id: Number(row.id),
            title: String(row.title),
            slug: String(row.slug || ''),
            image: null,
            position: Number(row.position),
            active: Boolean(row.active)
        }));
        product.categoryIds = product.categories.map(item => item.id);
        product.universeIds = product.universes.map(item => item.id)
    }
    return products
}

export async function replaceProductRelations(db: AppDatabase, productId: number, categoryIds: unknown, universeIds: unknown) {
    const categories = [...new Set((Array.isArray(categoryIds) ? categoryIds : []).map(Number).filter(Number.isInteger))];
    const universes = [...new Set((Array.isArray(universeIds) ? universeIds : []).map(Number).filter(Number.isInteger))];
    if (!categories.length || !universes.length) throw createError({
        statusCode: 400,
        statusMessage: 'Sélectionnez au moins une catégorie et un univers'
    });
    const categoryMarks = categories.map(() => '?').join(',');
    const universeMarks = universes.map(() => '?').join(',');
    const categoryCount = await db.prepare(`SELECT COUNT(*) total
                                            FROM categories
                                            WHERE id IN (${categoryMarks})`).bind(...categories).first<{
        total: number
    }>();
    const universeCount = await db.prepare(`SELECT COUNT(*) total
                                            FROM universes
                                            WHERE id IN (${universeMarks})`).bind(...universes).first<{
        total: number
    }>();
    if (categoryCount?.total !== categories.length || universeCount?.total !== universes.length) throw createError({
        statusCode: 400,
        statusMessage: 'Catégorie ou univers invalide'
    });
    await db.prepare('DELETE FROM product_categories WHERE product_id=?').bind(productId).run();
    await db.prepare('DELETE FROM product_universes WHERE product_id=?').bind(productId).run();
    await db.batch([...categories.map(id => db.prepare('INSERT INTO product_categories(product_id,category_id) VALUES(?,?)').bind(productId, id)), ...universes.map(id => db.prepare('INSERT INTO product_universes(product_id,universe_id) VALUES(?,?)').bind(productId, id))])
}
