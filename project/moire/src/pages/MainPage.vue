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
					<button class="button button--primery" @click.prevent="loadItems">Попробовать еще раз</button>
				</div>
				<!-- Product list -->
				<ul class="catalog__list">
					<li v-for="(item, index) of products" :key="item.id" class="catalog__item">
						<a class="catalog__pic" href="#">
							<img :src="item.image" :srcset="item.image" :alt="item.slug" />
						</a>
						<h3 class="catalog__title">
							<a href="#"> {{ item.title }} </a>
						</h3>
						<span class="catalog__price"> {{ item.price }} ₽ </span>
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
		<BasePagination v-model="page" :elem-count="countProducts" :per-page="productsPerPage" />
	</main>
</template>

<script>
	import { defineComponent } from 'vue';
	import { mapGetters, mapActions, mapMutations } from 'vuex';
	import BasePagination from '@/components/BasePagination.vue';
	import ProductsFilter from '@/components/ProductsFilter.vue';

	export default defineComponent({
		components: { BasePagination, ProductsFilter },
		data() {
			return {
				// For loading
				productsLoading: false,
				productsLoadingFailed: false,
				// For catalog - шлифануть не нужны скорее всего 2 отдельных свойства
				productsData: null,
				productsState: null,
				currentColor: [],
				checkedItems: [],
				// checkedColors: [[{}, {}], [{}], ....],
				checkedColors: [],
				// For pagination
				page: 1,
				productsPerPage: 12,
				// For filter
				filterCategoryId: 0,
				filterMaterialIds: [],
				filterSeasonIds: [],
				filterColorIds: [],
				filterPriceFrom: 0,
				filterPriceTo: 0,
			};
		},
		// Methods
		methods: {
			...mapActions(['loadItems']),
			...mapGetters(['getItems', 'getImages']),
			...mapMutations(['updateImages']),
			loadProducts() {
				this.productsLoading = true;
				this.productsLoadingFailed = false;

				clearTimeout(this.loadProductTimer);
				this.loadProductTimer = setTimeout(() => {
					this.loadItems({
						categoryId: this.filterCategoryId,
						materialIds: this.filterMaterialIds,
						seasonIds: this.filterSeasonIds,
						colorIds: this.filterColorIds,
						page: this.page,
						limit: this.productsPerPage,
						minPrice: this.filterPriceFrom,
						maxPrice: this.filterPriceTo,
					})
						.then((response) => {
							this.checkedColors = [];
							this.checkedItems = [];
							this.currentColor = [];
							this.productsData = response.data;
							this.productsState = this.getItems();
							// First items checked
							this.productsState.items.forEach((item, index) => {
								if (this.checkedItems[index]) {
									this.checkedItems[index].push(false);
								} else {
									this.checkedItems[index] = [];
									this.checkedItems[index].push(true);
								}
							});
							// Initial images loading
							const images = [];
							this.productsData.items.map((product, index) => {
								product.colors.map((color) => {
									if (color.gallery) {
										if (!images[index]) {
											images.push(color.gallery[0].file.url);
										}
									}
									// currentColor
									if (!this.currentColor[index]) {
										this.currentColor[index] = [];
									}
									if (color.gallery) {
										if (this.checkedColors[index]) {
											this.checkedColors[index].push({ ...color });
										} else {
											this.checkedColors[index] = [{ ...color }];
										}
										return color.gallery.map((files) => files.file.url);
									}
									return null;
								});
							});
							this.updateImages(images);
						})
						.catch((error) => {
							console.log('Error on loading products', error);
							this.productsLoadingFailed = true;
						})
						.then(() => {
							this.productsLoading = false;
						});
				}, 0);
			},
			clickedElement(elementIndex) {
				const index = this.checkedColors[elementIndex].findIndex((color) => color.id === this.currentColor[elementIndex][0]);
				if (this.products[elementIndex].image) {
					if (this.checkedColors[elementIndex][index]) {
						const newImage = this.checkedColors[elementIndex][index].gallery[0].file.url;
						const imagesArr = this.getImages();
						imagesArr.splice(elementIndex, 1, newImage);
						this.updateImages([...imagesArr]);
					}
				}
			},
		},
		// Computed
		computed: {
			products() {
				if (this.productsData) {
					// if (this.productsState) {
					return this.productsData.items.map((product, index) => {
						return {
							...product,
							image: this.getImages()[index],
						};
					});
				} else {
					return [];
				}
			},
			countProducts() {
				return this.productsData ? this.productsData.pagination.total : 0;
			},
		},
		// On creating component
		created() {
			this.loadProducts();
		},
		// watchers
		watch: {
			filterCategoryId() {
				this.loadProducts();
			},
			filterMaterialIds: {
				handler: function () {
					this.loadProducts();
				},
				deep: true,
			},
			filterSeasonIds: {
				handler: function () {
					this.loadProducts();
				},
				deep: true,
			},
			filterColorIds: {
				handler: function () {
					this.loadProducts();
				},
				deep: true,
			},
			filterPriceFrom() {
				this.loadProducts();
			},
			filterPriceTo() {
				this.loadProducts();
			},
			page() {
				this.loadProducts();
			},
		},
	});
</script>
