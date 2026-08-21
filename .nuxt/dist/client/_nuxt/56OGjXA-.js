function a(t,n){return Object.entries(n).reduce((c,[e,l])=>{const r=String(l??"");return c.replaceAll(`[${e}]`,r).replaceAll(`{${e}}`,r)},String(t||"")).replace(/\s+/g," ").trim()}export{a as r};
