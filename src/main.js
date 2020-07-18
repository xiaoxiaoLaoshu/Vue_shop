import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import Element from "./plugins/element"
// 导入全局重置样式表
import "./assets/css/reset.css"
// 导入全局公共样式表
import "./assets/css/common.css"
// 导入 Element-ui 样式表
import "element-ui/lib/theme-chalk/index.css"

import axios from "axios"
// 配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
// axios 拦截器
axios.interceptors.request.use((config) => {
	// console.log(config)
	config.headers.Authorization = window.sessionStorage.getItem("token")
	// 在最后必须 return config
	return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
	router,
	Element,
	render: (h) => h(App),
}).$mount("#app")
