import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@/pages/MainPage.vue';
import ProductPage from '@/pages/ProductPage.vue';
import CartPage from '@/pages/CartPage.vue';
import OrderPage from '@/pages/OrderPage.vue';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import config from '../../vue.config.js';

const router = createRouter({
	routes: [
		{ name: 'main', component: MainPage, path: '/' },
		{ name: 'product', component: ProductPage, path: '/product/:id' },
		{ name: 'cart', component: CartPage, path: '/cart' },
		{ name: 'order', component: OrderPage, path: '/order' },
		{ name: 'orderInfo', component: OrderConfirmationPage, path: '/order/:id' },
		{ name: 'notFound', component: NotFoundPage, path: '/:pathMatch(.*)*' },
	],
	history: createWebHistory(config.publicPath),
});

export default router;
