<template>
	<main class="content container">
		<div class="content__top">
			<div class="content__row">
				<h1 class="content__title">Каталог</h1>
				<span class="content__info">{{ products.length }} товара </span>
			</div>
		</div>
		<div class="content__catalog">
			<!-- Filter -->
			<aside class="filter">
				<form class="filter__form form" action="#" method="get">
					<fieldset class="form__block">
						<legend class="form__legend">Цена</legend>
						<label class="form__label form__label--price">
							<input class="form__input" type="text" name="min-price" value="0" />
							<span class="form__value">От</span>
						</label>
						<label class="form__label form__label--price">
							<input class="form__input" type="text" name="max-price" value="12345" />
							<span class="form__value">До</span>
						</label>
					</fieldset>

					<fieldset class="form__block">
						<legend class="form__legend">Категория</legend>
						<label class="form__label form__label--select">
							<select class="form__select" type="text" name="category">
								<option value="value1">Все категории</option>
								<option value="value2">Футболки</option>
								<option value="value3">Бюстгалтеры</option>
								<option value="value4">Носки</option>
							</select>
						</label>
					</fieldset>

					<fieldset class="form__block">
						<legend class="form__legend">Материал</legend>
						<ul class="check-list">
							<li class="check-list__item">
								<label class="check-list__label">
									<input class="check-list__check sr-only" type="checkbox" name="material" value="лен" />
									<span class="check-list__desc">
										лен
										<span>(3)</span>
									</span>
								</label>
							</li>
							<li class="check-list__item">
								<label class="check-list__label">
									<input class="check-list__check sr-only" type="checkbox" name="material" value="хлопок" />
									<span class="check-list__desc">
										хлопок
										<span>(46)</span>
									</span>
								</label>
							</li>
							<li class="check-list__item">
								<label class="check-list__label">
									<input class="check-list__check sr-only" type="checkbox" name="material" value="шерсть" />
									<span class="check-list__desc">
										шерсть
										<span>(20)</span>
									</span>
								</label>
							</li>
							<li class="check-list__item">
								<label class="check-list__label">
									<input class="check-list__check sr-only" type="checkbox" name="material" value="шелк" />
									<span class="check-list__desc">
										шелк
										<span>(30)</span>
									</span>
								</label>
							</li>
						</ul>
					</fieldset>

					<fieldset class="form__block">
						<legend class="form__legend">Коллекция</legend>
						<ul class="check-list">
							<li class="check-list__item">
								<label class="check-list__label">
									<input class="check-list__check sr-only" type="checkbox" name="collection" value="лето" checked="" />
									<span class="check-list__desc">
										лето
										<span>(2)</span>
									</span>
								</label>
							</li>
							<li class="check-list__item">
								<label class="check-list__label">
									<input class="check-list__check sr-only" type="checkbox" name="collection" value="зима" />
									<span class="check-list__desc">
										зима
										<span>(53)</span>
									</span>
								</label>
							</li>
							<li class="check-list__item">
								<label class="check-list__label">
									<input class="check-list__check sr-only" type="checkbox" name="collection" value="весна" />
									<span class="check-list__desc">
										весна
										<span>(24)</span>
									</span>
								</label>
							</li>
							<li class="check-list__item">
								<label class="check-list__label">
									<input class="check-list__check sr-only" type="checkbox" name="collection" value="осень" />
									<span class="check-list__desc">
										осень
										<span>(30)</span>
									</span>
								</label>
							</li>
						</ul>
					</fieldset>

					<button class="filter__submit button button--primery" type="submit">Применить</button>
					<button class="filter__reset button button--second" type="button">Сбросить</button>
				</form>
			</aside>
			<!-- Catalog -->
			<section class="catalog">
				<ul class="catalog__list">
					<li v-for="(item, index) of products" :key="item.id" class="catalog__item">
						<a class="catalog__pic" href="#">
							<img :src="checkedColors[item.id - 1].gallery[0].file.url" :srcset="checkedColors[item.id - 1].gallery[0].file.url" :alt="item.slug" />
						</a>

						<h3 class="catalog__title">
							<a href="#"> {{ item.title }} </a>
						</h3>

						<span class="catalog__price"> {{ item.price }} ₽ </span>

						<ul v-if="item.colors" class="colors colors--black">
							<li v-for="color of item.colors" :key="color.id" class="colors__item">
								<label class="colors__label">
									<input @click="clickedElement(item.id)" class="colors__radio sr-only" type="radio" name="color-1" v-model="currentColor" :value="color.id" checked="" />
									<span class="colors__value" :style="{ background: color.color.code }"> </span>
								</label>
							</li>
						</ul>
					</li>
				</ul>

				<ul class="catalog__pagination pagination">
					<li class="pagination__item">
						<a class="pagination__link pagination__link--arrow pagination__link--disabled" aria-label="Предыдущая страница">
							<svg width="8" height="14" fill="currentColor">
								<use xlink:href="#icon-arrow-left"></use>
							</svg>
						</a>
					</li>
					<li class="pagination__item">
						<a class="pagination__link pagination__link--current"> 1 </a>
					</li>
					<li class="pagination__item">
						<a class="pagination__link" href="#"> 2 </a>
					</li>
					<li class="pagination__item">
						<a class="pagination__link" href="#"> 3 </a>
					</li>
					<li class="pagination__item">
						<a class="pagination__link" href="#"> 4 </a>
					</li>
					<li class="pagination__item">
						<a class="pagination__link" href="#"> ... </a>
					</li>
					<li class="pagination__item">
						<a class="pagination__link" href="#"> 10 </a>
					</li>
					<li class="pagination__item">
						<a class="pagination__link pagination__link--arrow" href="#" aria-label="Следующая страница">
							<svg width="8" height="14" fill="currentColor">
								<use xlink:href="#icon-arrow-right"></use>
							</svg>
						</a>
					</li>
				</ul>
			</section>
		</div>
	</main>
</template>

<script>
	import { defineComponent } from 'vue';
	import { mapGetters, mapActions } from 'vuex';

	export default defineComponent({
		data() {
			return {
				productsData: null,
				checkedItem: 2,
				currentColor: '',
				checkedColors: {},
			};
		},
		methods: {
			...mapActions(['loadItems']),
			...mapGetters(['getItems']),
			clickedElement(id) {
				this.checkedItem = id;
			},
		},
		computed: {
			products() {
				return this.productsData
					? this.productsData.map((product, index) => {
							return {
								...product,
								images: product.colors.map((color) => {
									if (color.gallery) {
										this.checkedColors[index] ? null : (this.checkedColors[index] = color);
										return color.gallery.map((files) => files.file.url);
									}
									return null;
								}),
							};
					  })
					: [];
			},
			productImage() {
				return this.productsData[this.checkedItem].colors.find((img) => img.color.code === this.currentColor);
			},
			// countProducts() {
			// 	return this.productsData ? this.productsData.pagination.total : 0;
			// },
		},
		created() {
			this.loadItems().then((response) => {
				console.log(response.data.items);
				this.productsData = response.data.items;
			});
		},
	});
</script>
