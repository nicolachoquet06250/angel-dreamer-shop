import {type AnySQLiteColumn, index, integer, sqliteTable, text} from 'drizzle-orm/sqlite-core'

export const images = sqliteTable('images', {
    id: integer('id').primaryKey({autoIncrement: true}),
    content: text('content').notNull(),
    mimeType: text('mime_type').notNull(),
    width: integer('width').notNull(),
    height: integer('height').notNull(),
    naturalWidth: integer('natural_width').notNull(),
    naturalHeight: integer('natural_height').notNull(),
    darkImageId: integer('dark_image_id').references((): AnySQLiteColumn => images.id, {onDelete: 'set null'}),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull()
})

export const products = sqliteTable('products', {
    id: integer('id').primaryKey({autoIncrement: true}),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    priceCents: integer('price_cents').notNull(),
    imageId: integer('image_id').references(() => images.id, {onDelete: 'set null'}),
    category: text('category').notNull(),
    featured: integer('featured', {mode: 'boolean'}).notNull().default(false),
    featuredPosition: integer('featured_position'),
    active: integer('active', {mode: 'boolean'}).notNull().default(true)
})

export const siteContent = sqliteTable('site_content', {key: text('key').primaryKey(), value: text('value').notNull()})

export const siteContentImages = sqliteTable('site_content_images', {
    key: text('key').primaryKey(),
    imageId: integer('image_id').notNull().references(() => images.id, {onDelete: 'cascade'})
})

export const universes = sqliteTable('universes', {
    id: integer('id').primaryKey({autoIncrement: true}),
    title: text('title').notNull(),
    slug: text('slug').unique(),
    imageId: integer('image_id').references(() => images.id, {onDelete: 'set null'}),
    position: integer('position').notNull().default(0),
    active: integer('active', {mode: 'boolean'}).notNull().default(true)
})

export const categories = sqliteTable('categories', {
    id: integer('id').primaryKey({autoIncrement: true}),
    label: text('label').notNull(),
    slug: text('slug').notNull().unique(),
    position: integer('position').notNull().default(0),
    active: integer('active', {mode: 'boolean'}).notNull().default(true)
})

export const productCategories = sqliteTable('product_categories', {
    productId: integer('product_id').notNull().references(() => products.id, {onDelete: 'cascade'}),
    categoryId: integer('category_id').notNull().references(() => categories.id, {onDelete: 'cascade'})
})

export const productUniverses = sqliteTable('product_universes', {
    productId: integer('product_id').notNull().references(() => products.id, {onDelete: 'cascade'}),
    universeId: integer('universe_id').notNull().references(() => universes.id, {onDelete: 'cascade'})
})

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({autoIncrement: true}),
    email: text('email').notNull().unique(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    passwordHash: text('password_hash').notNull(),
    role: text('role').notNull().default('customer'),
    active: integer('active', {mode: 'boolean'}).notNull().default(true),
    mustChangePassword: integer('must_change_password', {mode: 'boolean'}).notNull().default(false),
    createdByAdminId: integer('created_by_admin_id').references((): AnySQLiteColumn => users.id, {onDelete: 'set null'}),
    createdAt: text('created_at').notNull()
})

export const passwordResetCodes = sqliteTable('password_reset_codes', {
    id: integer('id').primaryKey({autoIncrement: true}),
    userId: integer('user_id').notNull().references(() => users.id, {onDelete: 'cascade'}),
    codeHash: text('code_hash').notNull(),
    purpose: text('purpose').notNull(),
    expiresAt: text('expires_at').notNull(),
    attempts: integer('attempts').notNull().default(0),
    usedAt: text('used_at'),
    createdAt: text('created_at').notNull()
}, table => [index('idx_password_reset_user_created').on(table.userId, table.createdAt)])

export const orders = sqliteTable('orders', {
    id: integer('id').primaryKey({autoIncrement: true}),
    provider: text('provider').notNull(),
    providerOrderId: text('provider_order_id').notNull(),
    amountCents: integer('amount_cents').notNull(),
    status: text('status').notNull(),
    customerEmail: text('customer_email'),
    createdAt: text('created_at').notNull()
})

export const discounts = sqliteTable('discounts', {
    id: integer('id').primaryKey({autoIncrement: true}),
    label: text('label').notNull(),
    type: text('type').notNull(), // 'percent' | 'fixed'
    value: integer('value').notNull(), // percent (0-100) or cents
    active: integer('active', {mode: 'boolean'}).notNull().default(true),
    startsAt: text('starts_at'),
    endsAt: text('ends_at'),
    createdAt: text('created_at').notNull()
})

// Each rule targets one scope: product, category or universe
export const discountRules = sqliteTable('discount_rules', {
    id: integer('id').primaryKey({autoIncrement: true}),
    discountId: integer('discount_id').notNull().references(() => discounts.id, {onDelete: 'cascade'}),
    scope: text('scope').notNull(), // 'product' | 'category' | 'universe'
    targetId: integer('target_id').notNull()
})

export const promoCodes = sqliteTable('promo_codes', {
    id: integer('id').primaryKey({autoIncrement: true}),
    code: text('code').notNull().unique(),
    active: integer('active', {mode: 'boolean'}).notNull().default(true),
    startsAt: text('starts_at'),
    endsAt: text('ends_at'),
    createdAt: text('created_at').notNull()
})

// Each rule targets one scope with its own discount type/value
export const promoCodeRules = sqliteTable('promo_code_rules', {
    id: integer('id').primaryKey({autoIncrement: true}),
    promoCodeId: integer('promo_code_id').notNull().references(() => promoCodes.id, {onDelete: 'cascade'}),
    scope: text('scope').notNull(), // 'product' | 'category' | 'universe' | 'all'
    targetId: integer('target_id'), // null when scope='all'
    type: text('type').notNull(), // 'percent' | 'fixed'
    value: integer('value').notNull() // percent (0-100) or cents
})
