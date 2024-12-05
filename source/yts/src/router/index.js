import Vue from 'vue'
import VueRouter from 'vue-router'
import Audio from "@/views/Audio.vue";
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
	{ path: '/', name: 'home', component: () => import('@/views/Home.vue') },
	{ path: '/audio', name: 'audio', component: Audio },
	{ path: '/soundEffect', name: 'soundEffect', component: () => import('@/views/soundEffect/index.vue') },
	{ path: '/chat', name: 'chat', component: () => import('@/views/Chat/index.vue') },
	{ path: '/speech', name: 'speech', component: () => import('@/views/Speech/index.vue') },
	{ path: '/details/:id', name: 'details', component: () => import('@/views/Details.vue') },
	{ path: '/uploadFrom', name: 'uploadFrom', component: () => import('@/views/UploadFrom/index.vue') },
	{ path: '/tip', name: 'tip', component: () => import('@/views/Tip/index.vue') },
	{ path: '/download', name: 'tip', component: () => import('@/views/Download/index.vue') },
	// { path: '/search', name: 'search', component: () => import('@/views/searchHome.vue') }
]


const router = new VueRouter({
	mode: 'hash',
	base: process.env.BASE_URL,
	routes
})



export default router
