import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http, { Server as Server$1 } from 'node:http';
import https, { Server } from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync, mkdirSync } from 'node:fs';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import BetterSqlite3 from 'better-sqlite3';
import mysql from 'mysql2/promise';
import nodemailer from 'nodemailer';
import { render } from '@vue-email/render';
import { defineComponent, openBlock, createBlock, unref, withCtx, createVNode, createTextVNode, toDisplayString } from 'vue';
import { Html, Head, Preview, Body, Container, Heading, Text, Button } from '@vue-email/components';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
const ENC_ENC_SLASH_RE = /%252f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return encode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F").replace(AMPERSAND_RE, "%26").replace(PLUS_RE, "%2B");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const nextChar = input[_base.length];
  if (nextChar && nextChar !== "/" && nextChar !== "?") {
    return input;
  }
  const trimmed = input.slice(_base.length).replace(/^\/+/, "");
  return "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const NullObject = /* @__PURE__ */ (() => {
  const C = function() {
  };
  C.prototype = /* @__PURE__ */ Object.create(null);
  return C;
})();
function parse$1(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = new NullObject();
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$2(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = { ...defaults };
  for (const key of Object.keys(baseObject)) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),s&&s(),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c=class{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _(){return Object.assign(c.prototype,i$1.prototype),Object.assign(c.prototype,l$1.prototype),c}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_();class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}}class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S=new Set([101,204,205,304]);async function b(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function parse(multipartBodyBuffer, boundary) {
  let lastline = "";
  let state = 0 /* INIT */;
  let buffer = [];
  const allParts = [];
  let currentPartHeaders = [];
  for (let i = 0; i < multipartBodyBuffer.length; i++) {
    const prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null;
    const currByte = multipartBodyBuffer[i];
    const newLineChar = currByte === 10 || currByte === 13;
    if (!newLineChar) {
      lastline += String.fromCodePoint(currByte);
    }
    const newLineDetected = currByte === 10 && prevByte === 13;
    if (0 /* INIT */ === state && newLineDetected) {
      if ("--" + boundary === lastline) {
        state = 1 /* READING_HEADERS */;
      }
      lastline = "";
    } else if (1 /* READING_HEADERS */ === state && newLineDetected) {
      if (lastline.length > 0) {
        const i2 = lastline.indexOf(":");
        if (i2 > 0) {
          const name = lastline.slice(0, i2).toLowerCase();
          const value = lastline.slice(i2 + 1).trim();
          currentPartHeaders.push([name, value]);
        }
      } else {
        state = 2 /* READING_DATA */;
        buffer = [];
      }
      lastline = "";
    } else if (2 /* READING_DATA */ === state) {
      if (lastline.length > boundary.length + 4) {
        lastline = "";
      }
      if ("--" + boundary === lastline) {
        const j = buffer.length - lastline.length;
        const part = buffer.slice(0, j - 1);
        allParts.push(process$1(part, currentPartHeaders));
        buffer = [];
        currentPartHeaders = [];
        lastline = "";
        state = 3 /* READING_PART_SEPARATOR */;
      } else {
        buffer.push(currByte);
      }
      if (newLineDetected) {
        lastline = "";
      }
    } else if (3 /* READING_PART_SEPARATOR */ === state && newLineDetected) {
      state = 1 /* READING_HEADERS */;
    }
  }
  return allParts;
}
function process$1(data, headers) {
  const dataObj = {};
  const contentDispositionHeader = headers.find((h) => h[0] === "content-disposition")?.[1] || "";
  for (const i of contentDispositionHeader.split(";")) {
    const s = i.split("=");
    if (s.length !== 2) {
      continue;
    }
    const key = (s[0] || "").trim();
    if (key === "name" || key === "filename") {
      const _value = (s[1] || "").trim().replace(/"/g, "");
      dataObj[key] = Buffer.from(_value, "latin1").toString("utf8");
    }
  }
  const contentType = headers.find((h) => h[0] === "content-type")?.[1] || "";
  if (contentType) {
    dataObj.type = contentType;
  }
  dataObj.data = Buffer.from(data);
  return dataObj;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key in params) {
      params[key] = decode$1(params[key]);
    }
  }
  return params;
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
const getHeader = getRequestHeader;
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !/\bchunked\b/i.test(
    String(event.node.req.headers["transfer-encoding"] ?? "")
  )) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
async function readMultipartFormData(event) {
  const contentType = getRequestHeader(event, "content-type");
  if (!contentType || !contentType.startsWith("multipart/form-data")) {
    return;
  }
  const boundary = contentType.match(/boundary=([^;]*)(;|$)/i)?.[1];
  if (!boundary) {
    return;
  }
  const body = await readRawBody(event, false);
  if (!body) {
    return;
  }
  return parse(body, boundary);
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return void 0;
  }
  try {
    return destr(body, { strict });
  } catch {
    throw createError$1({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return parse$1(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$2(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _rawReqUrl = event.node.req.url || "/";
    const _reqPath = _decodePath(event._path || _rawReqUrl);
    event._path = _reqPath;
    const _needsRawUrl = _reqPath !== _rawReqUrl;
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _needsRawUrl ? layer.route.length > 1 ? _rawReqUrl.slice(layer.route.length) || "/" : _rawReqUrl : _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function _decodePath(url) {
  const qIndex = url.indexOf("?");
  const path = qIndex === -1 ? url : url.slice(0, qIndex);
  const query = qIndex === -1 ? "" : url.slice(qIndex);
  const decodedPath = path.includes("%25") ? decodePath(path.replace(/%25/g, "%2525")) : decodePath(path);
  return decodedPath + query;
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s;
const AbortController = globalThis.AbortController || i;
const ofetch = createFetch({ fetch, Headers: Headers$1, AbortController });
const $fetch = ofetch;

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function serialize$1(input) {
	if (typeof input === "string") return `'${input}'`;
	return new Serializer().serialize(input);
}
const asciiOrder = " _-,;:!?.'\"()[]{}@*/\\&#%`^+<=>|~$0123456789abcdefghijklmnopqrstuvwxyz";
const asciiWeights = /*@__PURE__*/ (function() {
	const weights = /* @__PURE__ */ new Uint8Array(128);
	for (let i = 0; i < 69; i++) weights[asciiOrder.charCodeAt(i)] = i + 1;
	for (let code = 65; code <= 90; code++) weights[code] = weights[code + 32];
	return weights;
})();
function compareStrings(a, b) {
	if (a === b) return 0;
	const length = Math.min(a.length, b.length);
	let tieBreaker = 0;
	for (let i = 0; i < length; i++) {
		const codeA = a.charCodeAt(i);
		const codeB = b.charCodeAt(i);
		if (codeA === codeB) continue;
		const weightA = codeA < 128 && asciiWeights[codeA] ? asciiWeights[codeA] : codeA + 128;
		const weightB = codeB < 128 && asciiWeights[codeB] ? asciiWeights[codeB] : codeB + 128;
		if (weightA !== weightB) return weightA < weightB ? -1 : 1;
		if (tieBreaker === 0) tieBreaker = codeA > codeB ? -1 : 1;
	}
	if (a.length !== b.length) return a.length < b.length ? -1 : 1;
	return tieBreaker;
}
const Serializer = /*@__PURE__*/ (function() {
	class Serializer {
		#context = /* @__PURE__ */ new Map();
		compare(a, b) {
			const typeA = typeof a;
			const typeB = typeof b;
			if (typeA === "string" && typeB === "string") return compareStrings(a, b);
			if (typeA === "number" && typeB === "number") return a - b;
			return compareStrings(this.serialize(a, true), this.serialize(b, true));
		}
		serialize(value, noQuotes) {
			if (value === null) return "null";
			switch (typeof value) {
				case "string": return noQuotes ? value : `'${value}'`;
				case "bigint": return `${value}n`;
				case "object": return this.$object(value);
				case "function": return this.$function(value);
			}
			return String(value);
		}
		serializeObject(object) {
			const objString = Object.prototype.toString.call(object);
			if (objString !== "[object Object]") return this.serializeBuiltInType(objString.length < 10 ? `unknown:${objString}` : objString.slice(8, -1), object);
			const constructor = object.constructor;
			const objName = constructor === Object || constructor === void 0 ? "" : constructor.name;
			if (objName !== "" && globalThis[objName] === constructor) return this.serializeBuiltInType(objName, object);
			if ("toJSON" in object && typeof object.toJSON === "function") {
				const json = object.toJSON();
				return objName + (json !== null && typeof json === "object" ? this.$object(json) : `(${this.serialize(json)})`);
			}
			const keys = Object.keys(object).sort(compareStrings);
			let content = `${objName}{`;
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				content += `${key}:${this.serialize(object[key])}`;
				if (i < keys.length - 1) content += ",";
			}
			return content + "}";
		}
		serializeBuiltInType(type, object) {
			const handler = this["$" + type];
			if (handler) return handler.call(this, object);
			if (typeof object.entries === "function") return this.serializeObjectEntries(type, object.entries());
			throw new Error(`Cannot serialize ${type}`);
		}
		serializeObjectEntries(type, entries) {
			const sortedEntries = Array.from(entries).sort((a, b) => this.compare(a[0], b[0]));
			let content = `${type}{`;
			for (let i = 0; i < sortedEntries.length; i++) {
				const [key, value] = sortedEntries[i];
				content += `${this.serialize(key, true)}:${this.serialize(value)}`;
				if (i < sortedEntries.length - 1) content += ",";
			}
			return content + "}";
		}
		$object(object) {
			let content = this.#context.get(object);
			if (content === void 0) {
				this.#context.set(object, `#${this.#context.size}`);
				content = this.serializeObject(object);
				this.#context.set(object, content);
			}
			return content;
		}
		$function(fn) {
			const fnStr = Function.prototype.toString.call(fn);
			if (fnStr.slice(-15) === "[native code] }") return `${fn.name || ""}()[native]`;
			return `${fn.name}(${fn.length})${fnStr.replace(/\s*\n\s*/g, "")}`;
		}
		$Array(arr) {
			let content = "[";
			for (let i = 0; i < arr.length; i++) {
				content += this.serialize(arr[i]);
				if (i < arr.length - 1) content += ",";
			}
			return content + "]";
		}
		$Date(date) {
			try {
				return `Date(${date.toISOString()})`;
			} catch {
				return `Date(null)`;
			}
		}
		$ArrayBuffer(arr) {
			return `ArrayBuffer[${new Uint8Array(arr).join(",")}]`;
		}
		$Set(set) {
			return `Set${this.$Array(Array.from(set).sort((a, b) => this.compare(a, b)))}`;
		}
		$Map(map) {
			return this.serializeObjectEntries("Map", map.entries());
		}
	}
	for (const type of [
		"Error",
		"RegExp",
		"URL"
	]) Serializer.prototype["$" + type] = function(val) {
		return `${type}(${val})`;
	};
	for (const type of [
		"Int8Array",
		"Uint8Array",
		"Uint8ClampedArray",
		"Int16Array",
		"Uint16Array",
		"Int32Array",
		"Uint32Array",
		"Float32Array",
		"Float64Array"
	]) Serializer.prototype["$" + type] = function(arr) {
		return `${type}[${arr.join(",")}]`;
	};
	for (const type of ["BigInt64Array", "BigUint64Array"]) Serializer.prototype["$" + type] = function(arr) {
		return `${type}[${arr.join("n,")}${arr.length > 0 ? "n" : ""}]`;
	};
	return Serializer;
})();

const fastHash = /*@__PURE__*/ (() => globalThis.process?.getBuiltinModule?.("crypto")?.hash)();
const algorithm = "sha256";
const encoding = "base64url";
function digest(data) {
	if (fastHash) return fastHash(algorithm, data, encoding);
	const h = createHash(algorithm).update(data);
	return globalThis.process?.versions?.webcontainer ? h.digest().toString(encoding) : h.digest(encoding);
}

function hash$1(input) {
	return digest(serialize$1(input));
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "a2f3bc0f-6e75-4d94-877e-aa565c0eacf0",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/**": {
        "headers": {
          "content-security-policy": "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob:; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline'; connect-src 'self'",
          "cross-origin-opener-policy": "same-origin",
          "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(self)",
          "referrer-policy": "strict-origin-when-cross-origin",
          "strict-transport-security": "max-age=31536000; includeSubDomains",
          "x-content-type-options": "nosniff",
          "x-frame-options": "DENY"
        }
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "stripePublishableKey": "",
    "paypalClientId": "",
    "siteUrl": ""
  },
  "databaseDriver": "sqlite",
  "databasePath": "./db/angel-dreamer.sqlite",
  "mysqlUrl": "",
  "jwtSecret": "",
  "stripeSecretKey": "",
  "stripeWebhookSecret": "",
  "paypalClientSecret": "",
  "adminEmail": "",
  "smtpHost": "",
  "smtpPort": 587,
  "smtpSecure": false,
  "smtpUser": "",
  "smtpPassword": "",
  "emailFrom": "",
  "contactEmail": ""
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

function isPathInScope(pathname, base) {
  let canonical;
  try {
    const pre = pathname.replace(/%2f/gi, "/").replace(/%5c/gi, "\\");
    canonical = new URL(pre, "http://_").pathname;
  } catch {
    return false;
  }
  return !base || canonical === base || canonical.startsWith(base + "/");
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
	
	if (hasReqHeader(event, "accept", "text/html")) {
		return false;
	}
	return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
	const value = getRequestHeader(event, name);
	return !!(value && typeof value === "string" && value.toLowerCase().includes(includes));
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
	if (event.handled || isJsonRequest(event)) {
		
		return;
	}
	
	const defaultRes = await defaultHandler(error, event, { json: true });
	
	const status = error.status || error.statusCode || 500;
	if (status === 404 && defaultRes.status === 302) {
		setResponseHeaders(event, defaultRes.headers);
		setResponseStatus(event, defaultRes.status, defaultRes.statusText);
		return send(event, JSON.stringify(defaultRes.body, null, 2));
	}
	const errorObject = defaultRes.body;
	
	const url = new URL(errorObject.url);
	errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
	
	errorObject.message = error.unhandled ? errorObject.message || "Server Error" : error.message || errorObject.message || "Server Error";
	
	errorObject.data ||= error.data;
	errorObject.statusText ||= error.statusText || error.statusMessage;
	delete defaultRes.headers["content-type"];
	delete defaultRes.headers["content-security-policy"];
	setResponseHeaders(event, defaultRes.headers);
	
	const reqHeaders = getRequestHeaders(event);
	
	const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
	
	const res = isRenderingError ? null : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject), {
		headers: {
			...reqHeaders,
			"x-nuxt-error": "true"
		},
		redirect: "manual"
	}).catch(() => null);
	if (event.handled) {
		return;
	}
	
	if (!res) {
		const { template } = await import('../_/error-500.mjs');
		setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
		return send(event, template(errorObject));
	}
	const html = await res.text();
	for (const [header, value] of res.headers.entries()) {
		if (header === "set-cookie") {
			appendResponseHeader(event, header, value);
			continue;
		}
		setResponseHeader(event, header, value);
	}
	setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
	return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const plugins = [
  
];

const assets = {
  "/favicon.svg": {
    "type": "image/svg+xml",
    "etag": "\"2c8-geBxqJCnEMLdObLLD/aK9EAfyXI\"",
    "mtime": "2026-08-21T18:08:59.697Z",
    "size": 712,
    "path": "../public/favicon.svg"
  },
  "/file.svg": {
    "type": "image/svg+xml",
    "etag": "\"187-+zgO7/6H1QtZc4NmTAKYKWTQ0ow\"",
    "mtime": "2026-08-21T18:08:59.697Z",
    "size": 391,
    "path": "../public/file.svg"
  },
  "/globe.svg": {
    "type": "image/svg+xml",
    "etag": "\"40b-LrojsBpGczu4Qj5tOOv19+lavsU\"",
    "mtime": "2026-08-21T18:08:59.697Z",
    "size": 1035,
    "path": "../public/globe.svg"
  },
  "/window.svg": {
    "type": "image/svg+xml",
    "etag": "\"181-VMSODapsqjF/4bTEGQB/2T6Ujbk\"",
    "mtime": "2026-08-21T18:08:59.698Z",
    "size": 385,
    "path": "../public/window.svg"
  },
  "/_nuxt/242dd-rm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13b1-gSvZD2wOBfsz/KW244kD1QkDUAE\"",
    "mtime": "2026-08-21T18:08:59.690Z",
    "size": 5041,
    "path": "../public/_nuxt/242dd-rm.js"
  },
  "/_nuxt/56OGjXA-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c4-TW9FQ4ut0o+/s4hEwaM0OPyeHIw\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 196,
    "path": "../public/_nuxt/56OGjXA-.js"
  },
  "/_nuxt/6Czbn30x.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14f6-cZsjd70DxBL0QLlMzOJZvGkhOak\"",
    "mtime": "2026-08-21T18:08:59.690Z",
    "size": 5366,
    "path": "../public/_nuxt/6Czbn30x.js"
  },
  "/_nuxt/88q2BA9c.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b1e1-frRTZu/NNJIS2suZR59zsNKtz8k\"",
    "mtime": "2026-08-21T18:08:59.690Z",
    "size": 111073,
    "path": "../public/_nuxt/88q2BA9c.js"
  },
  "/_nuxt/BCu0smun.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b55-ESBs2d9fTGrxgbsmB5KOd+nLA2Q\"",
    "mtime": "2026-08-21T18:08:59.690Z",
    "size": 2901,
    "path": "../public/_nuxt/BCu0smun.js"
  },
  "/_nuxt/BGb3-IIQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"650-gA9k9YYzBxOl9Pvvt/bsvIyWKPc\"",
    "mtime": "2026-08-21T18:08:59.690Z",
    "size": 1616,
    "path": "../public/_nuxt/BGb3-IIQ.js"
  },
  "/_nuxt/BJni9eu_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d96-clt+2d0icmO9+glqg9eiWjuxdNo\"",
    "mtime": "2026-08-21T18:08:59.690Z",
    "size": 3478,
    "path": "../public/_nuxt/BJni9eu_.js"
  },
  "/_nuxt/BMURhW8C.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"753-MSiw5ikVsm9MyzOsPRolwes9n5Q\"",
    "mtime": "2026-08-21T18:08:59.690Z",
    "size": 1875,
    "path": "../public/_nuxt/BMURhW8C.js"
  },
  "/_nuxt/BQJm1Bz4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ecf-NBzb2XvpmU1Ae3mloktHV8AGick\"",
    "mtime": "2026-08-21T18:08:59.690Z",
    "size": 3791,
    "path": "../public/_nuxt/BQJm1Bz4.js"
  },
  "/_nuxt/BXeWMgX2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c0c-H1RtJ4JezuEja/8NjLMyTcgX56I\"",
    "mtime": "2026-08-21T18:08:59.690Z",
    "size": 7180,
    "path": "../public/_nuxt/BXeWMgX2.js"
  },
  "/_nuxt/BahmyY59.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12f-M3yaXPHC/0VjBap0gOxy2xuZ/jo\"",
    "mtime": "2026-08-21T18:08:59.690Z",
    "size": 303,
    "path": "../public/_nuxt/BahmyY59.js"
  },
  "/_nuxt/BfyRTe5E.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"32f65-rqv/thm6Eas1ndJh+k46E6l07+Q\"",
    "mtime": "2026-08-21T18:08:59.690Z",
    "size": 208741,
    "path": "../public/_nuxt/BfyRTe5E.js"
  },
  "/_nuxt/Bw-u00Sy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d4-P4bGh76KayBmHPyJlJyiPIJyiNY\"",
    "mtime": "2026-08-21T18:08:59.690Z",
    "size": 212,
    "path": "../public/_nuxt/Bw-u00Sy.js"
  },
  "/_nuxt/C7B5CVB3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12aa-jqJpLsv+o6Vr+zZvXMzOtpWmppg\"",
    "mtime": "2026-08-21T18:08:59.690Z",
    "size": 4778,
    "path": "../public/_nuxt/C7B5CVB3.js"
  },
  "/_nuxt/C81LlR1w.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fdf-1615Bbx2FhbRsbG0q93Tq8HgDnk\"",
    "mtime": "2026-08-21T18:08:59.690Z",
    "size": 4063,
    "path": "../public/_nuxt/C81LlR1w.js"
  },
  "/_nuxt/CZMp4tvP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"f57-GZUdrfP+Y1F0mEHVd6OZUr6uie0\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 3927,
    "path": "../public/_nuxt/CZMp4tvP.js"
  },
  "/_nuxt/CpgxzNzP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12a0-gFWCkHDRdUHTdOBC2B8rVI2CBfE\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 4768,
    "path": "../public/_nuxt/CpgxzNzP.js"
  },
  "/_nuxt/54RfSQJc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5e818-cXSYB1f5FK6JWPlj4CwAIAEDEbg\"",
    "mtime": "2026-08-21T18:08:59.690Z",
    "size": 387096,
    "path": "../public/_nuxt/54RfSQJc.js"
  },
  "/_nuxt/D2hEZdB0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"64f-QVVtZBpO3oSAEwRz1FeDAymmo44\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 1615,
    "path": "../public/_nuxt/D2hEZdB0.js"
  },
  "/_nuxt/D8CWwZgO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13f-oX/+8MMcOzYY0Tnn4ljZakLSqv0\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 319,
    "path": "../public/_nuxt/D8CWwZgO.js"
  },
  "/_nuxt/DWWt0_3A.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a2f-2M1aPUj3H12w0nHT4vN6DkC9ExQ\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 2607,
    "path": "../public/_nuxt/DWWt0_3A.js"
  },
  "/_nuxt/DbwfU3_V.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a23-yZ4gY66h3LjUP3QwZZRHXEAdr7E\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 6691,
    "path": "../public/_nuxt/DbwfU3_V.js"
  },
  "/_nuxt/DlAUqK2U.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5b-eFCz/UrraTh721pgAl0VxBNR1es\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 91,
    "path": "../public/_nuxt/DlAUqK2U.js"
  },
  "/og.png": {
    "type": "image/png",
    "etag": "\"20a251-S2C3DtDKVqW65nerXqXXfBUPJPc\"",
    "mtime": "2026-08-21T18:08:59.697Z",
    "size": 2138705,
    "path": "../public/og.png"
  },
  "/reference-dark-desktop.png": {
    "type": "image/png",
    "etag": "\"207f65-jH7j4XR6twxypaIBzOES/IfrGHo\"",
    "mtime": "2026-08-21T18:08:59.697Z",
    "size": 2129765,
    "path": "../public/reference-dark-desktop.png"
  },
  "/_nuxt/Drq2wEpa.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2c1-nkGc804OjVp5RhkM3Q1POsLvgVs\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 705,
    "path": "../public/_nuxt/Drq2wEpa.js"
  },
  "/_nuxt/DnzfVysD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a31-XZ4lLtCBVLdO3tRQP2yGY0Gg8EQ\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 2609,
    "path": "../public/_nuxt/DnzfVysD.js"
  },
  "/_nuxt/F6HhYRyA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b9-guUzGmv0nGz49e3cicfv6lKmQPY\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 185,
    "path": "../public/_nuxt/F6HhYRyA.js"
  },
  "/_nuxt/G9C_vimN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"715-qwXJ5PKJCvQbEzMWNLQz7vcK8Go\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 1813,
    "path": "../public/_nuxt/G9C_vimN.js"
  },
  "/_nuxt/GvMtalSr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"13b-eymSBKqDz/XzRVTDd53hgXAGpP0\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 315,
    "path": "../public/_nuxt/GvMtalSr.js"
  },
  "/_nuxt/O-RBMDPk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7ec-Fl49uxcfMKVGGLbCHnmJVv4UEpc\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 2028,
    "path": "../public/_nuxt/O-RBMDPk.js"
  },
  "/_nuxt/StoreHeader.DQm2tIqj.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"57c0-aWhJB/c9NUfbe20WVxeITaUA/xE\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 22464,
    "path": "../public/_nuxt/StoreHeader.DQm2tIqj.css"
  },
  "/_nuxt/TiptapEditor.C6OWyBE3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"8b5-v0krrKJrYKIhRUzK/wXQRoPbpEU\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 2229,
    "path": "../public/_nuxt/TiptapEditor.C6OWyBE3.css"
  },
  "/_nuxt/_slug_.D7qSOqNH.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d-7bauiGXuRmjgq8hwPyhlcjTby7o\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 605,
    "path": "../public/_nuxt/_slug_.D7qSOqNH.css"
  },
  "/_nuxt/_ynnYqgU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c6f-r0XIKx3ts97tm/0IvKhP3ggoKPA\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 3183,
    "path": "../public/_nuxt/_ynnYqgU.js"
  },
  "/_nuxt/admin.CDdvzEfz.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"824b-73NB0tORNPJz/hfvfqwfVw9k4Og\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 33355,
    "path": "../public/_nuxt/admin.CDdvzEfz.css"
  },
  "/_nuxt/catalog.C__dKbKe.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3f9-JAADoms+ru7tdjBsYx5tso/HWRg\"",
    "mtime": "2026-08-21T18:08:59.691Z",
    "size": 1017,
    "path": "../public/_nuxt/catalog.C__dKbKe.css"
  },
  "/_nuxt/compte.CZdVnTjm.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2ee-ScuvuDgZrCSOhImu+HGrOK/+W0o\"",
    "mtime": "2026-08-21T18:08:59.692Z",
    "size": 750,
    "path": "../public/_nuxt/compte.CZdVnTjm.css"
  },
  "/_nuxt/contact.CbkH1ibM.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e-uqrk6oMZjqpmFCrjla3UKjzl618\"",
    "mtime": "2026-08-21T18:08:59.692Z",
    "size": 30,
    "path": "../public/_nuxt/contact.CbkH1ibM.css"
  },
  "/_nuxt/copy.CN-86aZa.png": {
    "type": "image/png",
    "etag": "\"2e8a-mc5Mq9VQFNyPi9cqFnoA/jNpBfE\"",
    "mtime": "2026-08-21T18:08:59.692Z",
    "size": 11914,
    "path": "../public/_nuxt/copy.CN-86aZa.png"
  },
  "/_nuxt/engagement-icons.CxxGKOQY.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"626-bxx+60zup+I9FZ8nQmmwzlId5kg\"",
    "mtime": "2026-08-21T18:08:59.692Z",
    "size": 1574,
    "path": "../public/_nuxt/engagement-icons.CxxGKOQY.css"
  },
  "/_nuxt/error-404._yXoGkXB.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"97e-UvhxUpGzrIO+HDYB4qU9Txgu35A\"",
    "mtime": "2026-08-21T18:08:59.692Z",
    "size": 2430,
    "path": "../public/_nuxt/error-404._yXoGkXB.css"
  },
  "/reference-light-desktop.png": {
    "type": "image/png",
    "etag": "\"205a5e-cXFKl6pJcX+kGx1veYmGwQNK6m4\"",
    "mtime": "2026-08-21T18:08:59.697Z",
    "size": 2120286,
    "path": "../public/reference-light-desktop.png"
  },
  "/_nuxt/error-500.BENb_mjk.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"773-BFLUend+w1t3SP3QDB+Z0A0V5pI\"",
    "mtime": "2026-08-21T18:08:59.692Z",
    "size": 1907,
    "path": "../public/_nuxt/error-500.BENb_mjk.css"
  },
  "/_nuxt/eyfVBseR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d2-NfgIWMVD0zgikdvcBaYu0XkjueE\"",
    "mtime": "2026-08-21T18:08:59.692Z",
    "size": 210,
    "path": "../public/_nuxt/eyfVBseR.js"
  },
  "/_nuxt/facebook.C8eXrwbB.png": {
    "type": "image/png",
    "etag": "\"1154-WSY5Ye0jmda5GsCQiXjH04LQzZo\"",
    "mtime": "2026-08-21T18:08:59.692Z",
    "size": 4436,
    "path": "../public/_nuxt/facebook.C8eXrwbB.png"
  },
  "/_nuxt/image.CiSJumt6.png": {
    "type": "image/png",
    "etag": "\"21e7-eE4er82XIa2Xjzwa/tU3vvGSJH0\"",
    "mtime": "2026-08-21T18:08:59.692Z",
    "size": 8679,
    "path": "../public/_nuxt/image.CiSJumt6.png"
  },
  "/_nuxt/index.Cm35zsVW.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"26-pHsclzDnqljzPibf1wipQcR8j5s\"",
    "mtime": "2026-08-21T18:08:59.692Z",
    "size": 38,
    "path": "../public/_nuxt/index.Cm35zsVW.css"
  },
  "/_nuxt/instagram.D-uA-gcM.png": {
    "type": "image/png",
    "etag": "\"3be9-r3g0AGWuywY7tNhk8YWu2TVgMIY\"",
    "mtime": "2026-08-21T18:08:59.692Z",
    "size": 15337,
    "path": "../public/_nuxt/instagram.D-uA-gcM.png"
  },
  "/_nuxt/mot-de-passe-oublie.D1Yr_MaY.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b9-l9e9fzzEA2ekppsTLYyxp0MxQqc\"",
    "mtime": "2026-08-21T18:08:59.692Z",
    "size": 185,
    "path": "../public/_nuxt/mot-de-passe-oublie.D1Yr_MaY.css"
  },
  "/_nuxt/shopping-cart-white.YPYW-bs1.png": {
    "type": "image/png",
    "etag": "\"2032-Q31ckFM13yDNz1XvLpWbVo4907E\"",
    "mtime": "2026-08-21T18:08:59.692Z",
    "size": 8242,
    "path": "../public/_nuxt/shopping-cart-white.YPYW-bs1.png"
  },
  "/_nuxt/trash.Dou1gWBt.png": {
    "type": "image/png",
    "etag": "\"2205-7ETDUuYnwFnU0YY2mqoO4BhpRlU\"",
    "mtime": "2026-08-21T18:08:59.692Z",
    "size": 8709,
    "path": "../public/_nuxt/trash.Dou1gWBt.png"
  },
  "/_nuxt/whatsapp.COYr-lUP.png": {
    "type": "image/png",
    "etag": "\"3f63-5ICE1zziBVV/lUEUG9xMtjhuGfs\"",
    "mtime": "2026-08-21T18:08:59.692Z",
    "size": 16227,
    "path": "../public/_nuxt/whatsapp.COYr-lUP.png"
  },
  "/_nuxt/x.B2tJsFmU.png": {
    "type": "image/png",
    "etag": "\"14ed-HeYKbAN2maYtvOtfCQODGOsHBMI\"",
    "mtime": "2026-08-21T18:08:59.692Z",
    "size": 5357,
    "path": "../public/_nuxt/x.B2tJsFmU.png"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-ce6NtMze/htMFVP6dISCWUdhJ74\"",
    "mtime": "2026-08-21T18:08:59.669Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/_nuxt/builds/meta/a2f3bc0f-6e75-4d94-877e-aa565c0eacf0.json": {
    "type": "application/json",
    "etag": "\"58-npRhOVogF2VXQyR8cAj7SCSs+80\"",
    "mtime": "2026-08-21T18:08:59.665Z",
    "size": 88,
    "path": "../public/_nuxt/builds/meta/a2f3bc0f-6e75-4d94-877e-aa565c0eacf0.json"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_nuxt/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _AQnCs1 = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const imageContentKeys = ["heroImage", "value1Image", "value2Image", "value3Image", "workshopImage", "seoOgImage", "seoProductOgImage"];
const defaultSiteContent = {
  announcement: "\u{1F1EB}\u{1F1F7} Imprim\xE9 en France \xB7 Livraison d\xE8s 3,90 \u20AC",
  paymentLabel: "Paiement s\xE9curis\xE9",
  logoText: "ANGEL DREAMER",
  navNew: "Nouveaut\xE9s",
  navClothes: "V\xEAtements",
  navHome: "Maison & d\xE9co",
  heroTitle: "DES OBJETS QUI VOUS RESSEMBLENT.",
  heroSubtitle: "Imprim\xE9s \xE0 la demande dans notre atelier en France.",
  heroCta: "D\xE9couvrir la collection",
  heroImage: null,
  value1: "Imprim\xE9 en France",
  value1Image: null,
  value2: "\xC0 la demande",
  value2Image: null,
  value3: "Encres \xE0 base d\u2019eau",
  value3Image: null,
  universesEyebrow: "EXPLOREZ",
  universesTitle: "Nos univers",
  favoritesEyebrow: "S\xC9LECTION",
  favoritesTitle: "Les favoris du moment",
  workshopEyebrow: "NOTRE SAVOIR-FAIRE",
  workshopTitle: "Un atelier en France",
  workshopText: "Chaque commande est imprim\xE9e avec soin, uniquement pour vous.",
  workshopImage: null,
  categoryEyebrow: "COLLECTION",
  categoryDescription: "D\xE9couvrez tous les produits disponibles dans cette cat\xE9gorie.",
  categoryEmptyText: "Aucun produit n\u2019est encore disponible dans cette cat\xE9gorie.",
  universeEyebrow: "UNIVERS",
  universeAllLabel: "Tout",
  universeEmptyText: "Aucun produit ne correspond \xE0 ce filtre dans cet univers.",
  footerBrand: "ANGEL DREAMER.",
  footerText: "Objets d\u2019art du quotidien \xB7 \xA9 2026",
  seoSiteName: "Angel Dreamer",
  seoTitle: "Angel Dreamer \u2014 Objets imprim\xE9s en France",
  seoTitleTemplate: "",
  seoDescription: "Objets physiques originaux, imprim\xE9s \xE0 la demande en France.",
  seoKeywords: "objets imprim\xE9s, d\xE9coration, v\xEAtements, fabrication fran\xE7aise",
  seoCanonicalUrl: "",
  seoRobots: "index, follow, max-image-preview:large",
  seoAuthor: "Angel Dreamer",
  seoLanguage: "fr",
  seoThemeColor: "#ef402d",
  seoGoogleVerification: "",
  seoBingVerification: "",
  seoOgTitle: "Angel Dreamer \u2014 Des objets qui vous ressemblent",
  seoOgDescription: "D\xE9couvrez des objets originaux imprim\xE9s \xE0 la demande dans notre atelier en France.",
  seoOgType: "website",
  seoOgLocale: "fr_FR",
  seoOgImage: null,
  seoTwitterCard: "summary_large_image",
  seoTwitterSite: "",
  seoTwitterCreator: "",
  seoTwitterTitle: "Angel Dreamer \u2014 Des objets qui vous ressemblent",
  seoTwitterDescription: "Objets originaux imprim\xE9s \xE0 la demande en France.",
  seoOrganizationName: "Angel Dreamer",
  seoOrganizationLegalName: "",
  seoOrganizationUrl: "",
  seoOrganizationEmail: "",
  seoOrganizationPhone: "",
  seoOrganizationCountry: "FR",
  seoProductTitle: "[Nom du produit] \xB7 [Nom du site]",
  seoProductDescription: "[Description du produit] Disponible \xE0 [Prix] sur [Nom du site].",
  seoProductOgTitle: "[Nom du produit] \xB7 [Nom du site]",
  seoProductOgDescription: "[Description du produit]",
  seoProductImageMode: "product",
  seoProductOgImage: null,
  seoUniverseTitle: "[Nom de l\u2019univers] \xB7 [Nom du site]",
  seoUniverseDescription: "D\xE9couvrez les produits de l\u2019univers [Nom de l\u2019univers] sur [Nom du site].",
  seoUniverseOgTitle: "[Nom de l\u2019univers] \xB7 [Nom du site]",
  seoUniverseOgDescription: "Explorez notre s\xE9lection [Nom de l\u2019univers].",
  seoCategoryTitle: "[Nom de la cat\xE9gorie] \xB7 [Nom du site]",
  seoCategoryDescription: "D\xE9couvrez tous nos produits [Nom de la cat\xE9gorie] sur [Nom du site].",
  seoCategoryOgTitle: "[Nom de la cat\xE9gorie] \xB7 [Nom du site]",
  seoCategoryOgDescription: "D\xE9couvrez notre s\xE9lection [Nom de la cat\xE9gorie].",
  seoUniverseCategoryTitle: "[Nom de la cat\xE9gorie] \u2014 [Nom de l\u2019univers] \xB7 [Nom du site]",
  seoUniverseCategoryDescription: "D\xE9couvrez les produits [Nom de la cat\xE9gorie] de l\u2019univers [Nom de l\u2019univers] sur [Nom du site].",
  seoUniverseCategoryOgTitle: "[Nom de la cat\xE9gorie] \u2014 [Nom de l\u2019univers]",
  seoUniverseCategoryOgDescription: "Explorez notre s\xE9lection [Nom de la cat\xE9gorie] dans l\u2019univers [Nom de l\u2019univers].",
  seoCartTitle: "Votre panier | [Nom du site]",
  seoProfileTitle: "Mon compte | [Nom du site]",
  cguContent: "",
  cgvContent: "",
  contactEmail: ""
};

let connection;
let connectionPath = "";
let mysqlPool;
let mysqlUrl = "";
const defaults = [
  ["t-shirt-horizon", "T-shirt Horizon", "Un t-shirt en coton doux illustr\xE9 d\u2019une vague japonaise et d\u2019un soleil vermillon.", 2990, "V\xEAtements", 1],
  ["mug-visage", "Mug Visage", "Mug en c\xE9ramique imprim\xE9 en France, finition brillante et motif abstrait.", 1490, "Maison & d\xE9co", 1],
  ["tote-ascension", "Tote bag Ascension", "Sac en toile naturelle \xE9paisse, imprim\xE9 \xE0 la demande avec des encres \xE0 l\u2019eau.", 1990, "Accessoires", 1],
  ["coussin-bauhaus", "Coussin Bauhaus", "Housse de coussin en toile textur\xE9e aux formes g\xE9om\xE9triques iconiques.", 2490, "Maison & d\xE9co", 1]
];
function database(event) {
  const config = useRuntimeConfig(event);
  const driver = String(config.databaseDriver || (config.mysqlUrl ? "mysql" : "sqlite")).toLowerCase();
  if (driver === "mysql") {
    const url = String(config.mysqlUrl || "");
    if (!url) throw createError$1({ statusCode: 503, statusMessage: "Connexion MySQL non configur\xE9e" });
    if (!mysqlPool || mysqlUrl !== url) {
      mysqlPool = mysql.createPool({ uri: url, connectionLimit: 10, enableKeepAlive: true, charset: "utf8mb4" });
      mysqlUrl = url;
    }
    const pool = mysqlPool;
    const normalizeSql = (sql) => sql.replace(/^INSERT OR IGNORE /i, "INSERT IGNORE ").replace(/ ON CONFLICT\(key\) DO UPDATE SET value=excluded\.value$/i, " ON DUPLICATE KEY UPDATE value=VALUES(value)").replace(/ ON CONFLICT\(key\) DO UPDATE SET image_id=excluded\.image_id$/i, " ON DUPLICATE KEY UPDATE image_id=VALUES(image_id)").replace(/ ON CONFLICT\(email\) DO UPDATE SET password_hash=excluded\.password_hash,role='admin',active=1,must_change_password=1$/i, " ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash),role='admin',active=1,must_change_password=1");
    const wrap2 = (sql, values = []) => ({
      sql,
      values,
      bind: (...next) => wrap2(sql, next),
      all: async () => {
        const [rows] = await pool.execute(normalizeSql(sql), values.map((value) => value === void 0 ? null : value));
        return { results: rows };
      },
      first: async () => {
        var _a;
        const [rows] = await pool.execute(normalizeSql(sql), values.map((value) => value === void 0 ? null : value));
        return (_a = rows[0]) != null ? _a : null;
      },
      run: async () => {
        var _a, _b;
        const [result] = await pool.execute(normalizeSql(sql), values.map((value) => value === void 0 ? null : value));
        const packet = result;
        return { lastInsertRowid: (_a = packet.insertId) != null ? _a : 0, changes: (_b = packet.affectedRows) != null ? _b : 0 };
      },
      runSync: () => {
        throw new Error("runSync est r\xE9serv\xE9 \xE0 SQLite");
      }
    });
    return {
      dialect: "mysql",
      prepare: wrap2,
      batch: async (statements) => {
        const connection2 = await pool.getConnection();
        try {
          await connection2.beginTransaction();
          for (const statement of statements) await connection2.execute(normalizeSql(statement.sql), statement.values.map((value) => value === void 0 ? null : value));
          await connection2.commit();
        } catch (error) {
          await connection2.rollback();
          throw error;
        } finally {
          connection2.release();
        }
      }
    };
  }
  if (driver !== "sqlite") throw createError$1({ statusCode: 503, statusMessage: "Moteur de base de donn\xE9es invalide" });
  const configured = String(config.databasePath || "./data/angel-dreamer.sqlite");
  const path = configured === ":memory:" ? configured : resolve$1(process.cwd(), configured);
  if (!connection || connectionPath !== path) {
    if (path !== ":memory:") mkdirSync(dirname$1(path), { recursive: true });
    connection == null ? void 0 : connection.close();
    connection = new BetterSqlite3(path);
    connectionPath = path;
    connection.pragma("journal_mode = WAL");
    connection.pragma("foreign_keys = ON");
  }
  const native = connection;
  const wrap = (sql, values = []) => ({
    sql,
    values,
    bind: (...next) => wrap(sql, next),
    all: async () => ({ results: native.prepare(sql).all(...values) }),
    first: async () => {
      var _a;
      return (_a = native.prepare(sql).get(...values)) != null ? _a : null;
    },
    run: async () => native.prepare(sql).run(...values),
    runSync: () => native.prepare(sql).run(...values)
  });
  return {
    dialect: "sqlite",
    prepare: wrap,
    batch: async (statements) => native.transaction((items) => items.map((item) => item.runSync()))(statements)
  };
}
async function ready(db) {
  if (db.dialect === "mysql") return readyMySql(db);
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL, mime_type TEXT NOT NULL, width INTEGER NOT NULL, height INTEGER NOT NULL, natural_width INTEGER NOT NULL, natural_height INTEGER NOT NULL, dark_image_id INTEGER REFERENCES images(id) ON DELETE SET NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS site_content (`key` TEXT PRIMARY KEY, value TEXT NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS site_content_images (`key` TEXT PRIMARY KEY, image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE)"),
    db.prepare("CREATE TABLE IF NOT EXISTS universes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, slug TEXT, image_id INTEGER REFERENCES images(id) ON DELETE SET NULL, position INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1)"),
    db.prepare("CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, position INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1)"),
    db.prepare("CREATE TABLE IF NOT EXISTS product_categories (product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE, category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE, PRIMARY KEY(product_id,category_id))"),
    db.prepare("CREATE TABLE IF NOT EXISTS product_universes (product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE, universe_id INTEGER NOT NULL REFERENCES universes(id) ON DELETE CASCADE, PRIMARY KEY(product_id,universe_id))"),
    db.prepare("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, first_name TEXT, last_name TEXT, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'customer', active INTEGER NOT NULL DEFAULT 1, must_change_password INTEGER NOT NULL DEFAULT 0, created_by_admin_id INTEGER REFERENCES users(id) ON DELETE SET NULL, created_at TEXT NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS password_reset_codes (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, code_hash TEXT NOT NULL, purpose TEXT NOT NULL, expires_at TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, used_at TEXT, created_at TEXT NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, provider TEXT NOT NULL, provider_order_id TEXT NOT NULL, amount_cents INTEGER NOT NULL, status TEXT NOT NULL, customer_email TEXT, created_at TEXT NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS discounts (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT NOT NULL, type TEXT NOT NULL, value INTEGER NOT NULL, active INTEGER NOT NULL DEFAULT 1, starts_at TEXT, ends_at TEXT, created_at TEXT NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS discount_rules (id INTEGER PRIMARY KEY AUTOINCREMENT, discount_id INTEGER NOT NULL REFERENCES discounts(id) ON DELETE CASCADE, scope TEXT NOT NULL, target_id INTEGER NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS promo_codes (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL UNIQUE, active INTEGER NOT NULL DEFAULT 1, starts_at TEXT, ends_at TEXT, created_at TEXT NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS promo_code_rules (id INTEGER PRIMARY KEY AUTOINCREMENT, promo_code_id INTEGER NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE, scope TEXT NOT NULL, target_id INTEGER, type TEXT NOT NULL, value INTEGER NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS contact_attachments (id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT NOT NULL, mimetype TEXT NOT NULL, size INTEGER NOT NULL, data BLOB NOT NULL, created_at INTEGER NOT NULL DEFAULT (unixepoch()))")
  ]);
  const { results: imageColumns } = await db.prepare("PRAGMA table_info(images)").all();
  if (!imageColumns.some((column) => column.name === "dark_image_id")) await db.prepare("ALTER TABLE images ADD COLUMN dark_image_id INTEGER REFERENCES images(id) ON DELETE SET NULL").run();
  const { results: universeColumns } = await db.prepare("PRAGMA table_info(universes)").all();
  if (!universeColumns.some((column) => column.name === "slug")) await db.prepare("ALTER TABLE universes ADD COLUMN slug TEXT").run();
  const { results: productColumns } = await db.prepare("PRAGMA table_info(products)").all();
  if (!productColumns.length) {
    await db.prepare("CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, description TEXT NOT NULL, price_cents INTEGER NOT NULL, image_id INTEGER REFERENCES images(id) ON DELETE SET NULL, category TEXT NOT NULL, featured INTEGER NOT NULL DEFAULT 0, featured_position INTEGER, active INTEGER NOT NULL DEFAULT 1)").run();
  } else if (!productColumns.some((column) => column.name === "image_id")) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await db.prepare("INSERT INTO images(content,mime_type,width,height,natural_width,natural_height,created_at,updated_at) SELECT DISTINCT image_url,CASE WHEN image_url LIKE 'data:image/%' THEN substr(image_url,6,instr(image_url,';')-6) ELSE 'image/unknown' END,1,1,1,1,?,? FROM products WHERE image_url<>''").bind(now, now).run();
    await db.batch([
      db.prepare("ALTER TABLE products RENAME TO products_legacy_images"),
      db.prepare("CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, description TEXT NOT NULL, price_cents INTEGER NOT NULL, image_id INTEGER REFERENCES images(id) ON DELETE SET NULL, category TEXT NOT NULL, featured INTEGER NOT NULL DEFAULT 0, featured_position INTEGER, active INTEGER NOT NULL DEFAULT 1)"),
      db.prepare("INSERT INTO products(id,slug,name,description,price_cents,image_id,category,featured,active) SELECT p.id,p.slug,p.name,p.description,p.price_cents,(SELECT i.id FROM images i WHERE i.content=p.image_url LIMIT 1),p.category,p.featured,p.active FROM products_legacy_images p"),
      db.prepare("DROP TABLE products_legacy_images")
    ]);
  }
  const { results: currentProductColumns } = await db.prepare("PRAGMA table_info(products)").all();
  if (!currentProductColumns.some((column) => column.name === "featured_position")) await db.prepare("ALTER TABLE products ADD COLUMN featured_position INTEGER").run();
  await db.batch([
    db.prepare("CREATE INDEX IF NOT EXISTS idx_images_dark_image_id ON images(dark_image_id)"),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_products_active_featured ON products(active,featured)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_products_image_id ON products(image_id)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_site_content_images_image_id ON site_content_images(image_id)"),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_universes_slug ON universes(slug) WHERE slug IS NOT NULL AND slug<>''"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_universes_position ON universes(position)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_universes_image_id ON universes(image_id)"),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_categories_position ON categories(position)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_product_categories_category ON product_categories(category_id,product_id)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_product_universes_universe ON product_universes(universe_id,product_id)"),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_provider_id ON orders(provider,provider_order_id)"),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_password_reset_user_created ON password_reset_codes(user_id,created_at)")
  ]);
  const { results: userColumns } = await db.prepare("PRAGMA table_info(users)").all();
  const userNames = new Set(userColumns.map((column) => column.name));
  if (!userNames.has("first_name")) await db.prepare("ALTER TABLE users ADD COLUMN first_name TEXT").run();
  if (!userNames.has("last_name")) await db.prepare("ALTER TABLE users ADD COLUMN last_name TEXT").run();
  if (!userNames.has("created_by_admin_id")) await db.prepare("ALTER TABLE users ADD COLUMN created_by_admin_id INTEGER REFERENCES users(id) ON DELETE SET NULL").run();
  for (const key of imageContentKeys) {
    const legacy = await db.prepare("SELECT value FROM site_content WHERE `key`=?").bind(key).first();
    if (legacy == null ? void 0 : legacy.value) {
      const imageId = await persistImage(db, {
        id: 0,
        content: legacy.value,
        mimeType: mimeFromContent(legacy.value),
        width: 1,
        naturalWidth: 1,
        naturalHeight: 1
      });
      if (imageId) await db.prepare("INSERT OR IGNORE INTO site_content_images(`key`,image_id) VALUES(?,?)").bind(key, imageId).run();
    }
    await db.prepare("DELETE FROM site_content WHERE `key`=?").bind(key).run();
  }
  const universeCount = await db.prepare("SELECT COUNT(*) total FROM universes").first();
  if (!(universeCount == null ? void 0 : universeCount.total)) {
    const titles = ["Art & design", "Manga & Japon", "Cin\xE9ma & musique", "Humour"];
    for (let index = 1; index <= 4; index++) {
      const title = await db.prepare("SELECT value FROM site_content WHERE `key`=?").bind(`universe${index}Title`).first();
      const linked = await db.prepare("SELECT image_id FROM site_content_images WHERE `key`=?").bind(`universe${index}Image`).first();
      await db.prepare("INSERT INTO universes(title,image_id,position,active) VALUES(?,?,?,1)").bind((title == null ? void 0 : title.value) || titles[index - 1], (linked == null ? void 0 : linked.image_id) || null, index - 1).run();
    }
  }
  for (let index = 1; index <= 4; index++) {
    await db.prepare("DELETE FROM site_content WHERE `key`=?").bind(`universe${index}Title`).run();
    await db.prepare("DELETE FROM site_content_images WHERE `key`=?").bind(`universe${index}Image`).run();
  }
  const count = await db.prepare("SELECT COUNT(*) AS total FROM products").first();
  if (!(count == null ? void 0 : count.total)) await db.batch(defaults.map((p) => db.prepare("INSERT INTO products(slug,name,description,price_cents,image_id,category,featured,active) VALUES(?,?,?,?,NULL,?,?,1)").bind(...p)));
  const categoryCount = await db.prepare("SELECT COUNT(*) total FROM categories").first();
  if (!(categoryCount == null ? void 0 : categoryCount.total)) {
    const seeds = [["Nouveaut\xE9s", "nouveautes"], ["V\xEAtements", "vetements"], ["Maison & d\xE9co", "maison-deco"]];
    for (const [index, item] of seeds.entries()) await db.prepare("INSERT INTO categories(label,slug,position,active) VALUES(?,?,?,1)").bind(item[0], item[1], index).run();
  }
  const linkedCategories = await db.prepare("SELECT COUNT(*) total FROM product_categories").first();
  if (!(linkedCategories == null ? void 0 : linkedCategories.total)) {
    const fallback = await db.prepare("SELECT id FROM categories WHERE slug='nouveautes'").first();
    if (fallback) await db.prepare("INSERT OR IGNORE INTO product_categories(product_id,category_id) SELECT id,? FROM products").bind(fallback.id).run();
  }
  const linkedUniverses = await db.prepare("SELECT COUNT(*) total FROM product_universes").first();
  if (!(linkedUniverses == null ? void 0 : linkedUniverses.total)) {
    const fallback = await db.prepare("SELECT id FROM universes ORDER BY position,id LIMIT 1").first();
    if (fallback) await db.prepare("INSERT OR IGNORE INTO product_universes(product_id,universe_id) SELECT id,? FROM products").bind(fallback.id).run();
  }
  const textDefaults = Object.entries(defaultSiteContent).filter(([key]) => !imageContentKeys.includes(key));
  await db.batch(textDefaults.map(([key, value]) => db.prepare("INSERT OR IGNORE INTO site_content(`key`,value) VALUES(?,?)").bind(key, String(value))));
}
let mysqlReady;
function readyMySql(db) {
  mysqlReady || (mysqlReady = initializeMySql(db).catch((error) => {
    mysqlReady = void 0;
    throw error;
  }));
  return mysqlReady;
}
async function initializeMySql(db) {
  const statements = [
    `CREATE TABLE IF NOT EXISTS images (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            content LONGTEXT NOT NULL,
            mime_type VARCHAR(64) NOT NULL,
            width INT UNSIGNED NOT NULL,
            height INT UNSIGNED NOT NULL,
            natural_width INT UNSIGNED NOT NULL,
            natural_height INT UNSIGNED NOT NULL,
            dark_image_id INT UNSIGNED NULL,
            created_at VARCHAR(32) NOT NULL,
            updated_at VARCHAR(32) NOT NULL,
            INDEX idx_images_dark_image_id (dark_image_id),
            CONSTRAINT fk_images_dark_image FOREIGN KEY (dark_image_id) REFERENCES images(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS products (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            slug VARCHAR(191) NOT NULL UNIQUE,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price_cents INT UNSIGNED NOT NULL,
            image_id INT UNSIGNED NULL,
            category VARCHAR(191) NOT NULL DEFAULT '',
            featured TINYINT(1) NOT NULL DEFAULT 0,
            featured_position INT NULL,
            active TINYINT(1) NOT NULL DEFAULT 1,
            INDEX idx_products_active_featured (active,featured),
            INDEX idx_products_image_id (image_id),
            CONSTRAINT fk_products_image FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS site_content (
            \`key\` VARCHAR(191) NOT NULL PRIMARY KEY,
            value TEXT NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS universes (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(191) NULL UNIQUE,
            image_id INT UNSIGNED NULL,
            position INT NOT NULL DEFAULT 0,
            active TINYINT(1) NOT NULL DEFAULT 1,
            INDEX idx_universes_position (position),
            INDEX idx_universes_image_id (image_id),
            CONSTRAINT fk_universes_image FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS categories (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            label VARCHAR(255) NOT NULL,
            slug VARCHAR(191) NOT NULL UNIQUE,
            position INT NOT NULL DEFAULT 0,
            active TINYINT(1) NOT NULL DEFAULT 1,
            INDEX idx_categories_position (position)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS site_content_images (
            \`key\` VARCHAR(191) NOT NULL PRIMARY KEY,
            image_id INT UNSIGNED NOT NULL,
            INDEX idx_site_content_images_image_id (image_id),
            CONSTRAINT fk_site_content_images_image FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS product_categories (
            product_id INT UNSIGNED NOT NULL,
            category_id INT UNSIGNED NOT NULL,
            PRIMARY KEY(product_id,category_id),
            INDEX idx_product_categories_category (category_id,product_id),
            CONSTRAINT fk_product_categories_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            CONSTRAINT fk_product_categories_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS product_universes (
            product_id INT UNSIGNED NOT NULL,
            universe_id INT UNSIGNED NOT NULL,
            PRIMARY KEY(product_id,universe_id),
            INDEX idx_product_universes_universe (universe_id,product_id),
            CONSTRAINT fk_product_universes_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            CONSTRAINT fk_product_universes_universe FOREIGN KEY (universe_id) REFERENCES universes(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS users (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(191) NOT NULL UNIQUE,
            first_name VARCHAR(80) NULL,
            last_name VARCHAR(80) NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(32) NOT NULL DEFAULT 'customer',
            active TINYINT(1) NOT NULL DEFAULT 1,
            must_change_password TINYINT(1) NOT NULL DEFAULT 0,
            created_by_admin_id INT UNSIGNED NULL,
            created_at VARCHAR(32) NOT NULL,
            CONSTRAINT fk_users_created_by_admin FOREIGN KEY (created_by_admin_id) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS password_reset_codes (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED NOT NULL,
            code_hash VARCHAR(255) NOT NULL,
            purpose VARCHAR(32) NOT NULL,
            expires_at VARCHAR(32) NOT NULL,
            attempts INT UNSIGNED NOT NULL DEFAULT 0,
            used_at VARCHAR(32) NULL,
            created_at VARCHAR(32) NOT NULL,
            INDEX idx_password_reset_user_created (user_id,created_at),
            CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS orders (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            provider VARCHAR(32) NOT NULL,
            provider_order_id VARCHAR(191) NOT NULL,
            amount_cents INT UNSIGNED NOT NULL,
            status VARCHAR(64) NOT NULL,
            customer_email VARCHAR(191) NULL,
            created_at VARCHAR(32) NOT NULL,
            UNIQUE KEY idx_orders_provider_id (provider,provider_order_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS discounts (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            label VARCHAR(255) NOT NULL,
            type VARCHAR(16) NOT NULL,
            value INT UNSIGNED NOT NULL,
            active TINYINT(1) NOT NULL DEFAULT 1,
            starts_at VARCHAR(32) NULL,
            ends_at VARCHAR(32) NULL,
            created_at VARCHAR(32) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS discount_rules (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            discount_id INT UNSIGNED NOT NULL,
            scope VARCHAR(16) NOT NULL,
            target_id INT UNSIGNED NOT NULL,
            CONSTRAINT fk_discount_rules_discount FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS promo_codes (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            code VARCHAR(64) NOT NULL UNIQUE,
            active TINYINT(1) NOT NULL DEFAULT 1,
            starts_at VARCHAR(32) NULL,
            ends_at VARCHAR(32) NULL,
            created_at VARCHAR(32) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS promo_code_rules (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            promo_code_id INT UNSIGNED NOT NULL,
            scope VARCHAR(16) NOT NULL,
            target_id INT UNSIGNED NULL,
            type VARCHAR(16) NOT NULL,
            value INT UNSIGNED NOT NULL,
            CONSTRAINT fk_promo_code_rules_code FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS contact_attachments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            mimetype VARCHAR(100) NOT NULL,
            size INT NOT NULL,
            data LONGBLOB NOT NULL,
            created_at INT NOT NULL DEFAULT (UNIX_TIMESTAMP())
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  ];
  for (const sql of statements) await db.prepare(sql).run();
  const creatorColumn = await db.prepare("SELECT COUNT(*) total FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='users' AND COLUMN_NAME='created_by_admin_id'").first();
  if (!Number(creatorColumn == null ? void 0 : creatorColumn.total)) await db.prepare("ALTER TABLE users ADD COLUMN created_by_admin_id INT UNSIGNED NULL, ADD CONSTRAINT fk_users_created_by_admin FOREIGN KEY (created_by_admin_id) REFERENCES users(id) ON DELETE SET NULL").run();
  const productCount = await db.prepare("SELECT COUNT(*) total FROM products").first();
  if (!Number(productCount == null ? void 0 : productCount.total)) for (const product of defaults) await db.prepare("INSERT INTO products(slug,name,description,price_cents,image_id,category,featured,active) VALUES(?,?,?,?,NULL,?,?,1)").bind(...product).run();
  const universeCount = await db.prepare("SELECT COUNT(*) total FROM universes").first();
  if (!Number(universeCount == null ? void 0 : universeCount.total)) for (const [position, title] of ["Art & design", "Manga & Japon", "Cin\xE9ma & musique", "Humour"].entries()) await db.prepare("INSERT INTO universes(title,position,active) VALUES(?,?,1)").bind(title, position).run();
  const categoryCount = await db.prepare("SELECT COUNT(*) total FROM categories").first();
  if (!Number(categoryCount == null ? void 0 : categoryCount.total)) for (const [position, category] of [["Nouveaut\xE9s", "nouveautes"], ["V\xEAtements", "vetements"], ["Maison & d\xE9co", "maison-deco"]].entries()) await db.prepare("INSERT INTO categories(label,slug,position,active) VALUES(?,?,?,1)").bind(category[0], category[1], position).run();
  const novelty = await db.prepare("SELECT id FROM categories WHERE slug='nouveautes'").first();
  if (novelty) await db.prepare("INSERT IGNORE INTO product_categories(product_id,category_id) SELECT id,? FROM products").bind(novelty.id).run();
  const firstUniverse = await db.prepare("SELECT id FROM universes ORDER BY position,id LIMIT 1").first();
  if (firstUniverse) await db.prepare("INSERT IGNORE INTO product_universes(product_id,universe_id) SELECT id,? FROM products").bind(firstUniverse.id).run();
  const textDefaults = Object.entries(defaultSiteContent).filter(([key]) => !imageContentKeys.includes(key));
  for (const [key, value] of textDefaults) await db.prepare("INSERT IGNORE INTO site_content(`key`,value) VALUES(?,?)").bind(key, String(value)).run();
}
function mimeFromContent(content) {
  const match = /^data:(image\/[\w.+-]+);/.exec(content);
  return (match == null ? void 0 : match[1]) || "image/unknown";
}
function mapImage(row, prefix = "image") {
  const id = Number(row[`${prefix}_id`]);
  if (!id) return null;
  const image = {
    id,
    content: `/images/${id}`,
    mimeType: String(row[`${prefix}_mime_type`]),
    width: Number(row[`${prefix}_width`]),
    height: Number(row[`${prefix}_height`]),
    naturalWidth: Number(row[`${prefix}_natural_width`]),
    naturalHeight: Number(row[`${prefix}_natural_height`])
  };
  const darkId = Number(row[`${prefix}_dark_id`]);
  if (darkId) image.darkVariant = {
    id: darkId,
    content: `/images/${darkId}`,
    mimeType: String(row[`${prefix}_dark_mime_type`]),
    width: image.width,
    height: image.height,
    naturalWidth: Number(row[`${prefix}_dark_natural_width`]),
    naturalHeight: Number(row[`${prefix}_dark_natural_height`]),
    darkVariant: null
  };
  else image.darkVariant = null;
  return image;
}
async function persistImage(db, input) {
  if (!input) return null;
  const content = String(input.content || "");
  if (!content) return null;
  if (content.length > 3e6) throw createError$1({ statusCode: 413, statusMessage: "Image trop volumineuse" });
  const naturalWidth = Math.max(1, Math.round(Number(input.naturalWidth) || 1));
  const naturalHeight = Math.max(1, Math.round(Number(input.naturalHeight) || 1));
  const width = Math.max(1, Math.round(Number(input.width) || naturalWidth));
  const height = Math.max(1, Math.round(width * naturalHeight / naturalWidth));
  const mimeType = String(input.mimeType || mimeFromContent(content));
  const now = (/* @__PURE__ */ new Date()).toISOString();
  if (Number(input.id) > 0 && (content === `/images/${Number(input.id)}` || content === `/api/images/${Number(input.id)}`)) {
    await db.prepare("UPDATE images SET width=?,height=?,updated_at=? WHERE id=?").bind(width, height, now, Number(input.id)).run();
    return Number(input.id);
  }
  if (Number(input.id) > 0) {
    await db.prepare("UPDATE images SET content=?,mime_type=?,width=?,height=?,natural_width=?,natural_height=?,updated_at=? WHERE id=?").bind(content, mimeType, width, height, naturalWidth, naturalHeight, now, Number(input.id)).run();
    return Number(input.id);
  }
  const result = await db.prepare("INSERT INTO images(content,mime_type,width,height,natural_width,natural_height,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)").bind(content, mimeType, width, height, naturalWidth, naturalHeight, now, now).run();
  return Number(result.lastInsertRowid);
}
const productSelect = "SELECT p.*,i.id image_id,i.mime_type image_mime_type,i.width image_width,i.height image_height,i.natural_width image_natural_width,i.natural_height image_natural_height,di.id image_dark_id,di.mime_type image_dark_mime_type,di.width image_dark_width,di.height image_dark_height,di.natural_width image_dark_natural_width,di.natural_height image_dark_natural_height FROM products p LEFT JOIN images i ON i.id=p.image_id LEFT JOIN images di ON di.id=i.dark_image_id";
function mapProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    priceCents: row.price_cents,
    image: mapImage(row),
    categories: [],
    universes: [],
    categoryIds: [],
    universeIds: [],
    featured: Boolean(row.featured),
    featuredPosition: row.featured_position === null || row.featured_position === void 0 ? null : Number(row.featured_position),
    active: Boolean(row.active)
  };
}
const universeSelect = "SELECT u.*,i.id image_id,i.mime_type image_mime_type,i.width image_width,i.height image_height,i.natural_width image_natural_width,i.natural_height image_natural_height,di.id image_dark_id,di.mime_type image_dark_mime_type,di.width image_dark_width,di.height image_dark_height,di.natural_width image_dark_natural_width,di.natural_height image_dark_natural_height FROM universes u LEFT JOIN images i ON i.id=u.image_id LEFT JOIN images di ON di.id=i.dark_image_id";
function mapUniverse(row) {
  return {
    id: Number(row.id),
    title: String(row.title),
    slug: String(row.slug || ""),
    image: mapImage(row),
    position: Number(row.position),
    active: Boolean(row.active)
  };
}
function mapCategory(row) {
  return {
    id: Number(row.id),
    label: String(row.label),
    slug: String(row.slug),
    position: Number(row.position),
    active: Boolean(row.active)
  };
}
async function mapProductsWithRelations(db, rows) {
  const products = rows.map(mapProduct);
  if (!products.length) return products;
  const ids = products.map((item) => item.id);
  const placeholders = ids.map(() => "?").join(",");
  const { results: categoryRows } = await db.prepare(`SELECT pc.product_id, c.*
                                                      FROM product_categories pc
                                                               JOIN categories c ON c.id = pc.category_id
                                                      WHERE pc.product_id IN (${placeholders})
                                                      ORDER BY c.position, c.id`).bind(...ids).all();
  const { results: universeRows } = await db.prepare(`SELECT pu.product_id, u.*
                                                      FROM product_universes pu
                                                               JOIN universes u ON u.id = pu.universe_id
                                                      WHERE pu.product_id IN (${placeholders})
                                                      ORDER BY u.position, u.id`).bind(...ids).all();
  for (const product of products) {
    product.categories = categoryRows.filter((row) => row.product_id === product.id).map(mapCategory);
    product.universes = universeRows.filter((row) => row.product_id === product.id).map((row) => ({
      id: Number(row.id),
      title: String(row.title),
      slug: String(row.slug || ""),
      image: null,
      position: Number(row.position),
      active: Boolean(row.active)
    }));
    product.categoryIds = product.categories.map((item) => item.id);
    product.universeIds = product.universes.map((item) => item.id);
  }
  return products;
}
async function replaceProductRelations(db, productId, categoryIds, universeIds) {
  const categories = [...new Set((Array.isArray(categoryIds) ? categoryIds : []).map(Number).filter(Number.isInteger))];
  const universes = [...new Set((Array.isArray(universeIds) ? universeIds : []).map(Number).filter(Number.isInteger))];
  if (!categories.length || !universes.length) throw createError$1({
    statusCode: 400,
    statusMessage: "S\xE9lectionnez au moins une cat\xE9gorie et un univers"
  });
  const categoryMarks = categories.map(() => "?").join(",");
  const universeMarks = universes.map(() => "?").join(",");
  const categoryCount = await db.prepare(`SELECT COUNT(*) total
                                            FROM categories
                                            WHERE id IN (${categoryMarks})`).bind(...categories).first();
  const universeCount = await db.prepare(`SELECT COUNT(*) total
                                            FROM universes
                                            WHERE id IN (${universeMarks})`).bind(...universes).first();
  if ((categoryCount == null ? void 0 : categoryCount.total) !== categories.length || (universeCount == null ? void 0 : universeCount.total) !== universes.length) throw createError$1({
    statusCode: 400,
    statusMessage: "Cat\xE9gorie ou univers invalide"
  });
  await db.prepare("DELETE FROM product_categories WHERE product_id=?").bind(productId).run();
  await db.prepare("DELETE FROM product_universes WHERE product_id=?").bind(productId).run();
  await db.batch([...categories.map((id) => db.prepare("INSERT INTO product_categories(product_id,category_id) VALUES(?,?)").bind(productId, id)), ...universes.map((id) => db.prepare("INSERT INTO product_universes(product_id,universe_id) VALUES(?,?)").bind(productId, id))]);
}

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "PasswordCodeEmail",
  props: {
    code: {}
  },
  setup(__props) {
    const body = { backgroundColor: "#f5f2eb", fontFamily: "Arial,sans-serif", padding: "32px 12px" };
    const card = {
      backgroundColor: "#ffffff",
      border: "1px solid #d7d1c8",
      margin: "0 auto",
      maxWidth: "560px",
      padding: "32px"
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Html), { lang: "fr" }, {
        default: withCtx(() => [
          createVNode(unref(Head)),
          createVNode(unref(Preview), null, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode("Votre code de s\xE9curit\xE9 Angel Dreamer", -1)
            ])]),
            _: 1
          }),
          createVNode(unref(Body), { style: body }, {
            default: withCtx(() => [
              createVNode(unref(Container), { style: card }, {
                default: withCtx(() => [
                  createVNode(unref(Heading), null, {
                    default: withCtx(() => [..._cache[1] || (_cache[1] = [
                      createTextVNode("Modification de votre mot de passe", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Text), null, {
                    default: withCtx(() => [..._cache[2] || (_cache[2] = [
                      createTextVNode("Votre code de s\xE9curit\xE9 est :", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Text), { style: { fontSize: "30px", fontWeight: "700", letterSpacing: "8px", color: "#c93620" } }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.code), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(Text), null, {
                    default: withCtx(() => [..._cache[3] || (_cache[3] = [
                      createTextVNode("Ce code expire dans 10 minutes et ne peut \xEAtre utilis\xE9 qu\u2019une fois.", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Text), null, {
                    default: withCtx(() => [..._cache[4] || (_cache[4] = [
                      createTextVNode("Si vous n\u2019\xEAtes pas \xE0 l\u2019origine de cette demande, ignorez cet e-mail.", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "InitialAdminPasswordEmail",
  props: {
    password: {}
  },
  setup(__props) {
    const body = { backgroundColor: "#f5f2eb", fontFamily: "Arial,sans-serif", padding: "32px 12px" };
    const card = {
      backgroundColor: "#ffffff",
      border: "1px solid #d7d1c8",
      margin: "0 auto",
      maxWidth: "560px",
      padding: "32px"
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Html), { lang: "fr" }, {
        default: withCtx(() => [
          createVNode(unref(Head)),
          createVNode(unref(Preview), null, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode("Votre acc\xE8s administrateur Angel Dreamer", -1)
            ])]),
            _: 1
          }),
          createVNode(unref(Body), { style: body }, {
            default: withCtx(() => [
              createVNode(unref(Container), { style: card }, {
                default: withCtx(() => [
                  createVNode(unref(Heading), null, {
                    default: withCtx(() => [..._cache[1] || (_cache[1] = [
                      createTextVNode("Votre compte administrateur", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Text), null, {
                    default: withCtx(() => [..._cache[2] || (_cache[2] = [
                      createTextVNode("Votre mot de passe temporaire est :", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Text), { style: { fontSize: "22px", fontWeight: "700", color: "#c93620" } }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.password), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(Text), null, {
                    default: withCtx(() => [..._cache[3] || (_cache[3] = [
                      createTextVNode("Connectez-vous puis choisissez imm\xE9diatement un nouveau mot de passe. Ce mot de passe temporaire ne pourra plus \xEAtre utilis\xE9 apr\xE8s ce changement. ", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AdminPasswordResetEmail",
  props: {
    resetUrl: {}
  },
  setup(__props) {
    const body = { backgroundColor: "#f5f2eb", fontFamily: "Arial,sans-serif", padding: "32px 12px" };
    const card = {
      backgroundColor: "#ffffff",
      border: "1px solid #d7d1c8",
      margin: "0 auto",
      maxWidth: "560px",
      padding: "32px"
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Html), { lang: "fr" }, {
        default: withCtx(() => [
          createVNode(unref(Head)),
          createVNode(unref(Preview), null, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode("R\xE9initialisez votre mot de passe Angel Dreamer", -1)
            ])]),
            _: 1
          }),
          createVNode(unref(Body), { style: body }, {
            default: withCtx(() => [
              createVNode(unref(Container), { style: card }, {
                default: withCtx(() => [
                  createVNode(unref(Heading), null, {
                    default: withCtx(() => [..._cache[1] || (_cache[1] = [
                      createTextVNode("R\xE9initialisation de votre mot de passe", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Text), null, {
                    default: withCtx(() => [..._cache[2] || (_cache[2] = [
                      createTextVNode("Un administrateur vous invite \xE0 choisir un nouveau mot de passe.", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    href: __props.resetUrl,
                    style: { backgroundColor: "#c93620", color: "#ffffff", display: "inline-block", padding: "13px 20px", textDecoration: "none" }
                  }, {
                    default: withCtx(() => [..._cache[3] || (_cache[3] = [
                      createTextVNode(" Choisir mon nouveau mot de passe ", -1)
                    ])]),
                    _: 1
                  }, 8, ["href"]),
                  createVNode(unref(Text), null, {
                    default: withCtx(() => [..._cache[4] || (_cache[4] = [
                      createTextVNode("Ce lien est personnel, utilisable une seule fois et expire dans 30 minutes.", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Text), null, {
                    default: withCtx(() => [..._cache[5] || (_cache[5] = [
                      createTextVNode("Si vous n\u2019attendiez pas cet e-mail, vous pouvez simplement l\u2019ignorer.", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DemoAccountEndedEmail",
  props: {
    demoEmail: {},
    endedAt: {}
  },
  setup(__props) {
    const body = { backgroundColor: "#f5f2eb", fontFamily: "Arial,sans-serif", padding: "32px 12px" };
    const card = { backgroundColor: "#ffffff", border: "1px solid #d7d1c8", margin: "0 auto", maxWidth: "560px", padding: "32px" };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Html), { lang: "fr" }, {
        default: withCtx(() => [
          createVNode(unref(Head)),
          createVNode(unref(Preview), null, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode("Le compte de d\xE9monstration a termin\xE9 sa session et a \xE9t\xE9 supprim\xE9.", -1)
            ])]),
            _: 1
          }),
          createVNode(unref(Body), { style: body }, {
            default: withCtx(() => [
              createVNode(unref(Container), { style: card }, {
                default: withCtx(() => [
                  createVNode(unref(Heading), null, {
                    default: withCtx(() => [..._cache[1] || (_cache[1] = [
                      createTextVNode("Session de d\xE9monstration termin\xE9e", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Text), null, {
                    default: withCtx(() => [
                      createTextVNode("Le compte temporaire " + toDisplayString(__props.demoEmail) + " s\u2019est d\xE9connect\xE9 le " + toDisplayString(__props.endedAt) + ".", 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(Text), null, {
                    default: withCtx(() => [..._cache[2] || (_cache[2] = [
                      createTextVNode("Il a bien \xE9t\xE9 supprim\xE9 automatiquement, avec toutes ses donn\xE9es associ\xE9es.", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});

async function sendRawMail(event, message) {
  const config = useRuntimeConfig(event);
  if (!config.smtpHost || !config.smtpUser || !config.smtpPassword || !config.emailFrom) throw createError$1({
    statusCode: 503,
    statusMessage: "Service d'envoi d'e-mails indisponible"
  });
  const secure = config.smtpSecure === true || String(config.smtpSecure).toLowerCase() === "true";
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort || 587),
    secure,
    auth: { user: config.smtpUser, pass: config.smtpPassword }
  });
  await transporter.sendMail({
    from: config.emailFrom,
    to: message.to,
    replyTo: message.replyTo,
    subject: message.subject,
    html: message.html,
    attachments: message.attachments
  });
}
async function sendTransactionalMail(event, message) {
  const config = useRuntimeConfig(event);
  if (!config.smtpHost || !config.smtpUser || !config.smtpPassword || !config.emailFrom) throw createError$1({
    statusCode: 503,
    statusMessage: "Service d\u2019envoi d\u2019e-mails indisponible"
  });
  const secure = config.smtpSecure === true || String(config.smtpSecure).toLowerCase() === "true";
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort || 587),
    secure,
    auth: { user: config.smtpUser, pass: config.smtpPassword }
  });
  const html = await render(message.template, message.props, { pretty: true });
  const text = await render(message.template, message.props, { plainText: true });
  await transporter.sendMail({ from: config.emailFrom, to: message.to, subject: message.subject, html, text });
}
async function sendPasswordCode(event, email, code) {
  await sendTransactionalMail(event, {
    to: email,
    subject: "Votre code de s\xE9curit\xE9 Angel Dreamer",
    template: _sfc_main$3,
    props: { code }
  });
}
async function sendInitialAdminPassword(event, email, password) {
  await sendTransactionalMail(event, {
    to: email,
    subject: "Votre acc\xE8s administrateur Angel Dreamer",
    template: _sfc_main$2,
    props: { password }
  });
}
async function sendAdminPasswordReset(event, email, resetUrl) {
  await sendTransactionalMail(event, {
    to: email,
    subject: "R\xE9initialisez votre mot de passe Angel Dreamer",
    template: _sfc_main$1,
    props: { resetUrl }
  });
}
async function sendDemoAccountEnded(event, adminEmail, demoEmail) {
  await sendTransactionalMail(event, {
    to: adminEmail,
    subject: "Fin d\u2019utilisation du compte de d\xE9monstration",
    template: _sfc_main,
    props: { demoEmail, endedAt: (/* @__PURE__ */ new Date()).toLocaleString("fr-FR") }
  });
}

const encoder = new TextEncoder();
const b64 = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
const fromB64 = (value) => Uint8Array.from(
  atob(value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=")),
  (c) => c.charCodeAt(0)
);
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 21e4 }, key, 256);
  return `${b64(salt)}.${b64(new Uint8Array(bits))}`;
}
async function verifyPassword(password, stored) {
  const [salt, expected] = stored.split(".");
  if (!salt || !expected)
    return false;
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = new Uint8Array(await crypto.subtle.deriveBits({
    name: "PBKDF2",
    hash: "SHA-256",
    salt: fromB64(salt),
    iterations: 21e4
  }, key, 256));
  const target = fromB64(expected);
  if (bits.length !== target.length)
    return false;
  let diff = 0;
  for (let i = 0; i < bits.length; i++)
    diff |= bits[i] ^ target[i];
  return diff === 0;
}
async function jwtKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256"
    },
    false,
    ["sign", "verify"]
  );
}
async function signSession(event, user) {
  const secret = useRuntimeConfig(event).jwtSecret;
  if (!secret)
    throw createError$1({
      statusCode: 503,
      statusMessage: "Authentification non configur\xE9e"
    });
  const header = b64(encoder.encode(JSON.stringify({
    alg: "HS256",
    typ: "JWT"
  })));
  const payload = b64(encoder.encode(JSON.stringify({
    sub: String(user.id),
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1e3),
    exp: Math.floor(Date.now() / 1e3) + 604800
  })));
  const signature = b64(new Uint8Array(await crypto.subtle.sign("HMAC", await jwtKey(secret), encoder.encode(`${header}.${payload}`))));
  setCookie(
    event,
    "angel_session",
    `${header}.${payload}.${signature}`,
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 604800
    }
  );
}
async function sessionUser(event) {
  try {
    const token = getCookie(event, "angel_session");
    if (!token)
      return null;
    const [h, p, s] = token.split(".");
    if (!h || !p || !s)
      return null;
    const secret = useRuntimeConfig(event).jwtSecret;
    if (!secret)
      return null;
    const valid = await crypto.subtle.verify("HMAC", await jwtKey(secret), fromB64(s), encoder.encode(`${h}.${p}`));
    if (!valid)
      return null;
    const header = JSON.parse(new TextDecoder().decode(fromB64(h)));
    const claims = JSON.parse(new TextDecoder().decode(fromB64(p)));
    const now = Math.floor(Date.now() / 1e3);
    if (header.alg !== "HS256" || header.typ !== "JWT")
      return null;
    if (!/^\d+$/.test(String(claims.sub || "")) || !Number.isInteger(claims.iat) || !Number.isInteger(claims.exp))
      return null;
    if (claims.iat > now + 60 || claims.exp < now || claims.exp - claims.iat > 604800)
      return null;
    const db = database(event);
    await ready(db);
    return await db.prepare("SELECT id,email,first_name,last_name,role,active,must_change_password,created_at FROM users WHERE id=? AND active=1").bind(Number(claims.sub)).first();
  } catch {
    return null;
  }
}
async function requireUser(event) {
  const user = await sessionUser(event);
  if (!user)
    throw createError$1({ statusCode: 401, statusMessage: "Connexion requise" });
  if (user.must_change_password)
    throw createError$1({ statusCode: 428, statusMessage: "Changement de mot de passe requis" });
  return user;
}
async function requireAdmin(event) {
  const user = await requireUser(event);
  if (!["admin", "demo"].includes(user.role))
    throw createError$1({ statusCode: 403, statusMessage: "Droits administrateur requis" });
  const method = String(event.method || "GET").toUpperCase();
  if (user.role === "demo" && !["GET", "HEAD"].includes(method))
    throw createError$1({ statusCode: 403, statusMessage: "Le compte de d\xE9monstration dispose d\u2019un acc\xE8s en lecture seule" });
  return user;
}
function clearAuthSession(event) {
  deleteCookie(event, "angel_session", { path: "/" });
}

function initialPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*-_";
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("");
}
async function bootstrapDefaultAdmin(event) {
  const config = useRuntimeConfig(event);
  const email = String(config.adminEmail || "").trim().toLowerCase();
  if (!email) return;
  const db = database(event);
  await ready(db);
  const existingAdmin = await db.prepare("SELECT id FROM users WHERE role='admin' LIMIT 1").first();
  if (existingAdmin) return;
  const password = initialPassword();
  await sendInitialAdminPassword(event, email, password);
  const passwordHash = await hashPassword(password);
  await db.prepare("INSERT INTO users(email,password_hash,role,active,must_change_password,created_at) VALUES(?,?,'admin',1,1,?) ON CONFLICT(email) DO UPDATE SET password_hash=excluded.password_hash,role='admin',active=1,must_change_password=1").bind(email, passwordHash, (/* @__PURE__ */ new Date()).toISOString()).run();
}

const _pm6M5Z = defineEventHandler(async (event) => {
  try {
    await bootstrapDefaultAdmin(event);
  } catch (error) {
    console.error("Initialisation de l'administrateur impossible", error);
  }
});

const safeMethods = /* @__PURE__ */ new Set(["GET", "HEAD", "OPTIONS"]);
const _ZmRa0S = defineEventHandler((event) => {
  const method = event.method.toUpperCase();
  const path = getRequestURL(event).pathname;
  const isWebhook = path === "/api/webhooks/stripe";
  if (!safeMethods.has(method) && !isWebhook && getHeader(event, "sec-fetch-site") === "cross-site") {
    throw createError$1({ statusCode: 403, statusMessage: "Requ\xEAte intersite refus\xE9e" });
  }
});

const _SxA8c9 = defineEventHandler(() => {});

const _lazy_fmzp1_ = () => import('../routes/api/admin/categories.get.mjs');
const _lazy_QLBxo8 = () => import('../routes/api/admin/categories.put.mjs');
const _lazy_PTTUpC = () => import('../routes/api/admin/content.put.mjs');
const _lazy_3RRyeL = () => import('../routes/api/admin/discounts.get.mjs');
const _lazy_wBSIAY = () => import('../routes/api/admin/discounts.post.mjs');
const _lazy_CmQMCq = () => import('../routes/api/admin/discounts/_id_.delete.mjs');
const _lazy_fS8D8d = () => import('../routes/api/admin/discounts/_id_.put.mjs');
const _lazy_y59Jk2 = () => import('../routes/api/admin/featured.put.mjs');
const _lazy_4uirWQ = () => import('../routes/api/admin/images.get.mjs');
const _lazy_EQnGCV = () => import('../routes/api/admin/images.post.mjs');
const _lazy_9VFh_U = () => import('../routes/api/admin/images/_id_.delete.mjs');
const _lazy_eV3jkJ = () => import('../routes/api/admin/images/_id_.put.mjs');
const _lazy_E6dx4q = () => import('../routes/api/admin/images/_id/dark.put.mjs');
const _lazy_qw61PU = () => import('../routes/api/admin/me.get.mjs');
const _lazy_Dt88Oi = () => import('../routes/api/admin/products.get.mjs');
const _lazy_Fgs9Ij = () => import('../routes/api/admin/products.post.mjs');
const _lazy_nVJHNd = () => import('../routes/api/admin/products/_id_.delete.mjs');
const _lazy_En1GPs = () => import('../routes/api/admin/products/_id_.put.mjs');
const _lazy_5mYdQr = () => import('../routes/api/admin/promo-codes.get.mjs');
const _lazy_gGUxSp = () => import('../routes/api/admin/promo-codes.post.mjs');
const _lazy_jkcm3R = () => import('../routes/api/admin/promo-codes/_id_.delete.mjs');
const _lazy_jOwuq5 = () => import('../routes/api/admin/promo-codes/_id_.put.mjs');
const _lazy_Nu87Ws = () => import('../routes/api/admin/seo-audit.get.mjs');
const _lazy_qdGBXj = () => import('../routes/api/admin/universes.get.mjs');
const _lazy_8OILvp = () => import('../routes/api/admin/universes.put.mjs');
const _lazy_ZW8EVN = () => import('../routes/api/admin/users.get.mjs');
const _lazy_LalEAX = () => import('../routes/api/admin/users/_id_.delete.mjs');
const _lazy_Ne8siY = () => import('../routes/api/admin/users/_id_.put.mjs');
const _lazy_8IxcDD = () => import('../routes/api/admin/users/_id/password-reset.post.mjs');
const _lazy_BQxtSk = () => import('../routes/api/admin/users/demo.post.mjs');
const _lazy_TlyMpy = () => import('../routes/api/auth/change-password.post.mjs');
const _lazy_1NpxRw = () => import('../routes/api/auth/login.post.mjs');
const _lazy_a9p1g0 = () => import('../routes/api/auth/logout.post.mjs');
const _lazy_oJw4lY = () => import('../routes/api/auth/me.get.mjs');
const _lazy_aVXQza = () => import('../routes/api/auth/password-code/confirm.post.mjs');
const _lazy_flHeEM = () => import('../routes/api/auth/password-code/request.post.mjs');
const _lazy_IAbszH = () => import('../routes/api/auth/profile.put.mjs');
const _lazy_R3HNkC = () => import('../routes/api/auth/register.post.mjs');
const _lazy_AEPcpp = () => import('../routes/api/categories.get.mjs');
const _lazy_NeeUE2 = () => import('../routes/api/checkout/paypal.post.mjs');
const _lazy_3ZF06L = () => import('../routes/api/checkout/paypal/capture.get.mjs');
const _lazy_h9oIlk = () => import('../routes/api/checkout/stripe.post.mjs');
const _lazy_fweUCM = () => import('../routes/api/contact/attachment.post.mjs');
const _lazy_hKEH_c = () => import('../routes/api/contact/attachment/_id_.delete.mjs');
const _lazy_YVZpBl = () => import('../routes/api/contact/send-code.post.mjs');
const _lazy_SblEt4 = () => import('../routes/api/contact/send.post.mjs');
const _lazy_Fc1k6n = () => import('../routes/api/content.get.mjs');
const _lazy_ZbdX9O = () => import('../routes/api/images/_id_.get.mjs');
const _lazy_rRJekY = () => import('../routes/api/products/_slug_.get.mjs');
const _lazy_f1b84G = () => import('../routes/api/index.get.mjs');
const _lazy_VPfBV9 = () => import('../routes/api/promo-codes/validate.post.mjs');
const _lazy_oFSolS = () => import('../routes/api/universes.get.mjs');
const _lazy_Yzhm1O = () => import('../routes/api/webhooks/stripe.post.mjs');
const _lazy_D0QbRZ = () => import('../routes/images/_id_.get.mjs');
const _lazy_3V_RsX = () => import('../routes/llms.txt.get.mjs');
const _lazy_Xubb4M = () => import('../routes/robots.txt.get.mjs');
const _lazy_GFvFxk = () => import('../routes/sitemap.xml.get.mjs');
const _lazy_rnPhyt = () => import('../routes/renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '', handler: _AQnCs1, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _pm6M5Z, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _ZmRa0S, lazy: false, middleware: true, method: undefined },
  { route: '/api/admin/categories', handler: _lazy_fmzp1_, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/categories', handler: _lazy_QLBxo8, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/content', handler: _lazy_PTTUpC, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/discounts', handler: _lazy_3RRyeL, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/discounts', handler: _lazy_wBSIAY, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/discounts/:id', handler: _lazy_CmQMCq, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/discounts/:id', handler: _lazy_fS8D8d, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/featured', handler: _lazy_y59Jk2, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/images', handler: _lazy_4uirWQ, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/images', handler: _lazy_EQnGCV, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/images/:id', handler: _lazy_9VFh_U, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/images/:id', handler: _lazy_eV3jkJ, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/images/:id/dark', handler: _lazy_E6dx4q, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/me', handler: _lazy_qw61PU, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/products', handler: _lazy_Dt88Oi, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/products', handler: _lazy_Fgs9Ij, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/products/:id', handler: _lazy_nVJHNd, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/products/:id', handler: _lazy_En1GPs, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/promo-codes', handler: _lazy_5mYdQr, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/promo-codes', handler: _lazy_gGUxSp, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/promo-codes/:id', handler: _lazy_jkcm3R, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/promo-codes/:id', handler: _lazy_jOwuq5, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/seo-audit', handler: _lazy_Nu87Ws, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/universes', handler: _lazy_qdGBXj, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/universes', handler: _lazy_8OILvp, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/users', handler: _lazy_ZW8EVN, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/users/:id', handler: _lazy_LalEAX, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/users/:id', handler: _lazy_Ne8siY, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/users/:id/password-reset', handler: _lazy_8IxcDD, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/users/demo', handler: _lazy_BQxtSk, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/change-password', handler: _lazy_TlyMpy, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/login', handler: _lazy_1NpxRw, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/logout', handler: _lazy_a9p1g0, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/me', handler: _lazy_oJw4lY, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/password-code/confirm', handler: _lazy_aVXQza, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/password-code/request', handler: _lazy_flHeEM, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/profile', handler: _lazy_IAbszH, lazy: true, middleware: false, method: "put" },
  { route: '/api/auth/register', handler: _lazy_R3HNkC, lazy: true, middleware: false, method: "post" },
  { route: '/api/categories', handler: _lazy_AEPcpp, lazy: true, middleware: false, method: "get" },
  { route: '/api/checkout/paypal', handler: _lazy_NeeUE2, lazy: true, middleware: false, method: "post" },
  { route: '/api/checkout/paypal/capture', handler: _lazy_3ZF06L, lazy: true, middleware: false, method: "get" },
  { route: '/api/checkout/stripe', handler: _lazy_h9oIlk, lazy: true, middleware: false, method: "post" },
  { route: '/api/contact/attachment', handler: _lazy_fweUCM, lazy: true, middleware: false, method: "post" },
  { route: '/api/contact/attachment/:id', handler: _lazy_hKEH_c, lazy: true, middleware: false, method: "delete" },
  { route: '/api/contact/send-code', handler: _lazy_YVZpBl, lazy: true, middleware: false, method: "post" },
  { route: '/api/contact/send', handler: _lazy_SblEt4, lazy: true, middleware: false, method: "post" },
  { route: '/api/content', handler: _lazy_Fc1k6n, lazy: true, middleware: false, method: "get" },
  { route: '/api/images/:id', handler: _lazy_ZbdX9O, lazy: true, middleware: false, method: "get" },
  { route: '/api/products/:slug', handler: _lazy_rRJekY, lazy: true, middleware: false, method: "get" },
  { route: '/api/products', handler: _lazy_f1b84G, lazy: true, middleware: false, method: "get" },
  { route: '/api/promo-codes/validate', handler: _lazy_VPfBV9, lazy: true, middleware: false, method: "post" },
  { route: '/api/universes', handler: _lazy_oFSolS, lazy: true, middleware: false, method: "get" },
  { route: '/api/webhooks/stripe', handler: _lazy_Yzhm1O, lazy: true, middleware: false, method: "post" },
  { route: '/images/:id', handler: _lazy_D0QbRZ, lazy: true, middleware: false, method: "get" },
  { route: '/llms.txt', handler: _lazy_3V_RsX, lazy: true, middleware: false, method: "get" },
  { route: '/robots.txt', handler: _lazy_Xubb4M, lazy: true, middleware: false, method: "get" },
  { route: '/sitemap.xml', handler: _lazy_GFvFxk, lazy: true, middleware: false, method: "get" },
  { route: '/__nuxt_error', handler: _lazy_rnPhyt, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_rnPhyt, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { $fetch as $, sendPasswordCode as A, requireUser as B, setResponseStatus as C, getQuery as D, sendRedirect as E, readMultipartFormData as F, sendRawMail as G, setHeader as H, readRawBody as I, getHeader as J, joinRelativeURL as K, getResponseStatusText as L, getResponseStatus as M, encodePath as N, defineRenderHandler as O, destr as P, getRouteRules as Q, joinURL as R, useNitroApp as S, parseURL as T, decodePath as U, hasProtocol as V, isScriptProtocol as W, withQuery as X, sanitizeStatusCode as Y, getContext as Z, hash$1 as _, database as a, executeAsync as a0, defu as a1, parseQuery as a2, withTrailingSlash as a3, withoutTrailingSlash as a4, nodeServer as a5, ready as b, readBody as c, defineEventHandler as d, createError$1 as e, defaultSiteContent as f, getRouterParam as g, mapImage as h, imageContentKeys as i, productSelect as j, mapProductsWithRelations as k, replaceProductRelations as l, mapCategory as m, mapUniverse as n, useRuntimeConfig as o, persistImage as p, getRequestURL as q, requireAdmin as r, sessionUser as s, sendAdminPasswordReset as t, universeSelect as u, hashPassword as v, signSession as w, verifyPassword as x, clearAuthSession as y, sendDemoAccountEnded as z };
//# sourceMappingURL=nitro.mjs.map
