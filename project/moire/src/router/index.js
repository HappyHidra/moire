import { createRouter, createWebHistory } from 'vue-router';
import Main from '@/pages/Main.vue';

const router = createRouter({
	routes: [
		{
			path: '/',
			component: Main,
		},
	],
	history: createWebHistory(),
});

export default router;
