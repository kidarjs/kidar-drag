import Vue from "vue"
import App from "@/App.vue"

Vue.config.productionTip = false;
Vue.config.devtools = true;

const app = new Vue({
  el: App,
});

app.mount("#app");
