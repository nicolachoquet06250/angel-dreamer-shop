import {execFile} from 'node:child_process'
import {mkdtemp, mkdir, readFile, rm, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join, resolve} from 'node:path'
import {promisify} from 'node:util'
import {afterAll, beforeAll, describe, expect, it, vi} from 'vitest'

const run = promisify(execFile)
const scriptPath = resolve('scripts/fix-coverage-links.mjs')
let reportRoot = ''
let redirectSource = ''

beforeAll(async () => {
    reportRoot = await mkdtemp(join(tmpdir(), 'angel-dreamer-coverage-'))
    const componentsDirectory = join(reportRoot, 'components')
    await mkdir(componentsDirectory)
    await writeFile(join(componentsDirectory, 'index.html'), '<html lang="fr"><head></head><body></body></html>')
    await run(process.execPath, [scriptPath, reportRoot])

    const html = await readFile(join(componentsDirectory, 'index.html'), 'utf8')
    redirectSource = html.match(/<script data-coverage-path-fix>([\s\S]*?)<\/script>/)?.[1] ?? ''
})

afterAll(async () => {
    if (reportRoot) await rm(reportRoot, {recursive: true, force: true})
})

function executeRedirect(pathname: string, search = '?fichier=vue', hash = '#L12') {
    const replace = vi.fn()
    const location = {pathname, search, hash, replace}
    Function('location', redirectSource)(location)
    return replace
}

describe('liens du rapport de couverture', () => {
    it.each([
        ['/components/index.html', '/components/?fichier=vue#L12'],
        ['/components/index.html/', '/components/?fichier=vue#L12'],
        ['/index.html', '/?fichier=vue#L12']
    ])('retire index.html de %s', (pathname, expected) => {
        expect(redirectSource).not.toBe('')
        const replace = executeRedirect(pathname)
        expect(replace).toHaveBeenCalledOnce()
        expect(replace).toHaveBeenCalledWith(expected)
    })

    it('ajoute uniquement le slash manquant aux chemins de répertoire', () => {
        expect(executeRedirect('/components')).toHaveBeenCalledWith('/components/?fichier=vue#L12')
        expect(executeRedirect('/components/')).not.toHaveBeenCalled()
    })
})