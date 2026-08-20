export function renderSeoTemplate(template: string, values: Record<string, string | number | undefined | null>) {
    return Object.entries(values).reduce((output, [label, value]) => output.replaceAll(`[${label}]`, String(value ?? '')), String(template || '')).replace(/\s+/g, ' ').trim()
}
