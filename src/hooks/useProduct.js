import { API_BASE_URL } from '@/config';
import numberFormat from '@/helpers/numberFormat';
import axios from 'axios';
import { computed, ref, reactive } from 'vue';

export default function () {
	const productData = ref(null);
	const category = computed(() => {
		return productData.value.category;
	});

	const fetchStatus = reactive({
		isFailed: false,
		isLoading: false,
	});

	const fetchProduct = (productId) => {
		fetchStatus.isLoading = true;
		fetchStatus.isFailed = false;
		return axios
			.get(API_BASE_URL + `/api/products/` + productId)
			.then((response) => {
				const product = response.data;
				productData.value = Object.assign(product, {
					priceFiltered: numberFormat(product.price),
				});
			})
			.catch(() => (fetchStatus.isFailed = true))
			.then(() => (fetchStatus.isLoading = false));
	};

	return {
		product: productData,
		category,
		fetchProduct,
		status: fetchStatus,
	};
}
