import type {H3Event} from 'h3'

const encoder = new TextEncoder()

export function createSecurityCode() {
    const bytes = crypto.getRandomValues(new Uint8Array(4))
    const value = ((bytes[0]! << 24) | (bytes[1]! << 16) | (bytes[2]! << 8) | bytes[3]!) >>> 0
    return String(value % 1_000_000).padStart(6, '0')
}

export function createResetToken() {
    const bytes = crypto.getRandomValues(new Uint8Array(32))
    return btoa(String.fromCharCode(...bytes)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export async function hashSecurityCode(event: H3Event, userId: number, code: string) {
    const secret = String(useRuntimeConfig(event).jwtSecret || '')
    if (!secret) throw createError({statusCode: 503, statusMessage: 'Authentification non configurée'})
    const digest = await crypto.subtle.digest('SHA-256', encoder.encode(`${userId}:${code}:${secret}`))
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
}

export function safeEqual(left: string, right: string) {
    if (left.length !== right.length) return false
    let difference = 0
    for (let index = 0; index < left.length; index++) difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
    return difference === 0
}
