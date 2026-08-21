declare global {
  const H3Error: typeof import('../../node_modules/h3').H3Error
  const H3Event: typeof import('../../node_modules/h3').H3Event
  const __buildAssetsURL: typeof import('../../node_modules/@nuxt/nitro-server/dist/runtime/utils/paths').buildAssetsURL
  const __publicAssetsURL: typeof import('../../node_modules/@nuxt/nitro-server/dist/runtime/utils/paths').publicAssetsURL
  const appendCorsHeaders: typeof import('../../node_modules/h3').appendCorsHeaders
  const appendCorsPreflightHeaders: typeof import('../../node_modules/h3').appendCorsPreflightHeaders
  const appendHeader: typeof import('../../node_modules/h3').appendHeader
  const appendHeaders: typeof import('../../node_modules/h3').appendHeaders
  const appendResponseHeader: typeof import('../../node_modules/h3').appendResponseHeader
  const appendResponseHeaders: typeof import('../../node_modules/h3').appendResponseHeaders
  const applyDiscountsToCheckout: typeof import('../../server/utils/discounts').applyDiscountsToCheckout
  const applyDiscountsToLine: typeof import('../../server/utils/discounts').applyDiscountsToLine
  const applyPromoToLine: typeof import('../../server/utils/discounts').applyPromoToLine
  const assertMethod: typeof import('../../node_modules/h3').assertMethod
  const bootstrapDefaultAdmin: typeof import('../../server/utils/admin-bootstrap').bootstrapDefaultAdmin
  const buildLlmsDocument: typeof import('../../server/utils/llms-document').buildLlmsDocument
  const cachedEventHandler: typeof import('../../node_modules/nitropack/dist/runtime/internal/cache').cachedEventHandler
  const cachedFunction: typeof import('../../node_modules/nitropack/dist/runtime/internal/cache').cachedFunction
  const callNodeListener: typeof import('../../node_modules/h3').callNodeListener
  const checkoutLines: typeof import('../../server/utils/checkout').checkoutLines
  const clearAuthSession: typeof import('../../server/utils/auth').clearAuthSession
  const clearResponseHeaders: typeof import('../../node_modules/h3').clearResponseHeaders
  const clearSession: typeof import('../../node_modules/h3').clearSession
  const createApp: typeof import('../../node_modules/h3').createApp
  const createAppEventHandler: typeof import('../../node_modules/h3').createAppEventHandler
  const createError: typeof import('../../node_modules/h3').createError
  const createEvent: typeof import('../../node_modules/h3').createEvent
  const createEventStream: typeof import('../../node_modules/h3').createEventStream
  const createResetToken: typeof import('../../server/utils/password-reset').createResetToken
  const createRouter: typeof import('../../node_modules/h3').createRouter
  const createSecurityCode: typeof import('../../server/utils/password-reset').createSecurityCode
  const database: typeof import('../../server/utils/db').database
  const defaultContentType: typeof import('../../node_modules/h3').defaultContentType
  const defineAppConfig: typeof import('../../node_modules/@nuxt/nitro-server/dist/runtime/utils/config').defineAppConfig
  const defineCachedEventHandler: typeof import('../../node_modules/nitropack/dist/runtime/internal/cache').defineCachedEventHandler
  const defineCachedFunction: typeof import('../../node_modules/nitropack/dist/runtime/internal/cache').defineCachedFunction
  const defineEventHandler: typeof import('../../node_modules/h3').defineEventHandler
  const defineLazyEventHandler: typeof import('../../node_modules/h3').defineLazyEventHandler
  const defineNitroErrorHandler: typeof import('../../node_modules/nitropack/dist/runtime/internal/error/utils').defineNitroErrorHandler
  const defineNitroPlugin: typeof import('../../node_modules/nitropack/dist/runtime/internal/plugin').defineNitroPlugin
  const defineNodeListener: typeof import('../../node_modules/h3').defineNodeListener
  const defineNodeMiddleware: typeof import('../../node_modules/h3').defineNodeMiddleware
  const defineRenderHandler: typeof import('../../node_modules/nitropack/dist/runtime/internal/renderer').defineRenderHandler
  const defineRequestMiddleware: typeof import('../../node_modules/h3').defineRequestMiddleware
  const defineResponseMiddleware: typeof import('../../node_modules/h3').defineResponseMiddleware
  const defineRouteMeta: typeof import('../../node_modules/nitropack/dist/runtime/internal/meta').defineRouteMeta
  const defineTask: typeof import('../../node_modules/nitropack/dist/runtime/internal/task').defineTask
  const defineWebSocket: typeof import('../../node_modules/h3').defineWebSocket
  const defineWebSocketHandler: typeof import('../../node_modules/h3').defineWebSocketHandler
  const deleteCookie: typeof import('../../node_modules/h3').deleteCookie
  const dynamicEventHandler: typeof import('../../node_modules/h3').dynamicEventHandler
  const enrichProductsWithDiscounts: typeof import('../../server/utils/discounts').enrichProductsWithDiscounts
  const eventHandler: typeof import('../../node_modules/h3').eventHandler
  const fetchWithEvent: typeof import('../../node_modules/h3').fetchWithEvent
  const formatLlmsDocument: typeof import('../../server/utils/llms-document').formatLlmsDocument
  const fromNodeMiddleware: typeof import('../../node_modules/h3').fromNodeMiddleware
  const fromPlainHandler: typeof import('../../node_modules/h3').fromPlainHandler
  const fromWebHandler: typeof import('../../node_modules/h3').fromWebHandler
  const getCookie: typeof import('../../node_modules/h3').getCookie
  const getHeader: typeof import('../../node_modules/h3').getHeader
  const getHeaders: typeof import('../../node_modules/h3').getHeaders
  const getMethod: typeof import('../../node_modules/h3').getMethod
  const getProxyRequestHeaders: typeof import('../../node_modules/h3').getProxyRequestHeaders
  const getQuery: typeof import('../../node_modules/h3').getQuery
  const getRequestFingerprint: typeof import('../../node_modules/h3').getRequestFingerprint
  const getRequestHeader: typeof import('../../node_modules/h3').getRequestHeader
  const getRequestHeaders: typeof import('../../node_modules/h3').getRequestHeaders
  const getRequestHost: typeof import('../../node_modules/h3').getRequestHost
  const getRequestIP: typeof import('../../node_modules/h3').getRequestIP
  const getRequestPath: typeof import('../../node_modules/h3').getRequestPath
  const getRequestProtocol: typeof import('../../node_modules/h3').getRequestProtocol
  const getRequestURL: typeof import('../../node_modules/h3').getRequestURL
  const getRequestWebStream: typeof import('../../node_modules/h3').getRequestWebStream
  const getResponseHeader: typeof import('../../node_modules/h3').getResponseHeader
  const getResponseHeaders: typeof import('../../node_modules/h3').getResponseHeaders
  const getResponseStatus: typeof import('../../node_modules/h3').getResponseStatus
  const getResponseStatusText: typeof import('../../node_modules/h3').getResponseStatusText
  const getRouteRules: typeof import('../../node_modules/nitropack/dist/runtime/internal/route-rules').getRouteRules
  const getRouterParam: typeof import('../../node_modules/h3').getRouterParam
  const getRouterParams: typeof import('../../node_modules/h3').getRouterParams
  const getSession: typeof import('../../node_modules/h3').getSession
  const getValidatedQuery: typeof import('../../node_modules/h3').getValidatedQuery
  const getValidatedRouterParams: typeof import('../../node_modules/h3').getValidatedRouterParams
  const handleCacheHeaders: typeof import('../../node_modules/h3').handleCacheHeaders
  const handleCors: typeof import('../../node_modules/h3').handleCors
  const hasRecentCode: typeof import('../../server/utils/contact-codes').hasRecentCode
  const hashPassword: typeof import('../../server/utils/auth').hashPassword
  const hashSecurityCode: typeof import('../../server/utils/password-reset').hashSecurityCode
  const imageResponse: typeof import('../../server/utils/image-response').imageResponse
  const isCorsOriginAllowed: typeof import('../../node_modules/h3').isCorsOriginAllowed
  const isError: typeof import('../../node_modules/h3').isError
  const isEvent: typeof import('../../node_modules/h3').isEvent
  const isEventHandler: typeof import('../../node_modules/h3').isEventHandler
  const isMethod: typeof import('../../node_modules/h3').isMethod
  const isPreflightRequest: typeof import('../../node_modules/h3').isPreflightRequest
  const isStream: typeof import('../../node_modules/h3').isStream
  const isWebResponse: typeof import('../../node_modules/h3').isWebResponse
  const lazyEventHandler: typeof import('../../node_modules/h3').lazyEventHandler
  const mapCategory: typeof import('../../server/utils/db').mapCategory
  const mapImage: typeof import('../../server/utils/db').mapImage
  const mapProduct: typeof import('../../server/utils/db').mapProduct
  const mapProductsWithRelations: typeof import('../../server/utils/db').mapProductsWithRelations
  const mapUniverse: typeof import('../../server/utils/db').mapUniverse
  const nitroPlugin: typeof import('../../node_modules/nitropack/dist/runtime/internal/plugin').nitroPlugin
  const parseCookies: typeof import('../../node_modules/h3').parseCookies
  const paypalToken: typeof import('../../server/utils/checkout').paypalToken
  const persistImage: typeof import('../../server/utils/db').persistImage
  const productSelect: typeof import('../../server/utils/db').productSelect
  const promisifyNodeListener: typeof import('../../node_modules/h3').promisifyNodeListener
  const proxyRequest: typeof import('../../node_modules/h3').proxyRequest
  const readBody: typeof import('../../node_modules/h3').readBody
  const readFormData: typeof import('../../node_modules/h3').readFormData
  const readMultipartFormData: typeof import('../../node_modules/h3').readMultipartFormData
  const readRawBody: typeof import('../../node_modules/h3').readRawBody
  const readValidatedBody: typeof import('../../node_modules/h3').readValidatedBody
  const ready: typeof import('../../server/utils/db').ready
  const removeResponseHeader: typeof import('../../node_modules/h3').removeResponseHeader
  const replaceProductRelations: typeof import('../../server/utils/db').replaceProductRelations
  const requireAdmin: typeof import('../../server/utils/auth').requireAdmin
  const requireUser: typeof import('../../server/utils/auth').requireUser
  const runTask: typeof import('../../node_modules/nitropack/dist/runtime/internal/task').runTask
  const safeEqual: typeof import('../../server/utils/password-reset').safeEqual
  const sanitizeStatusCode: typeof import('../../node_modules/h3').sanitizeStatusCode
  const sanitizeStatusMessage: typeof import('../../node_modules/h3').sanitizeStatusMessage
  const sealSession: typeof import('../../node_modules/h3').sealSession
  const send: typeof import('../../node_modules/h3').send
  const sendAdminPasswordReset: typeof import('../../server/utils/mailer').sendAdminPasswordReset
  const sendDemoAccountEnded: typeof import('../../server/utils/mailer').sendDemoAccountEnded
  const sendError: typeof import('../../node_modules/h3').sendError
  const sendInitialAdminPassword: typeof import('../../server/utils/mailer').sendInitialAdminPassword
  const sendIterable: typeof import('../../node_modules/h3').sendIterable
  const sendNoContent: typeof import('../../node_modules/h3').sendNoContent
  const sendPasswordCode: typeof import('../../server/utils/mailer').sendPasswordCode
  const sendProxy: typeof import('../../node_modules/h3').sendProxy
  const sendRawMail: typeof import('../../server/utils/mailer').sendRawMail
  const sendRedirect: typeof import('../../node_modules/h3').sendRedirect
  const sendStream: typeof import('../../node_modules/h3').sendStream
  const sendTransactionalMail: typeof import('../../server/utils/mailer').sendTransactionalMail
  const sendWebResponse: typeof import('../../node_modules/h3').sendWebResponse
  const serveStatic: typeof import('../../node_modules/h3').serveStatic
  const sessionUser: typeof import('../../server/utils/auth').sessionUser
  const setCookie: typeof import('../../node_modules/h3').setCookie
  const setHeader: typeof import('../../node_modules/h3').setHeader
  const setHeaders: typeof import('../../node_modules/h3').setHeaders
  const setResponseHeader: typeof import('../../node_modules/h3').setResponseHeader
  const setResponseHeaders: typeof import('../../node_modules/h3').setResponseHeaders
  const setResponseStatus: typeof import('../../node_modules/h3').setResponseStatus
  const signSession: typeof import('../../server/utils/auth').signSession
  const splitCookiesString: typeof import('../../node_modules/h3').splitCookiesString
  const storeContactCode: typeof import('../../server/utils/contact-codes').storeContactCode
  const toEventHandler: typeof import('../../node_modules/h3').toEventHandler
  const toNodeListener: typeof import('../../node_modules/h3').toNodeListener
  const toPlainHandler: typeof import('../../node_modules/h3').toPlainHandler
  const toWebHandler: typeof import('../../node_modules/h3').toWebHandler
  const toWebRequest: typeof import('../../node_modules/h3').toWebRequest
  const universeSelect: typeof import('../../server/utils/db').universeSelect
  const unsealSession: typeof import('../../node_modules/h3').unsealSession
  const updateSession: typeof import('../../node_modules/h3').updateSession
  const useAppConfig: typeof import('../../node_modules/nitropack/dist/runtime/internal/config').useAppConfig
  const useBase: typeof import('../../node_modules/h3').useBase
  const useEvent: typeof import('../../node_modules/nitropack/dist/runtime/internal/context').useEvent
  const useNitroApp: typeof import('../../node_modules/nitropack/dist/runtime/internal/app').useNitroApp
  const useRuntimeConfig: typeof import('../../node_modules/nitropack/dist/runtime/internal/config').useRuntimeConfig
  const useSession: typeof import('../../node_modules/h3').useSession
  const useStorage: typeof import('../../node_modules/nitropack/dist/runtime/internal/storage').useStorage
  const validateContactCode: typeof import('../../server/utils/contact-codes').validateContactCode
  const validatePromoCode: typeof import('../../server/utils/discounts').validatePromoCode
  const verifyPassword: typeof import('../../server/utils/auth').verifyPassword
  const writeEarlyHints: typeof import('../../node_modules/h3').writeEarlyHints
}
// for type re-export
declare global {
  // @ts-ignore
  export type { EventHandler, EventHandlerRequest, EventHandlerResponse, EventHandlerObject, H3EventContext } from '../../node_modules/h3'
  import('../../node_modules/h3')
  // @ts-ignore
  export type { BoundStatement, AppDatabase } from '../../server/utils/db'
  import('../../server/utils/db')
  // @ts-ignore
  export type { DiscountType, DiscountScope, DiscountRule, Discount, PromoCode, CartLineWithMeta, AppliedDiscount } from '../../server/utils/discounts'
  import('../../server/utils/discounts')
}
export { H3Event, H3Error, appendCorsHeaders, appendCorsPreflightHeaders, appendHeader, appendHeaders, appendResponseHeader, appendResponseHeaders, assertMethod, callNodeListener, clearResponseHeaders, clearSession, createApp, createAppEventHandler, createError, createEvent, createEventStream, createRouter, defaultContentType, defineEventHandler, defineLazyEventHandler, defineNodeListener, defineNodeMiddleware, defineRequestMiddleware, defineResponseMiddleware, defineWebSocket, defineWebSocketHandler, deleteCookie, dynamicEventHandler, eventHandler, fetchWithEvent, fromNodeMiddleware, fromPlainHandler, fromWebHandler, getCookie, getHeader, getHeaders, getMethod, getProxyRequestHeaders, getQuery, getRequestFingerprint, getRequestHeader, getRequestHeaders, getRequestHost, getRequestIP, getRequestPath, getRequestProtocol, getRequestURL, getRequestWebStream, getResponseHeader, getResponseHeaders, getResponseStatus, getResponseStatusText, getRouterParam, getRouterParams, getSession, getValidatedQuery, getValidatedRouterParams, handleCacheHeaders, handleCors, isCorsOriginAllowed, isError, isEvent, isEventHandler, isMethod, isPreflightRequest, isStream, isWebResponse, lazyEventHandler, parseCookies, promisifyNodeListener, proxyRequest, readBody, readFormData, readMultipartFormData, readRawBody, readValidatedBody, removeResponseHeader, sanitizeStatusCode, sanitizeStatusMessage, sealSession, send, sendError, sendIterable, sendNoContent, sendProxy, sendRedirect, sendStream, sendWebResponse, serveStatic, setCookie, setHeader, setHeaders, setResponseHeader, setResponseHeaders, setResponseStatus, splitCookiesString, toEventHandler, toNodeListener, toPlainHandler, toWebHandler, toWebRequest, unsealSession, updateSession, useBase, useSession, writeEarlyHints } from 'h3';
export { useNitroApp } from 'nitropack/runtime/internal/app';
export { useRuntimeConfig, useAppConfig } from 'nitropack/runtime/internal/config';
export { defineNitroPlugin, nitroPlugin } from 'nitropack/runtime/internal/plugin';
export { defineCachedFunction, defineCachedEventHandler, cachedFunction, cachedEventHandler } from 'nitropack/runtime/internal/cache';
export { useStorage } from 'nitropack/runtime/internal/storage';
export { defineRenderHandler } from 'nitropack/runtime/internal/renderer';
export { defineRouteMeta } from 'nitropack/runtime/internal/meta';
export { getRouteRules } from 'nitropack/runtime/internal/route-rules';
export { useEvent } from 'nitropack/runtime/internal/context';
export { defineTask, runTask } from 'nitropack/runtime/internal/task';
export { defineNitroErrorHandler } from 'nitropack/runtime/internal/error/utils';
export { buildAssetsURL as __buildAssetsURL, publicAssetsURL as __publicAssetsURL } from '/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/@nuxt/nitro-server/dist/runtime/utils/paths';
export { defineAppConfig } from '/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/@nuxt/nitro-server/dist/runtime/utils/config';
export { bootstrapDefaultAdmin } from '/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/server/utils/admin-bootstrap';
export { hashPassword, verifyPassword, signSession, sessionUser, requireUser, requireAdmin, clearAuthSession } from '/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/server/utils/auth';
export { checkoutLines, paypalToken } from '/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/server/utils/checkout';
export { storeContactCode, validateContactCode, hasRecentCode } from '/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/server/utils/contact-codes';
export { database, ready, mapImage, persistImage, productSelect, mapProduct, universeSelect, mapUniverse, mapCategory, mapProductsWithRelations, replaceProductRelations } from '/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/server/utils/db';
export { applyDiscountsToLine, applyPromoToLine, applyDiscountsToCheckout, enrichProductsWithDiscounts, validatePromoCode } from '/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/server/utils/discounts';
export { imageResponse } from '/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/server/utils/image-response';
export { formatLlmsDocument, buildLlmsDocument } from '/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/server/utils/llms-document';
export { sendRawMail, sendTransactionalMail, sendPasswordCode, sendInitialAdminPassword, sendAdminPasswordReset, sendDemoAccountEnded } from '/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/server/utils/mailer';
export { createSecurityCode, createResetToken, hashSecurityCode, safeEqual } from '/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/server/utils/password-reset';