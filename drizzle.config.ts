import {defineConfig} from "drizzle-kit";

const mysql = process.env.NUXT_DATABASE_DRIVER === 'mysql'

const defineMysqlConfig = () => defineConfig({
    out: './drizzle-mysql',
    schema: './db/schema.mysql.ts',
    dialect: 'mysql',
    dbCredentials: {url: process.env.NUXT_MYSQL_URL!}
});

const defineSqliteConfig = () => defineConfig({
    out: './drizzle',
    schema: './db/schema.ts',
    dialect: 'sqlite',
    dbCredentials: {url: process.env.NUXT_DATABASE_PATH!}
});

export default (mysql ? defineMysqlConfig : defineSqliteConfig)()
