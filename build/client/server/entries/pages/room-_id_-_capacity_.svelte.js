import { g as getContext, c as create_ssr_component, a as subscribe, f as each, b as add_attribute } from "../../chunks/index-49e878d2.js";
import { g as graphFactory } from "../../chunks/store-3c79dd97.js";
import "socket.io-client";
const getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
var room__id___capacity__svelte_svelte_type_style_lang = "";
const css = {
  code: ".column.svelte-amt3x6{display:inline-block;margin:auto;vertical-align:middle}.node.svelte-amt3x6{width:100px;height:100px;border-radius:50%;background-color:black;z-index:10}.output.svelte-amt3x6{width:100px;height:100px;background-color:black}.pad.svelte-amt3x6{margin-top:50px}",
  map: null
};
const Room_u5Bidu5D_u5Bcapacityu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $graphFactory, $$unsubscribe_graphFactory;
  let $page, $$unsubscribe_page;
  $$unsubscribe_graphFactory = subscribe(graphFactory, (value) => $graphFactory = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  const capacity = $page.params.capacity;
  let graphConfig = void 0;
  let layerMap = void 0;
  let elements;
  const getColumnCss = (column) => `grid-column: ${column}`;
  $$result.css.add(css);
  graphConfig = $graphFactory.getConfig(parseInt(capacity));
  layerMap = $graphFactory.getLayerConfigMap(graphConfig);
  $graphFactory.buildGraph(graphConfig);
  elements = [...layerMap].reduce((obj, [type, layerConfig]) => {
    const update = { ...obj };
    update[type] = Array(layerConfig.nodeCount);
    return update;
  }, {});
  $$unsubscribe_graphFactory();
  $$unsubscribe_page();
  return `<div>${each([...layerMap], ([layerType, layerConfig], layerIndex) => {
    return `<div class="${["svelte-amt3x6", "column"].join(" ").trim()}">${each(Array(layerConfig.nodeCount), (_, nodeIndex) => {
      return `<div${add_attribute("style", getColumnCss(layerIndex), 0)} class="${["svelte-amt3x6", "node " + (nodeIndex > 0 ? "pad" : "")].join(" ").trim()}"${add_attribute("this", elements[layerType][nodeIndex], 0)}></div>`;
    })}</div>
    <div class="${["svelte-amt3x6", "column"].join(" ").trim()}"><div style="${"width: 100px"}"></div>
    </div>`;
  })}
  <div${add_attribute("style", getColumnCss(graphConfig.depth), 0)} class="${["svelte-amt3x6", "column output"].join(" ").trim()}"></div></div>

${``}`;
});
export { Room_u5Bidu5D_u5Bcapacityu5D as default };
