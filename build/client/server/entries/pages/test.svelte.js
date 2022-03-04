import { c as create_ssr_component, f as each, b as add_attribute } from "../../chunks/index-6a69bd57.js";
var test_svelte_svelte_type_style_lang = "";
const css = {
  code: '.container.svelte-1bwp131{display:grid;width:100vw;height:100vh;vertical-align:top;padding:0px;border:none}.crossed.svelte-1bwp131{position:relative;background-color:transparent}.crossed.svelte-1bwp131:before{content:"";position:absolute;left:0;right:0;top:1px;bottom:1px;border-width:100px;border-style:solid;border-color:black transparent}.crossed.svelte-1bwp131:after{content:"";position:absolute;left:1px;right:1px;top:0;bottom:0;border-width:0;border-style:solid;border-color:transparent transparent}',
  map: null
};
let rows = 6;
let columns = 6;
const Test = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const isEven = (value) => value % 2 === 0;
  const getColor = (row, column) => {
    const rowEven = isEven(row);
    const colEven = isEven(column);
    if (rowEven && colEven)
      return "black";
    if (rowEven && !colEven)
      return "orange";
    if (!rowEven && colEven)
      return "green";
    if (!rowEven && !colEven)
      return "red";
  };
  const getGridSquareStyle = (row, column) => {
    return `background-color: ${getColor(row, column)};
    grid-row: ${row + 1};
    grid-column: ${column + 1};`;
  };
  $$result.css.add(css);
  return `<div class="${"container svelte-1bwp131"}">${each(Array(rows), (_, row) => {
    return `${each(Array(columns), (_2, column) => {
      return `<div${add_attribute("style", getGridSquareStyle(row, column), 0)}></div>`;
    })}`;
  })}
  <div${add_attribute("style", getGridSquareStyle(1, 1), 0)} class="${"crossed svelte-1bwp131"}"></div></div>`;
});
export { Test as default };
