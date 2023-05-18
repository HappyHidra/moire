<template>
	<main class="content container" v-if="status.isLoading">Загрузка товара<img src="@/assets/Spinner-3.gif" alt="spinner loader" /></main>
	<main class="content container" v-else-if="status.isFailed">Не удалось загрузить товар</main>
	<main class="content container" v-else>
		<div class="content__top">
			<ul class="breadcrumbs">
				<li class="breadcrumbs__item">
					<router-link class="breadcrumbs__link" :to="{ name: 'main' }"> Каталог </router-link>
				</li>
				<li class="breadcrumbs__item">
					<router-link class="breadcrumbs__link" :to="{ name: 'main' }">{{ category.title }} </router-link>
				</li>
				<li class="breadcrumbs__item">
					<a class="breadcrumbs__link"> {{ product.title }} </a>
				</li>
			</ul>
		</div>

		<section class="item">
			<div class="item__pics pics">
				<div class="pics__wrapper">
					<img width="570" height="570" :src="checkedImageUrl" :srcset="checkedImageUrl" alt="Название товара" />
				</div>
				<ul class="pics__list">
					<li v-for="(item, imageIndex) of product.colors" class="pics__item">
						<a @click.prevent="changeImage(imageIndex)" href="" class="pics__link" :class="{ 'pics__link--current': imagesRadioBtnChain[imageIndex] }">
							<img v-if="item.gallery" width="98" height="98" :src="item.gallery[0].file.url" :srcset="item.gallery[0].file.url" alt="Название товара" />
						</a>
					</li>
				</ul>
			</div>

			<div class="item__info">
				<span class="item__code">Артикул: {{ product.id }}</span>
				<h2 class="item__title">{{ product.title }}</h2>
				<div class="item__form">
					<form class="form" action="#" method="POST">
						<div class="item__row item__row--center">
							<div class="form__counter">
								<!-- + -  -->
								<button type="button" aria-label="Убрать один товар" @click.prevent="productAmount > 1 ? productAmount-- : false">
									<svg width="12" height="12" fill="currentColor">
										<use xlink:href="#icon-minus"></use>
									</svg>
								</button>

								<input type="text" v-model.number="productAmount" name="count" />

								<button type="button" aria-label="Добавить один товар" @click.prevent="productAmount++">
									<svg width="12" height="12" fill="currentColor">
										<use xlink:href="#icon-plus"></use>
									</svg>
								</button>
							</div>

							<b class="item__price">{{ product.priceFiltered }} ₽</b>
						</div>

						<div class="item__row">
							<fieldset class="form__block">
								<legend class="form__legend">Цвет</legend>
								<ul v-if="product.colors" class="colors colors--black">
									<li v-for="(item, index) of product.colors" :key="item.id" class="colors__item">
										<label class="colors__label">
											<input
												@change.prevent="changeImage(index)"
												class="colors__radio sr-only"
												type="radio"
												v-model="checkedColor"
												name="color"
												:value="item.color.id"
												:checked="imagesRadioBtnChain[index]" />
											<span class="colors__value" :style="{ background: item.color.code }"> </span>
										</label>
									</li>
								</ul>
							</fieldset>

							<fieldset class="form__block">
								<legend class="form__legend">Размер</legend>
								<label class="form__label form__label--small form__label--select">
									<select class="form__select" type="text" name="category" v-model="checkedSize">
										<option v-for="size of product.sizes" :value="size.id">{{ size.title }}</option>
									</select>
								</label>
							</fieldset>
						</div>

						<button @click.prevent="doAddToCart" class="item__button button button--primery" type="submit">В корзину</button>
						<!-- Loaders -->
						<div v-if="productAddSending">
							Добавляем в корзину...<br />
							<img src="@/assets/Spinner-3.gif" alt="spinner loader" />
						</div>
						<div v-if="isShowAddedMessage">{{ message }}</div>
					</form>
				</div>
			</div>
			<!-- Item description -->
			<div class="item__desc">
				<ul class="tabs">
					<li class="tabs__item">
						<a @click.prevent="tabClicked(1)" class="tabs__link" :class="{ 'tabs__link--current': tabs[0] }"> Информация о товаре </a>
					</li>
					<li class="tabs__item">
						<a @click.prevent="tabClicked(2)" class="tabs__link" :class="{ 'tabs__link--current': tabs[1] }"> Доставка и возврат </a>
					</li>
				</ul>

				<div v-if="tabs[0]" class="item__content">
					<h3>Состав:</h3>

					<p v-for="material of product.materials">{{ material.code }} {{ material.title }}<br /></p>

					<h3>Уход:</h3>

					<p>
						Машинная стирка при макс. 30ºC короткий отжим<br />
						Гладить при макс. 110ºC<br />
						Не использовать машинную сушку<br />
						Отбеливать запрещено<br />
						Не подвергать химчистке<br />
					</p>
				</div>

				<div v-if="tabs[1]" class="item__content">
					<div v-for="delivery of deliveriesData">
						<h3>{{ delivery.title }}</h3>
						<p>{{ delivery.price }}</p>
					</div>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup>
	import { ref, computed, onMounted } from 'vue';
	import { useRoute } from 'vue-router';
	import { useStore } from 'vuex';
	// import BaseModal from '../components/BaseModal.vue';
	import useProduct from '@/hooks/useProduct';
	import useDeliveries from '@/hooks/useDeliveries';

	const $route = useRoute();
	const $store = useStore();
	const { product, category, fetchProduct, status } = useProduct();
	const { fetchDeliveries, deliveriesData } = useDeliveries();

	const checkedColor = ref(0);
	const checkedSize = ref(0);
	const checkedImageUrl = ref('');

	const productAmount = ref(1);
	const productAdded = ref(false);
	const productAddSending = ref(false);
	const isShowAddedMessage = ref(false);
	const message = ref('');

	const imagesRadioBtnChain = [];

	const tabs = ref([true, false]);

	const tabClicked = (index) => {
		if (index === 1) {
			tabs.value[0] = true;
			tabs.value[1] = false;
		}
		if (index === 2) {
			tabs.value[0] = false;
			tabs.value[1] = true;
		}
	};

	const doAddToCart = () => {
		productAdded.value = false;
		productAddSending.value = true;

		$store
			.dispatch('addProductToCart', {
				productId: product.value.id,
				amount: productAmount.value,
				colorId: checkedColor.value,
				sizeId: checkedSize.value,
			})
			.then(() => {
				productAdded.value = true;
				productAddSending.value = false;
				isShowAddedMessage.value = true;
				message.value = `Успешно добавили в корзину!`;
			})
			.catch((error) => {
				productAdded.value = false;
				productAddSending.value = false;
				isShowAddedMessage.value = true;
				message.value = `Добавить в корзину не удалось! ${error.response.data.error.request.sizeId}`;
			});
	};

	const changeImage = (imageIndex) => {
		const oldIndex = imagesRadioBtnChain.findIndex((el) => el);
		imagesRadioBtnChain[oldIndex] = false;
		imagesRadioBtnChain[imageIndex] = true;
		if (product.value.colors[0].gallery) {
			checkedImageUrl.value = product.value.colors[imageIndex].gallery[0].file.url;
		} else {
			// Заглушка изображения
		}
		// Синхронизируем состояние checkedColor
		checkedColor.value = product.value.colors[imageIndex].color.id;
	};

	fetchProduct($route.params.id)
		.then(() => {
			// console.log('product', product.value);
			// Initial values setup
			checkedColor.value = product.value.colors[0].color.id;
			checkedSize.value = product.value.sizes[0].id;
			if (product.value.colors[0].gallery) {
				checkedImageUrl.value = product.value.colors[0].gallery[0].file.url;
			}
			// Заглушка изображения
			else if (product.value.colors[1].gallery) {
				checkedImageUrl.value = product.value.colors[1].gallery[0].file.url;
			} else {
				// Заглушка изображения
			}
			// Initial array
			product.value.colors.forEach((el, index) => {
				if (index === 0) {
					imagesRadioBtnChain.push(true);
				} else {
					imagesRadioBtnChain.push(false);
				}
			});
		})
		.catch((error) => (status.isFailed = true));

	// Загрузка вариантов доставки
	fetchDeliveries().then((response) => {
		// console.log('response', deliveriesData);
	});
</script>
