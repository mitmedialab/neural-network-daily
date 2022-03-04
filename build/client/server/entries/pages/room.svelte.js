import { c as create_ssr_component, a as subscribe, e as escape } from "../../chunks/index-6a69bd57.js";
import { a as room } from "../../chunks/activityStore-12484b66.js";
const Room = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $room, $$unsubscribe_room;
  $$unsubscribe_room = subscribe(room, (value) => $room = value);
  $$unsubscribe_room();
  return `<h1>${escape($room)}</h1>`;
});
export { Room as default };
