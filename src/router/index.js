import Vue from "vue"
import VueRouter from "vue-router"
import Login from "../components/Login.vue"
import Home from "../components/Home.vue"
import Welcome from "../components/Welcome.vue"
import Users from "../components/user/Users.vue"
import Rights from "../components/power/Rights.vue"
import Roles from "../components/power/Roles.vue"

Vue.use(VueRouter)

const routes = [
	{
		path: "/",
		redirect: "/login",
	},
	{
		path: "/login",
		component: Login,
	},
	{
		path: "/home",
		component: Home,
		redirect: "/welcome",
		children: [
			{ path: "/welcome", component: Welcome },
			{ path: "/users", component: Users },
			{ path: "/rights", component: Rights },
			{ path: "/roles", component: Roles },
		],
	},
]

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
})

// 挂载全局路由导航守卫
router.beforeEach((to, form, next) => {
	// to 将要访问的路径
	// form 代表从哪个路径跳转而来
	// next 是一个函数，表示放行
	//  next() 放行， next('/login') 强制跳转
	if (to.path === "/login") return next()
	// 获取 token
	const tokenStr = window.sessionStorage.getItem("token")
	if (!tokenStr) return next("./login")
	next()
})

// 解决同一页面下，点击加载两次相同的路由的方法
const [routerPush, routerReplace] = [
	VueRouter.prototype.push,
	VueRouter.prototype.replace,
]
VueRouter.prototype.push = function push(location) {
	return routerPush.call(this, location).catch((error) => error)
}
VueRouter.prototype.replace = function replace(location) {
	return routerReplace.call(this, location).catch((error) => error)
}

export default router
