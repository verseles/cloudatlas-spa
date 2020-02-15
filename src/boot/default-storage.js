import { LocalStorage } from "quasar";

export default ({ Vue, app }) => {
  app.$storage = LocalStorage;
  Vue.prototype.$storage = LocalStorage;
};
