import { createStore } from 'vuex';
import { API_BASE_URL } from '@/config.js';
import axios from 'axios';

export default createStore({
	state() {
		return {
			items: [],
			images: [],
			userAccessKey: null,
			cartProductsData: [],
		};
	},
	mutations: {
		updateItems(state, data) {
			state.items = data;
		},
		updateImages(state, data) {
			state.images = data;
		},
		updateUserAccessKey(state, { userAccessKey: accessKey }) {
			state.userAccessKey = accessKey;
		},
		updateCartProductsData(state, items) {
			state.cartProductsData = items;
		},
		updateCartProductAmount(state, { basketItemId, amount }) {
			const item = state.cartProductsData.find((items) => items.productId === basketItemId);
			if (item) {
				item.quantity = amount;
			}
		},
		deleteCartProduct(state, productId) {
			state.cartProductsData = state.cartProductsData.filter((item) => item.productId !== productId);
		},
	},
	getters: {
		getItems(state) {
			return state.items;
		},
		getImages(state) {
			return state.images;
		},
		getCartProducts(state) {
			return state.cartProductsData;
		},
		cartTotalPrice(state, getters) {
			return getters.getCartProducts.reduce((acc, item) => item.price * item.quantity + acc, 0);
		},
		productsAmount(state, getters) {
			return getters.getCartProducts.reduce((acc, item) => item.quantity + acc, 0);
		},
	},
	actions: {
		loadItems(context, { categoryId, materialIds, seasonIds, colorIds, page, limit, minPrice, maxPrice }) {
			return axios
				.get(API_BASE_URL + '/api/products', {
					params: {
						categoryId,
						materialIds,
						seasonIds,
						colorIds,
						page,
						limit,
						minPrice,
						maxPrice,
					},
				})
				.then((resp) => {
					context.commit('updateItems', resp.data);
					return resp;
				})
				.catch((error) => {
					return error;
				});
		},
		loadCart(context) {
			return axios
				.get(API_BASE_URL + '/api/baskets', {
					params: {
						userAccessKey: context.state.userAccessKey,
					},
				})
				.then((response) => {
					if (!context.state.userAccessKey) {
						localStorage.setItem('userAccessKey', response.data.user.accessKey);
						context.commit('updateUserAccessKey', response.data.user.accessKey);
					}
					context.commit('updateCartProductsData', response.data.items);
				})
				.catch((er) => {
					return er;
				});
		},
		addProductToCart(context, { productId, amount, colorId, sizeId }) {
			return axios
				.post(
					API_BASE_URL + '/api/baskets/products',
					{
						productId: productId,
						colorId: colorId,
						sizeId: sizeId,
						quantity: amount,
					},
					{
						params: {
							userAccessKey: context.state.userAccessKey,
						},
					}
				)
				.then((response) => {
					context.commit('updateCartProductsData', response.data.items);
				});
		},
		updateCartProductAmount(context, { basketItemId, amount }) {
			context.commit('updateCartProductAmount', { basketItemId, amount });

			if (amount < 1) {
				return;
			}

			return axios
				.put(
					API_BASE_URL + '/api/baskets/products',
					{
						basketItemId: basketItemId,
						quantity: amount,
					},
					{
						params: {
							userAccessKey: context.state.userAccessKey,
						},
					}
				)
				.then((response) => {
					context.commit('updateCartProductsData', response.data.items);
				});
		},
		deleteCartProduct(context, { basketItemId }) {
			return axios
				.delete(API_BASE_URL + '/api/baskets/products', {
					data: {
						basketItemId: basketItemId,
					},
					params: {
						userAccessKey: context.state.userAccessKey,
					},
				})
				.then((response) => {
					context.commit('updateCartProductsData', response.data.items);
				});
		},
		makeOrder(context, { name, address, phone, email, deliveryTypeId, paymentTypeId, comment }) {
			return axios
				.post(
					API_BASE_URL + '/api/orders',
					{
						name,
						address,
						phone,
						email,
						deliveryTypeId,
						paymentTypeId,
						comment,
					},
					{
						params: {
							userAccessKey: context.state.userAccessKey,
						},
					}
				)
				.then((response) => {
					return response;
				});
		},
		loadOrderInfo(context, { id }) {
			return axios
				.get(API_BASE_URL + `/api/orders/${id}`, {
					params: {
						userAccessKey: context.state.userAccessKey,
					},
				})
				.then((response) => {
					return response.data;
				});
		},
	},
});
