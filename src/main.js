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
import TreeTable from 'vue-table-with-tree-grid'
// 导入 vue-quill-editor 
import VueQuillEditor from 'vue-quill-editor'
// 导入 vue-quill-editor 对应的样式 
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


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

Vue.component('tree-table', TreeTable)
// 将 vue-quill-editor 注册为全局
Vue.use(VueQuillEditor)

// 设置全局过滤时间的方法
Vue.filter('dateFormat', function(originVal) {
	const dt = new Date(originVal)

	const y = dt.getFullYear()
	const m = (dt.getMonth() + 1 + '').padStart(2, '0')
	const d = (dt.getDate() + '').padStart(2, '0')

	const hh = (dt.getHours() + '').padStart(2, '0')
	const mm = (dt.getMinutes() + '').padStart(2, '0')
	const ss = (dt.getSeconds() + '').padStart(2, '0')

	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})

new Vue({
	router,
	Element,
	render: (h) => h(App),
}).$mount("#app")
