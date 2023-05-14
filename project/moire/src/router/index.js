import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@/pages/MainPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';

const router = createRouter({
	routes: [
		{ name: 'main', component: MainPage, path: '/' },
		{ name: 'notFound', component: NotFoundPage, path: '/:pathMatch(.*)*' },
	],
	history: createWebHistory(),
});

export default router;
