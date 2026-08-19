export default defineEventHandler(async event => {
    await requireAdmin(event);
    const db = database(event);
    await ready(db);
    const {results} = await db.prepare('SELECT i.id image_id,i.mime_type image_mime_type,i.width image_width,i.height image_height,i.natural_width image_natural_width,i.natural_height image_natural_height,di.id image_dark_id,di.mime_type image_dark_mime_type,di.width image_dark_width,di.height image_dark_height,di.natural_width image_dark_natural_width,di.natural_height image_dark_natural_height,(SELECT COUNT(*) FROM products p WHERE p.image_id=i.id)+(SELECT COUNT(*) FROM universes u WHERE u.image_id=i.id)+(SELECT COUNT(*) FROM site_content_images sci WHERE sci.image_id=i.id) usage_count FROM images i LEFT JOIN images di ON di.id=i.dark_image_id WHERE NOT EXISTS(SELECT 1 FROM images parent WHERE parent.dark_image_id=i.id) ORDER BY i.id DESC').all<any>();
    return results.map(row => ({...mapImage(row), usageCount: Number(row.usage_count)}))
})
