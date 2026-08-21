export default defineEventHandler(async event => {
    const body = await readBody<{ code: string; lines: Array<{ id: number; quantity: number }> }>(event)
    const code = body.code?.trim().toUpperCase()
    if (!code) throw createError({statusCode: 400, statusMessage: 'Code requis'})
    const productIds = (body.lines || []).map((l: any) => Number(l.id)).filter(Number.isInteger)
    const result = await validatePromoCode(event, code, productIds)
    if (!result.valid) throw createError({statusCode: 422, statusMessage: result.error ?? 'Code invalide'})
    return {valid: true, rules: result.rules}
})
