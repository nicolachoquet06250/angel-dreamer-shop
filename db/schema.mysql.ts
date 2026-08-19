import {
    type AnyMySqlColumn,
    int,
    longtext,
    mysqlTable,
    primaryKey,
    text,
    tinyint,
    uniqueIndex,
    varchar
} from 'drizzle-orm/mysql-core'

export const images = mysqlTable('images', {
    id: int('id', {unsigned: true}).autoincrement().primaryKey(),
    content: longtext('content').notNull(),
    mimeType: varchar('mime_type', {length: 64}).notNull(),
    width: int('width', {unsigned: true}).notNull(),
    height: int('height', {unsigned: true}).notNull(),
    naturalWidth: int('natural_width', {unsigned: true}).notNull(),
    naturalHeight: int('natural_height', {unsigned: true}).notNull(),
    darkImageId: int('dark_image_id', {unsigned: true}).references((): AnyMySqlColumn => images.id, {onDelete: 'set null'}),
    createdAt: varchar('created_at', {length: 32}).notNull(),
    updatedAt: varchar('updated_at', {length: 32}).notNull()
})

export const products = mysqlTable('products', {
    id: int('id', {unsigned: true}).autoincrement().primaryKey(),
    slug: varchar('slug', {length: 191}).notNull().unique(),
    name: varchar('name', {length: 255}).notNull(),
    description: text('description').notNull(),
    priceCents: int('price_cents', {unsigned: true}).notNull(),
    imageId: int('image_id', {unsigned: true}).references(() => images.id, {onDelete: 'set null'}),
    category: varchar('category', {length: 191}).notNull().default(''),
    featured: tinyint('featured').notNull().default(0),
    featuredPosition: int('featured_position'),
    active: tinyint('active').notNull().default(1)
})

export const siteContent = mysqlTable('site_content', {
    key: varchar('key', {length: 191}).primaryKey(),
    value: text('value').notNull()
})

export const siteContentImages = mysqlTable('site_content_images', {
    key: varchar('key', {length: 191}).primaryKey(),
    imageId: int('image_id', {unsigned: true}).notNull().references(() => images.id, {onDelete: 'cascade'})
})

export const universes = mysqlTable('universes', {
    id: int('id', {unsigned: true}).autoincrement().primaryKey(),
    title: varchar('title', {length: 255}).notNull(),
    slug: varchar('slug', {length: 191}).unique(),
    imageId: int('image_id', {unsigned: true}).references(() => images.id, {onDelete: 'set null'}),
    position: int('position').notNull().default(0),
    active: tinyint('active').notNull().default(1)
})

export const categories = mysqlTable('categories', {
    id: int('id', {unsigned: true}).autoincrement().primaryKey(),
    label: varchar('label', {length: 255}).notNull(),
    slug: varchar('slug', {length: 191}).notNull().unique(),
    position: int('position').notNull().default(0),
    active: tinyint('active').notNull().default(1)
})

export const productCategories = mysqlTable('product_categories', {
    productId: int('product_id', {unsigned: true}).notNull().references(() => products.id, {onDelete: 'cascade'}),
    categoryId: int('category_id', {unsigned: true}).notNull().references(() => categories.id, {onDelete: 'cascade'})
}, table => [primaryKey({columns: [table.productId, table.categoryId]})])

export const productUniverses = mysqlTable('product_universes', {
    productId: int('product_id', {unsigned: true}).notNull().references(() => products.id, {onDelete: 'cascade'}),
    universeId: int('universe_id', {unsigned: true}).notNull().references(() => universes.id, {onDelete: 'cascade'})
}, table => [primaryKey({columns: [table.productId, table.universeId]})])

export const users = mysqlTable('users', {
    id: int('id', {unsigned: true}).autoincrement().primaryKey(),
    email: varchar('email', {length: 191}).notNull().unique(),
    firstName: varchar('first_name', {length: 80}),
    lastName: varchar('last_name', {length: 80}),
    passwordHash: varchar('password_hash', {length: 255}).notNull(),
    role: varchar('role', {length: 32}).notNull().default('customer'),
    active: tinyint('active').notNull().default(1),
    mustChangePassword: tinyint('must_change_password').notNull().default(0),
    createdAt: varchar('created_at', {length: 32}).notNull()
})

export const orders = mysqlTable('orders', {
    id: int('id', {unsigned: true}).autoincrement().primaryKey(),
    provider: varchar('provider', {length: 32}).notNull(),
    providerOrderId: varchar('provider_order_id', {length: 191}).notNull(),
    amountCents: int('amount_cents', {unsigned: true}).notNull(),
    status: varchar('status', {length: 64}).notNull(),
    customerEmail: varchar('customer_email', {length: 191}),
    createdAt: varchar('created_at', {length: 32}).notNull()
}, table => [uniqueIndex('idx_orders_provider_id').on(table.provider, table.providerOrderId)])
