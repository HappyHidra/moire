import { createStore } from 'vuex';
import { API_BASE_URL } from '@/config.js';
import axios from 'axios';

export default createStore({
	state() {
		return {
			items: [],
			images: [],
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
	},
	getters: {
		getItems(state) {
			return state.items;
		},
		getImages(state) {
			return state.images;
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
	},
});
