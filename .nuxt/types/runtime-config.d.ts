import { RuntimeConfig as UserRuntimeConfig, PublicRuntimeConfig as UserPublicRuntimeConfig } from 'nuxt/schema'
  interface SharedRuntimeConfig {
   app: {
      buildId: string,

      baseURL: string,

      buildAssetsDir: string,

      cdnURL: string,
   },

   databaseDriver: string,

   databasePath: string,

   mysqlUrl: string,

   jwtSecret: string,

   stripeSecretKey: string,

   stripeWebhookSecret: string,

   paypalClientSecret: string,

   adminEmail: string,

   smtpHost: string,

   smtpPort: number,

   smtpSecure: boolean,

   smtpUser: string,

   smtpPassword: string,

   emailFrom: string,

   contactEmail: string,

   nitro: {
      envPrefix: string,
   },
  }
  interface SharedPublicRuntimeConfig {
   stripePublishableKey: string,

   paypalClientId: string,

   siteUrl: string,
  }
declare module '@nuxt/schema' {
  interface RuntimeConfig extends UserRuntimeConfig {}
  interface PublicRuntimeConfig extends UserPublicRuntimeConfig {}
}
declare module 'nuxt/schema' {
  interface RuntimeConfig extends SharedRuntimeConfig {}
  interface PublicRuntimeConfig extends SharedPublicRuntimeConfig {}
}
declare module 'vue' {
        interface ComponentCustomProperties {
          $config: UserRuntimeConfig
        }
      }