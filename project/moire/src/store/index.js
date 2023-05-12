import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
	state() {
		return {
			items: [],
		};
	},
	mutations: {
		updateItems(state, data) {
			state.items = data;
		},
	},
	getters: {
		getItems(state) {
			console.log('getItems', state.items);
			return state.items;
		},
	},
	actions: {
		loadItems(context) {
			return axios
				.get('https://vue-moire.skillbox.cc/api/products')
				.then((resp) => {
					console.log(resp);
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
