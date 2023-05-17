import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@/pages/MainPage.vue';
import ProductPage from '@/pages/ProductPage.vue';
import CartPage from '@/pages/CartPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import config from '../../vue.config.js';

const router = createRouter({
	routes: [
		{ name: 'main', component: MainPage, path: '/' },
		{ name: 'product', component: ProductPage, path: '/product/:id' },
		{ name: 'cart', component: CartPage, path: '/cart' },
		{ name: 'notFound', component: NotFoundPage, path: '/:pathMatch(.*)*' },
	],
	history: createWebHistory(config.publicPath),
});

export default router;
