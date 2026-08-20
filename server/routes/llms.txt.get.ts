export default defineEventHandler(async event => {
    setHeader(event, 'content-type', 'text/plain; charset=utf-8')
    setHeader(event, 'cache-control', 'public, max-age=0, must-revalidate')
    return buildLlmsDocument(event)
})
