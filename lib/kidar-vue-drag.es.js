var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeGlobal$1 = freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal$1 || freeSelf || Function("return this")();
var root$1 = root;
var Symbol$1 = root$1.Symbol;
var Symbol$2 = Symbol$1;
var objectProto$1 = Object.prototype;
var hasOwnProperty = objectProto$1.hasOwnProperty;
var nativeObjectToString$1 = objectProto$1.toString;
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var objectProto = Object.prototype;
var nativeObjectToString = objectProto.toString;
function objectToString(value) {
  return nativeObjectToString.call(value);
}
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var symbolTag = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
var reWhitespace = /\s/;
function trimmedEndIndex(string) {
  var index = string.length;
  while (index-- && reWhitespace.test(string.charAt(index))) {
  }
  return index;
}
var reTrimStart = /^\s+/;
function baseTrim(string) {
  return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
}
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var now = function() {
  return root$1.Date.now();
};
var now$1 = now;
var FUNC_ERROR_TEXT$1 = "Expected a function";
var nativeMax = Math.max, nativeMin = Math.min;
function debounce(func, wait, options) {
  var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    var args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time = now$1();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(now$1());
  }
  function debounced() {
    var time = now$1(), isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
var FUNC_ERROR_TEXT = "Expected a function";
function throttle(func, wait, options) {
  var leading = true, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = "leading" in options ? !!options.leading : leading;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    "leading": leading,
    "maxWait": wait,
    "trailing": trailing
  });
}
let DRAG_ITEM;
let DRAG_CONTAINER;
let MOVE_TYPE;
let innerX;
let innerY;
const setDotStyle = (el) => {
  el.style.position = "absolute";
  el.style.width = "8px";
  el.style.height = "8px";
  el.style.backgroundColor = "#ffffff";
  el.style.border = "1px solid #333";
};
const getSelectNodes = (() => {
  let nodes;
  return () => {
    if (nodes)
      return nodes;
    const borderEl = document.createElement("div");
    borderEl.className = "__border_line";
    borderEl.style.position = "absolute";
    borderEl.style.left = "0";
    borderEl.style.right = "0";
    borderEl.style.top = "0";
    borderEl.style.bottom = "0";
    borderEl.style.border = "1px dashed #666";
    const lt = document.createElement("div");
    lt.className = "__dot_lt";
    setDotStyle(lt);
    lt.style.cursor = "nw-resize";
    lt.style.left = "-4px";
    lt.style.top = "-4px";
    const lb = document.createElement("div");
    lb.className = "__dot_lb";
    setDotStyle(lb);
    lb.style.cursor = "ne-resize";
    lb.style.left = "-4px";
    lb.style.bottom = "-4px";
    const rt = document.createElement("div");
    rt.className = "__dot_rt";
    setDotStyle(rt);
    rt.style.cursor = "ne-resize";
    rt.style.right = "-4px";
    rt.style.top = "-4px";
    const rb = document.createElement("div");
    rb.className = "__dot_rb";
    setDotStyle(rb);
    rb.style.cursor = "nw-resize";
    rb.style.right = "-4px";
    rb.style.bottom = "-4px";
    nodes = [borderEl, lt, lb, rt, rb];
    return nodes;
  };
})();
const resetPos = (left, top) => {
  let { offsetHeight, offsetWidth } = DRAG_ITEM;
  if (top < 0) {
    top = 0;
  }
  if (left < 0) {
    left = 0;
  }
  if (left + offsetWidth > DRAG_CONTAINER.offsetWidth) {
    left = DRAG_CONTAINER.offsetWidth - offsetWidth;
  }
  if (top + offsetHeight > DRAG_CONTAINER.offsetHeight) {
    top = DRAG_CONTAINER.offsetHeight - offsetHeight;
  }
  DRAG_ITEM.style.left = Number(left) / Number(DRAG_CONTAINER.clientWidth) * 100 + "%";
  DRAG_ITEM.style.top = Number(top) / Number(DRAG_CONTAINER.clientHeight) * 100 + "%";
};
const resize = throttle(function(left, top, width, height) {
  DRAG_ITEM.style.width = Number(width) / Number(DRAG_CONTAINER.clientWidth) * 100 + "%";
  DRAG_ITEM.style.height = Number(height) / Number(DRAG_CONTAINER.clientHeight) * 100 + "%";
  resetPos(left, top);
}, 100);
const select = (target) => {
  if (DRAG_ITEM !== target) {
    DRAG_ITEM && unselect(DRAG_ITEM);
  }
  if (target.innerHTML.indexOf("__border_line") === -1) {
    target.append(...getSelectNodes());
  }
};
const unselect = (target) => {
  if (target && target.innerHTML.indexOf("__border_line") > -1) {
    getSelectNodes().forEach((node) => {
      target.removeChild(node);
    });
  }
};
const isSelect = (target, currentTarget) => {
  if (target.parentElement === currentTarget) {
    select(target);
    DRAG_ITEM = target;
    return true;
  } else if (target.parentElement) {
    return isSelect(target.parentElement, currentTarget);
  } else {
    return false;
  }
};
const down = (e) => {
  let { target, currentTarget, pageX, pageY } = e;
  if (target instanceof HTMLElement && currentTarget instanceof HTMLElement) {
    if (target.className.startsWith("__dot")) {
      MOVE_TYPE = target.className.substring(6, 8);
      currentTarget.style.cursor = MOVE_TYPE === "lt" || MOVE_TYPE === "rb" ? "nw-resize" : "ne-resize";
    } else if (isSelect(target, currentTarget)) {
      MOVE_TYPE = "move";
      currentTarget.style.cursor = "move";
      innerX = pageX - DRAG_ITEM.offsetLeft;
      innerY = pageY - DRAG_ITEM.offsetTop;
    } else {
      unselect(DRAG_ITEM);
    }
    DRAG_CONTAINER = currentTarget;
  }
};
const up = (callback) => {
  return (e) => {
    MOVE_TYPE = "";
    DRAG_CONTAINER && (DRAG_CONTAINER.style.cursor = "auto");
    DRAG_ITEM && callback && callback(DRAG_ITEM);
  };
};
let updateDragItem;
const move = (e) => {
  if (!MOVE_TYPE) {
    return;
  }
  let { pageY, pageX } = e;
  let { offsetLeft, offsetTop, offsetHeight, offsetWidth } = DRAG_ITEM;
  let offsetX = pageX - DRAG_CONTAINER.offsetLeft;
  let offsetY = pageY - DRAG_CONTAINER.offsetTop;
  switch (MOVE_TYPE) {
    case "rb":
      resize(offsetLeft, offsetTop, offsetX - offsetLeft, offsetY - offsetTop);
      break;
    case "rt":
      if (offsetY > offsetTop + offsetHeight) {
        offsetY = offsetTop + offsetHeight;
      }
      resize(offsetLeft, offsetY, offsetX - offsetLeft, offsetHeight - offsetY + offsetTop);
      break;
    case "lt":
      if (offsetY > offsetTop + offsetHeight) {
        offsetY = offsetTop + offsetHeight;
      }
      if (offsetX > offsetLeft + offsetWidth) {
        offsetX = offsetLeft + offsetWidth;
      }
      resize(offsetX, offsetY, offsetWidth - offsetX + offsetLeft, offsetHeight - offsetY + offsetTop);
      break;
    case "lb":
      if (offsetX > offsetLeft + offsetWidth) {
        offsetX = offsetLeft + offsetWidth;
      }
      resize(offsetX, offsetTop, offsetWidth - offsetX + offsetLeft, offsetY - offsetTop);
      break;
    case "move":
      DRAG_CONTAINER.style.cursor = "move";
      resize(pageX - innerX, pageY - innerY, offsetWidth, offsetHeight);
      break;
  }
};
const active = (el, callback) => {
  updateDragItem = up(callback);
  el.style.userSelect = "none";
  el.addEventListener("mousedown", down);
  el.addEventListener("mouseup", updateDragItem);
  el.addEventListener("mousemove", move);
};
const clear = (el) => {
  el.style.userSelect = "inherit";
  el.removeEventListener("mousedown", down);
  el.removeEventListener("mouseup", updateDragItem);
  el.removeEventListener("mousemove", move);
  DRAG_ITEM && unselect(DRAG_ITEM);
};
var Drag = {
  active,
  clear
};
var render = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { ref: "dragContainer", staticStyle: { "position": "relative", "height": "100%", "width": "100%", "background-color": "#f1f1f1" } }, _vm._l(_vm.items, function(item, i) {
    return _c("div", { key: item.id, style: "position: absolute;width:" + item.width + ";height:" + item.height + ";left:" + item.left + ";top:" + item.top + ";min-width:" + item.minWidth + ";", attrs: { "dataset-drag-index": i } }, [_c("div", { staticClass: "__drag-item", staticStyle: { "height": "100%", "width": "100%", "position": "absolute", "top": "50%", "left": "50%", "transform": "translateX(-50%) translateY(-50%)" } }, [_vm._t("item", null, { "item": item })], 2), _vm.isCanDel ? _c("button", { staticStyle: { "position": "absolute", "right": "4px" }, on: { "click": function($event) {
      return _vm.deleteItem(i, item);
    } } }, [_c("svg", { attrs: { "xmlns": "http://www.w3.org/2000/svg", "height": "1em", "viewBox": "0 0 24 24", "width": "1em", "fill": "currentColor" } }, [_c("path", { attrs: { "d": "M0 0h24v24H0V0z", "fill": "none" } }), _c("path", { attrs: { "d": "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" } })])]) : _vm._e()]);
  }), 0);
};
var staticRenderFns = [];
function normalizeComponent(scriptExports, render2, staticRenderFns2, functionalTemplate, injectStyles2, scopeId, moduleIdentifier, shadowMode) {
  var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
  if (render2) {
    options.render = render2;
    options.staticRenderFns = staticRenderFns2;
    options._compiled = true;
  }
  if (functionalTemplate) {
    options.functional = true;
  }
  if (scopeId) {
    options._scopeId = "data-v-" + scopeId;
  }
  var hook;
  if (moduleIdentifier) {
    hook = function(context) {
      context = context || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext;
      if (!context && typeof __VUE_SSR_CONTEXT__ !== "undefined") {
        context = __VUE_SSR_CONTEXT__;
      }
      if (injectStyles2) {
        injectStyles2.call(this, context);
      }
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    };
    options._ssrRegister = hook;
  } else if (injectStyles2) {
    hook = shadowMode ? function() {
      injectStyles2.call(this, (options.functional ? this.parent : this).$root.$options.shadowRoot);
    } : injectStyles2;
  }
  if (hook) {
    if (options.functional) {
      options._injectStyles = hook;
      var originalRender = options.render;
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }
  return {
    exports: scriptExports,
    options
  };
}
const script = {
  name: "KiDragContainer",
  props: {
    editable: { type: Boolean, default: true },
    items: { type: Array, default: () => [] }
  },
  watch: {
    items: {
      handler: function(newV, oldV) {
        this.$emit("changed", newV);
      },
      deep: true
    },
    editable: function(newV) {
      newV ? this.active() : this.disable();
    }
  },
  data() {
    return {
      isCanDel: true
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.editable && this.active();
    });
  },
  beforeDestroy() {
    this.disable();
  },
  methods: {
    deleteItem(i, item) {
      this.$emit("delete", i, item);
    },
    updateItem(item) {
      let { width, height, left, top } = item.style;
      let idx = item.getAttribute("dataset-drag-index");
      if (this.items[idx].width !== width || this.items[idx].height !== height || this.items[idx].left !== left || this.items[idx].top !== top) {
        this.items[idx].width = width;
        this.items[idx].height = height;
        this.items[idx].left = left;
        this.items[idx].top = top;
        this.$emit("changed", this.items);
      }
    },
    active() {
      Drag.active(this.$refs.dragContainer, this.updateItem);
      this.isCanDel = true;
    },
    disable() {
      Drag.clear(this.$refs.dragContainer);
      this.isCanDel = false;
    }
  }
};
const __cssModules = {};
var __component__ = /* @__PURE__ */ normalizeComponent(script, render, staticRenderFns, false, injectStyles, null, null, null);
function injectStyles(context) {
  for (let o in __cssModules) {
    this[o] = __cssModules[o];
  }
}
var DragContainer = /* @__PURE__ */ function() {
  return __component__.exports;
}();
DragContainer.install = (vue) => {
  vue.component(DragContainer.name, DragContainer);
};
if (typeof window !== "undefined" && window.Vue) {
  DragContainer.install(window.Vue);
}
export { DragContainer as default };
