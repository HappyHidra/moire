import { API_BASE_URL } from '@/config';
import numberFormat from '@/helpers/numberFormat';
import axios from 'axios';
import { computed, ref, reactive } from 'vue';

export default function () {
	const deliveriesData = ref(null);
	// const category = computed(() => {
	// 	return productData.value.category;
	// });

	const fetchStatus = reactive({
		isFailed: false,
		isLoading: false,
	});

	const fetchDeliveries = () => {
		fetchStatus.isLoading = true;
		fetchStatus.isFailed = false;
		return axios
			.get(API_BASE_URL + `/api/deliveries`)
			.then((response) => {
				return response.data;
			})
			.catch(() => (fetchStatus.isFailed = true))
			.then((response) => {
				deliveriesData.value = response;
				return response;
			});
	};

	return {
		deliveriesData,
		fetchDeliveries,
		status: fetchStatus,
	};
}
