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
			// console.log('Images updated', state.images);
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
		// syncCartProducts(state) {
		// 	state.cartProductsData = state.cartProductsData.map((item) => {
		// 		return {
		// 			productId: item.product.id,
		// 			amount: item.quantity,
		// 		};
		// 	});
		// },
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
					console.log(error);
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
					// context.commit('syncCartProducts');
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
					// context.commit('syncCartProducts');
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
					// context.commit('syncCartProducts');
				});
		},
	},
});
