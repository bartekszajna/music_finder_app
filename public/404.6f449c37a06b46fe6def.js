!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=93)}({19:function(e,t,n){"use strict";function o(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}n.d(t,"a",(function(){return r}));var r=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.currentMode,this.modeButtonElement=document.querySelector(".button--mode"),this.modeTextElement=this.modeButtonElement.querySelector(".button_text"),this.modeButtonElement.addEventListener("click",this.modeButtonHandler.bind(this)),this.systemModeHandler(),this.storageModeHandler()}var t,n,r;return t=e,(n=[{key:"modeButtonHandler",value:function(){this.currentMode=document.documentElement.className,"dark_mode"===this.currentMode?(document.documentElement.className="light_mode",this.modeTextElement.innerText="Dark mode",localStorage.setItem("mode","light_mode")):(document.documentElement.className="dark_mode",this.modeTextElement.innerText="Light mode",localStorage.setItem("mode","dark_mode"))}},{key:"systemModeHandler",value:function(){window.matchMedia("(prefers-color-scheme: dark)").matches?(this.modeTextElement.innerText="Light mode",document.documentElement.className="dark_mode"):(this.modeTextElement.innerText="Dark mode",document.documentElement.className="light_mode")}},{key:"storageModeHandler",value:function(){var e=localStorage.getItem("mode");e&&(document.documentElement.className="".concat(e),this.modeTextElement.innerText="light_mode"===e?"Dark mode":"Light mode")}}])&&o(t.prototype,n),r&&o(t,r),e}()},93:function(e,t,n){"use strict";n.r(t);n(94);var o=new(n(19).a);o.systemModeHandler(),o.storageModeHandler()},94:function(e,t,n){}});