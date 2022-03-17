import { n as noop, a as safe_not_equal, c as create_ssr_component, b as subscribe, d as add_attribute, f as each, e as escape, i as is_promise, v as validate_component } from "../../chunks/index-93d8b071.js";
import "util";
import { io } from "socket.io-client";
async function waitForCondition(condition, delay = 100) {
  let timeout = setTimeout(() => null, 0);
  while (!condition()) {
    await new Promise((resolve) => {
      clearTimeout(timeout);
      timeout = setTimeout(resolve, delay);
    });
  }
  clearTimeout(timeout);
}
function removeItem(arr, value) {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
function range(start, length, step = 1) {
  const indices = Array.from({ length }, (_, i) => i * step + start);
  let index = 0;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      const current = { value: indices[index], done: index >= length };
      index++;
      return current;
    }
  };
}
class ClientSocketWrapper {
  static FromExisting(socket2) {
    return new ClientSocketWrapper(socket2);
  }
  static Connect(config) {
    const socket2 = config && config.url ? io(config.url) : io();
    const wrapper = new ClientSocketWrapper(socket2);
    if (config && config.onConnect)
      wrapper.on("connect", config.onConnect);
    return wrapper;
  }
  constructor(socket2) {
    this.subscriptions = new Map();
    this.socket = socket2;
  }
  close() {
    this.socket.close();
  }
  subscribe(name, fn) {
    if (this.subscriptions.has(name)) {
      this.subscriptions.get(name)?.push(fn);
      return false;
    } else {
      this.subscriptions.set(name, [fn]);
      return true;
    }
  }
  unsubscribe(name, fn) {
    const callbacksForEvent = this.subscriptions.get(name);
    if (callbacksForEvent) {
      removeItem(callbacksForEvent, fn);
    }
  }
  on(name, fn) {
    const key = name;
    const mismatchError = () => `Passed in function (${fn.name ?? "anonymous"}) does not match signature for ${name}`;
    switch (key) {
      case "connect":
        if (!this.checkType(fn))
          throw new Error(mismatchError());
        if (this.subscribe(name, fn)) {
          this.socket.on("connect", () => {
            this.subscriptions.get(name)?.forEach((func) => func());
          });
        }
        return true;
      case "start":
        if (!this.checkType(fn))
          throw new Error(mismatchError());
        if (this.subscribe(name, fn)) {
          this.socket.on("start", () => {
            this.subscriptions.get(name)?.forEach((func) => func());
          });
        }
        return true;
      case "update":
        if (!this.checkType(fn))
          throw new Error(mismatchError());
        if (this.subscribe(name, fn)) {
          this.socket.on("update", (packet) => {
            this.subscriptions.get(name)?.forEach((func) => func(packet));
          });
        }
        return true;
      case "prediction":
        if (!this.checkType(fn))
          throw new Error(mismatchError());
        if (this.subscribe(name, fn)) {
          this.socket.on("prediction", (packet) => {
            this.subscriptions.get(name)?.forEach((func) => func(packet));
          });
        }
        return true;
    }
  }
  send(name, params) {
    const key = name;
    const mismatchError = () => `Passed in parameters (${Object.keys(params)}) does not match signature for ${name}`;
    switch (key) {
      case "joinRoom": {
        const castedParams = params;
        if (castedParams === null)
          throw new Error(mismatchError());
        this.socket.emit("joinRoom", ...castedParams);
        return true;
      }
      case "startRoom": {
        const castedParams = params;
        if (castedParams === null)
          throw new Error(mismatchError());
        this.socket.emit("startRoom", ...castedParams);
        return true;
      }
      case "checkRoom": {
        const castedParams = params;
        if (castedParams === null)
          throw new Error(mismatchError());
        this.socket.emit("checkRoom", ...castedParams);
        return true;
      }
      case "propogate": {
        const castedParams = params;
        if (castedParams === null)
          throw new Error(mismatchError());
        this.socket.emit("propogate", ...castedParams);
        return true;
      }
      case "testing_getRoomCounts": {
        const castedParams = params;
        if (castedParams === null)
          throw new Error(mismatchError());
        this.socket.emit("testing_getRoomCounts", ...castedParams);
        return true;
      }
    }
  }
  checkType(item) {
    return item !== null;
  }
}
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
let socketConnected = true;
const waitForSocket = async () => waitForCondition(() => socketConnected);
const socket = readable(ClientSocketWrapper.Connect({
  onConnect: () => socketConnected = true
}));
var ERole;
(function(ERole2) {
  ERole2[ERole2["Undecided"] = 0] = "Undecided";
  ERole2[ERole2["Teacher"] = 1] = "Teacher";
  ERole2[ERole2["Student"] = 2] = "Student";
})(ERole || (ERole = {}));
const ChooseRole = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { role } = $$props;
  if ($$props.role === void 0 && $$bindings.role && role !== void 0)
    $$bindings.role(role);
  return `Are you a
<button>Teacher</button>
or a
<button>Student</button>`;
});
const Student = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_socket;
  $$unsubscribe_socket = subscribe(socket, (value) => value);
  let { id = "" } = $$props;
  let roomId;
  let userName;
  let readyToJoin = false;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  readyToJoin = userName;
  $$unsubscribe_socket();
  return `Name:
<input placeholder="${"name"}"${add_attribute("value", userName, 0)}>
Room:
<input placeholder="${"room"}"${add_attribute("value", roomId, 0)}>

<button ${!readyToJoin ? "disabled" : ""}>Join</button>`;
});
const Teacher = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_socket;
  $$unsubscribe_socket = subscribe(socket, (value) => value);
  const allowedCapacities = Array.from(range(6, 7));
  $$unsubscribe_socket();
  return `<label for="${"capacity"}">Capacity:</label>
<select id="${"capacity"}">${each(allowedCapacities, (capacity) => {
    return `<option${add_attribute("value", capacity, 0)}>${escape(capacity)}</option>`;
  })}</select>

<button>Start Room
</button>`;
});
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let role;
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(_) {
        return `
	<h1>${!role ? `${validate_component(ChooseRole, "ChooseRole").$$render($$result, { role }, {
          role: ($$value) => {
            role = $$value;
            $$settled = false;
          }
        }, {})}` : `${role === ERole.Teacher ? `${validate_component(Teacher, "Teacher").$$render($$result, {}, {}, {})}` : `${role === ERole.Student ? `${validate_component(Student, "Student").$$render($$result, {}, {}, {})}` : ``}`}`}</h1>
`;
      }();
    }(waitForSocket())}`;
  } while (!$$settled);
  return $$rendered;
});
export { Routes as default };
