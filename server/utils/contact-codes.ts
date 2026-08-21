interface CodeEntry { code: string; expires: number; attempts: number }
const store = new Map<string, CodeEntry>()

export function storeContactCode(email: string, code: string) {
    store.set(email.toLowerCase(), {code, expires: Date.now() + 10 * 60 * 1000, attempts: 0})
}

export function validateContactCode(email: string, code: string): boolean {
    const entry = store.get(email.toLowerCase())
    if (!entry || Date.now() > entry.expires) return false
    entry.attempts++
    if (entry.attempts > 5) return false
    if (entry.code !== code) return false
    store.delete(email.toLowerCase())
    return true
}

export function hasRecentCode(email: string): boolean {
    const entry = store.get(email.toLowerCase())
    return !!entry && Date.now() < entry.expires
}
