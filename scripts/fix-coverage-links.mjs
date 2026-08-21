import {readdir, readFile, writeFile} from 'node:fs/promises'
import {resolve} from 'node:path'

const reportRoot = resolve(process.argv[2] || 'coverage')
const marker = 'data-coverage-path-fix'
const redirect = `<script ${marker}>(()=>{const p=location.pathname;const target=p.endsWith('/index.html/')?p.slice(0,-11):p.endsWith('/index.html')?p.slice(0,-10):p.endsWith('/')?'':p+'/';if(target)location.replace(target+location.search+location.hash)})()</script>`

async function patchDirectory(directory, isRoot = false) {
    const entries = await readdir(directory, {withFileTypes: true})

    if (!isRoot && entries.some(entry => entry.isFile() && entry.name === 'index.html')) {
        const indexPath = resolve(directory, 'index.html')
        const html = await readFile(indexPath, 'utf8')
        if (!html.includes(marker)) {
            await writeFile(indexPath, html.replace('<head>', `<head>${redirect}`))
        }
    }

    await Promise.all(entries
        .filter(entry => entry.isDirectory())
        .map(entry => patchDirectory(resolve(directory, entry.name))))
}

await patchDirectory(reportRoot, true)
