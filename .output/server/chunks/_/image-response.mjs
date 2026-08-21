import { g as getRouterParam, e as createError, a as database, b as ready, H as setHeader, D as getQuery } from '../nitro/nitro.mjs';
import sharp from 'sharp';

const allowedMimeTypes = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const sizePattern = /^(\d{1,4})(?:x(\d{1,4}))?$/;
const maxDimension = 4096;
const maxPixels = 16777216;
function requestedSize(event) {
  const value = getQuery(event).size;
  if (value === void 0 || value === "") return null;
  if (typeof value !== "string") throw createError({ statusCode: 400, statusMessage: "Param\xE8tre size invalide" });
  const match = sizePattern.exec(value);
  const width = Number(match == null ? void 0 : match[1]);
  const height = (match == null ? void 0 : match[2]) ? Number(match[2]) : void 0;
  if (!match || width < 1 || width > maxDimension || height !== void 0 && (height < 1 || height > maxDimension || width * height > maxPixels)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Utilisez size=largeur ou size=largeurxhauteur, avec une dimension maximale de 4096 px"
    });
  }
  return { width, height };
}
async function imageResponse(event) {
  const id = Number(getRouterParam(event, "id"));
  if (!Number.isInteger(id) || id < 1) throw createError({ statusCode: 400, statusMessage: "Image invalide" });
  const db = database(event);
  await ready(db);
  const image = await db.prepare("SELECT content,mime_type FROM images WHERE id=?").bind(id).first();
  if (!image) throw createError({ statusCode: 404, statusMessage: "Image introuvable" });
  const match = /^data:([^;,]+);base64,([a-zA-Z0-9+/=\r\n]+)$/.exec(image.content);
  const mimeType = allowedMimeTypes.has(image.mime_type) ? image.mime_type : match == null ? void 0 : match[1];
  if (!match || !mimeType || !allowedMimeTypes.has(mimeType)) throw createError({
    statusCode: 415,
    statusMessage: "Format d\u2019image non pris en charge"
  });
  const size = requestedSize(event);
  const original = Buffer.from(match[2], "base64");
  const output = size ? await sharp(original, { animated: mimeType === "image/gif", limitInputPixels: 4e7 }).resize({
    width: size.width,
    height: size.height,
    fit: size.height ? "fill" : "inside",
    withoutEnlargement: false
  }).toBuffer() : original;
  setHeader(event, "content-type", mimeType);
  setHeader(event, "cache-control", "public, max-age=31536000, immutable");
  setHeader(event, "x-content-type-options", "nosniff");
  return output;
}

export { imageResponse as i };
//# sourceMappingURL=image-response.mjs.map
