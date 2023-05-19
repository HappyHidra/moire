<template>
	<main class="content container">
		<div class="content__top">
			<div class="content__row">
				<h1 class="content__title">Каталог</h1>
				<span class="content__info">{{ countProducts }} товара </span>
			</div>
		</div>
		<div class="content__catalog">
			<!-- Filter -->
			<ProductsFilter
				v-model:category-id="filterCategoryId"
				v-model:material-ids="filterMaterialIds"
				v-model:season-ids="filterSeasonIds"
				v-model:color-ids="filterColorIds"
				v-model:price-from="filterPriceFrom"
				v-model:price-to="filterPriceTo" />
			<!-- Catalog -->
			<section class="catalog">
				<!-- Loaders -->
				<div v-if="productsLoading">
					Загрузка товаров...<br />
					<img src="@/assets/Spinner-3.gif" alt="spinner loader" />
				</div>
				<div v-if="productsLoadingFailed">
					Загрузка товаров неудалась!
					<button class="button button--primery" @click.prevent="loadProducts">Попробовать еще раз</button>
				</div>
				<!-- Product list -->
				<ul class="catalog__list">
					<li v-for="(item, index) of products" :key="item.id" class="catalog__item">
						<router-link class="catalog__pic" href="#" :to="{ name: 'product', params: { id: item.id } }">
							<img :src="item.image" :srcset="item.image" :alt="item.slug" />
						</router-link>
						<h3 class="catalog__title">
							<router-link href="#" :to="{ name: 'product', params: { id: item.id } }"> {{ item.title }} </router-link>
						</h3>
						<span class="catalog__price"> {{ item.priceFiltered }} ₽ </span>
						<ul v-if="item.colors" class="colors colors--black">
							<li v-for="(color, colorIndex) of item.colors" :key="color.id" class="colors__item">
								<label class="colors__label">
									<input
										@change.prevent="clickedElement(index)"
										class="colors__radio sr-only"
										type="radio"
										v-model="currentColor[index]"
										:name="color.id + color.color.id"
										:value="[color.id]"
										:checked="checkedItems[index][colorIndex]" />
									<span class="colors__value" :style="{ background: color.color.code }"> </span>
								</label>
							</li>
						</ul>
					</li>
				</ul>
			</section>
		</div>
		<!-- Pagination -->
		<BasePagination v-model:page="page" :elem-count="countProducts" :per-page="productsPerPage" />
	</main>
</template>

<script setup>
	import { ref, computed, reactive, watch } from 'vue';
	import { useStore, mapGetters, mapActions, mapMutations } from 'vuex';
	import BasePagination from '@/components/BasePagination.vue';
	import ProductsFilter from '@/components/ProductsFilter.vue';
	import numberFormat from '@/helpers/numberFormat';

	const store = useStore();
	// For loading
	const productsLoading = ref(false);
	const productsLoadingFailed = ref(false);
	// For catalog
	const productsData = ref(null);
	// const productsState = ref(null);
	const currentColor = ref([]);
	const checkedItems = ref([]);
	// checkedColors: [[{}, {}], [{}], ....],
	const checkedColors = reactive([]);
	// For pagination
	const page = ref(1);
	const productsPerPage = ref(12);
	// For filter
	const filterCategoryId = ref(0);
	const filterMaterialIds = ref([]);
	const filterSeasonIds = ref([]);
	const filterColorIds = ref([]);
	const filterPriceFrom = ref(0);
	const filterPriceTo = ref(0);

	const loadProducts = () => {
		productsLoading.value = true;
		productsLoadingFailed.value = false;

		store
			.dispatch('loadItems', {
				categoryId: filterCategoryId.value,
				materialIds: filterMaterialIds.value,
				seasonIds: filterSeasonIds.value,
				colorIds: filterColorIds.value,
				page: page.value,
				limit: productsPerPage.value,
				minPrice: filterPriceFrom.value,
				maxPrice: filterPriceTo.value,
			})
			.then((response) => {
				// Object.assign(checkedColors, []);
				// checkedItems.value = [];
				// currentColor.value = [];
				productsData.value = response.data;
				// productsState.value = store.getters.getItems;
				// First items checked
				productsData.value.items.forEach((item, index) => {
					if (checkedItems.value[index]) {
						checkedItems.value[index].push(false);
					} else {
						checkedItems.value[index] = [];
						checkedItems.value[index].push(true);
					}
				});
				// Initial images loading
				const images = [];
				productsData.value.items.map((product, index) => {
					product.colors.map((color) => {
						if (color.gallery) {
							if (!images[index]) {
								images.push(color.gallery[0].file.url);
							}
						}
						// currentColor
						if (!currentColor.value[index]) {
							currentColor.value[index] = [];
						}
						if (color.gallery) {
							if (checkedColors[index]) {
								checkedColors[index].push({ ...color });
							} else {
								checkedColors[index] = [{ ...color }];
							}
							return color.gallery.map((files) => files.file.url);
						}
						return null;
					});
				});
				store.commit('updateImages', images);
			})
			.catch((error) => {
				console.log('Error on loading products', error);
				productsLoadingFailed.value = true;
			})
			.then(() => {
				productsLoading.value = false;
			});
	};

	const clickedElement = (elementIndex) => {
		const index = checkedColors[elementIndex].findIndex((color) => color.id === currentColor.value[elementIndex][0]);
		// if (products[elementIndex].image) {
		if (checkedColors[elementIndex][index]) {
			const newImage = checkedColors[elementIndex][index].gallery[0].file.url;
			const imagesArr = store.getters.getImages;
			imagesArr.splice(elementIndex, 1, newImage);
			store.commit('updateImages', [...imagesArr]);
		}
		// }
	};
	// Computed
	const products = computed(() => {
		if (productsData.value) {
			// if (productsState) {
			return productsData.value.items.map((product, index) => {
				return {
					...product,
					priceFiltered: numberFormat(product.price),
					image: store.getters.getImages[index],
				};
			});
		} else {
			return [];
		}
	});

	const countProducts = computed(() => {
		return productsData.value ? productsData.value.pagination.total : 0;
	});

	// watchers
	watch(filterCategoryId, function () {
		loadProducts();
	});

	watch(
		filterMaterialIds,
		(newValue, oldValue) => {
			// console.log('n', newValue);
			// console.log('o', oldValue);
			loadProducts();
		},
		{ deep: true }
	);

	watch(
		filterSeasonIds,
		function () {
			loadProducts();
		},
		{ deep: true }
	);

	watch(
		filterColorIds,
		function () {
			loadProducts();
		},
		{ deep: true }
	);

	watch(filterPriceFrom, function () {
		loadProducts();
	});

	watch(filterPriceTo, function () {
		loadProducts();
	});

	watch(page, function () {
		loadProducts();
	});

	// On creating component
	loadProducts();
</script>
