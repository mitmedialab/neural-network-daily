import { n as noop, d as safe_not_equal } from "./index-6a69bd57.js";
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
  function subscribe(run, invalidate = noop) {
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
  return { set, update, subscribe };
}
const appNamePrefix = "Contours2Classification_";
function createPersistentStore(key, startValue = null) {
  const prefixedKey = appNamePrefix + key;
  const browser = typeof localStorage != "undefined";
  const getStoredData = () => {
    if (browser) {
      const json = localStorage.getItem(prefixedKey);
      return json ? JSON.parse(json) : startValue;
    }
    return startValue;
  };
  const setStoreData = (value) => {
    if (browser) {
      localStorage.setItem(prefixedKey, JSON.stringify(value));
    }
  };
  const { subscribe, set, update } = writable(getStoredData());
  subscribe((current) => setStoreData(current));
  return { subscribe, update, set };
}
const room = createPersistentStore("room", void 0);
createPersistentStore("role", void 0);
createPersistentStore("inputs", void 0);
export { room as a, readable as r };
