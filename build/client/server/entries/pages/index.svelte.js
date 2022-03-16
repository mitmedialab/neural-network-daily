import { c as create_ssr_component, a as subscribe, b as add_attribute, v as validate_component } from "../../chunks/index-49e878d2.js";
import { s as socket } from "../../chunks/store-3c79dd97.js";
import "socket.io-client";
const inputMin = 6;
const inputMax = 50;
const StartRoom = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_socket;
  $$unsubscribe_socket = subscribe(socket, (value) => value);
  $$unsubscribe_socket();
  return `<div>Nope you no&#39;t</div>
<input type="${"range"}"${add_attribute("min", inputMin, 0)}${add_attribute("max", inputMax, 0)}>
<button></button>`;
});
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1>No Welcome to SvelteKit get you you</h1>
<p>Hiii okay
	<a href="${"https://kit.svelte.dev"}">kit.svelte.dev</a>
	to read the documentation
</p>
${validate_component(StartRoom, "StartRoom").$$render($$result, {}, {}, {})}`;
});
export { Routes as default };
