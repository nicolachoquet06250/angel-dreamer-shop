function renderSeoTemplate(template, values) {
  return Object.entries(values).reduce((output, [label, value]) => {
    const val = String(value != null ? value : "");
    return output.replaceAll(`[${label}]`, val).replaceAll(`{${label}}`, val);
  }, String(template || "")).replace(/\s+/g, " ").trim();
}

export { renderSeoTemplate as r };
//# sourceMappingURL=seo-template-BqCbrlBi.mjs.map
