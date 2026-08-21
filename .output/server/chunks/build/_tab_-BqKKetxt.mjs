import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import AdminPage from './admin-CRC7E_fA.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'better-sqlite3';
import 'mysql2/promise';
import 'nodemailer';
import '@vue-email/render';
import '@vue-email/components';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './StoreHeader-BX76lEQZ.mjs';
import './nuxt-link-DpXmWH_x.mjs';
import './server.mjs';
import 'vue-router';
import '@vue/shared';
import 'perfect-debounce';
import './engagement-icons.module-BtNn5Pri.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './useThemedImage-HZxF4Y-0.mjs';
import './catalog.module-BY5p-w8A.mjs';
import './seo-template-BqCbrlBi.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[tab]",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AdminPage, _attrs, null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/[tab].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_tab_-BqKKetxt.mjs.map
