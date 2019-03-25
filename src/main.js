import Vue from 'vue'
import App from './js/a.vue'
require("./css/index.scss");
new Vue({
    el: "#root",
    render:h=>h(App)
})