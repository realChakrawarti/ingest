if (typeof globalThis.process === "undefined") {
  Object.defineProperty(globalThis, "process", {
    configurable: true,
    value: { env: {} },
    writable: true,
  });
}

import "~/app/styles/globals.css";