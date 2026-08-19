export default defineNuxtConfig({
    srcDir: ".",
    compatibilityDate: "2025-07-15",
    devtools: {
        enabled: false
    },
    css: [],
    modules: [],
    nitro: {
        preset: "node-server",
        externals: {
            traceOptions: {
                base: process.cwd(),
                processCwd: process.cwd()
            }
        }
    },
    routeRules: {
        '/**': {
            headers: {
                'content-security-policy': "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob:; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline'; connect-src 'self'",
                'cross-origin-opener-policy': 'same-origin',
                'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(self)',
                'referrer-policy': 'strict-origin-when-cross-origin',
                'strict-transport-security': 'max-age=31536000; includeSubDomains',
                'x-content-type-options': 'nosniff',
                'x-frame-options': 'DENY'
            }
        }
    },
    app: {
        head: {
            htmlAttrs: {lang: "fr"},
            title: "Angel Dreamer — Objets imprimés en France",
            meta: [
                {
                    name: "description",
                    content: "Objets physiques originaux, imprimés à la demande en France."
                },
                {
                    property: "og:image",
                    content: "/og.png"
                },
                {
                    name: "twitter:card",
                    content: "summary_large_image"
                }
            ]
        }
    },
    runtimeConfig: {
        databaseDriver: "sqlite",
        databasePath: "./db/angel-dreamer.sqlite",
        mysqlUrl: "",
        jwtSecret: "",
        stripeSecretKey: "",
        stripeWebhookSecret: "",
        paypalClientSecret: "",
        adminEmail: "",
        smtpHost: "",
        smtpPort: 587,
        smtpSecure: false,
        smtpUser: "",
        smtpPassword: "",
        emailFrom: "",
        public: {
            stripePublishableKey: "",
            paypalClientId: "",
            siteUrl: ""
        }
    },
    typescript: {strict: true},
    devServer: {
        host: '0.0.0.0'
    }
})
