import {imageContentKeys} from '~/types/shop'

export default defineEventHandler(async event => {
    const db = database(event);
    await ready(db);
    const {results: textRows} = await db.prepare('SELECT `key`,value FROM site_content').all<any>();
    const output: any = Object.fromEntries(textRows.map(row => [row.key, row.value]));
    const {results: imageRows} = await db.prepare('SELECT sci.key,i.id image_id,i.mime_type image_mime_type,i.width image_width,i.height image_height,i.natural_width image_natural_width,i.natural_height image_natural_height,di.id image_dark_id,di.mime_type image_dark_mime_type,di.width image_dark_width,di.height image_dark_height,di.natural_width image_dark_natural_width,di.natural_height image_dark_natural_height FROM site_content_images sci JOIN images i ON i.id=sci.image_id LEFT JOIN images di ON di.id=i.dark_image_id').all<any>();
    for (const key of imageContentKeys) output[key] = null;
    for (const row of imageRows) output[row.key] = mapImage(row);
    return output
})
