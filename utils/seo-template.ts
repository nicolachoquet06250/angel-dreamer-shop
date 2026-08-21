export function renderSeoTemplate(template: string, values: Record<string, string | number | undefined | null>) {
    return Object.entries(values).reduce((output, [label, value]) => {
        const val = String(value ?? '');
        return output.replaceAll(`[${label}]`, val).replaceAll(`{${label}}`, val);
    }, String(template || '')).replace(/\s+/g, ' ').trim()
}
