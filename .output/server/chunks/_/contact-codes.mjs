const store = /* @__PURE__ */ new Map();
function storeContactCode(email, code) {
  store.set(email.toLowerCase(), { code, expires: Date.now() + 10 * 60 * 1e3, attempts: 0 });
}
function validateContactCode(email, code) {
  const entry = store.get(email.toLowerCase());
  if (!entry || Date.now() > entry.expires) return false;
  entry.attempts++;
  if (entry.attempts > 5) return false;
  if (entry.code !== code) return false;
  store.delete(email.toLowerCase());
  return true;
}

export { storeContactCode as s, validateContactCode as v };
//# sourceMappingURL=contact-codes.mjs.map
