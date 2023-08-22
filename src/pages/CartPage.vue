<template>
	<main class="content container">
		<div class="content__top">
			<ul class="breadcrumbs">
				<li class="breadcrumbs__item">
					<router-link class="breadcrumbs__link" :to="{ name: 'main' }"> Каталог </router-link>
				</li>
				<li class="breadcrumbs__item">
					<a class="breadcrumbs__link"> Корзина </a>
				</li>
			</ul>

			<div class="content__row">
				<h1 class="content__title">Корзина</h1>
				<span class="content__info"> {{ store.state.cartProductsData.length }} товара </span>
			</div>
		</div>

		<section class="cart">
			<form class="cart__form form" action="#" method="POST">
				<div class="cart__field">
					<ul class="cart__list">
						<CartItem v-for="item in cartData" :key="item.product.id" :item="item" />
					</ul>
				</div>

				<div class="cart__block">
					<p class="cart__desc">Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе</p>
					<p class="cart__price">
						Итого: <span>{{ totalAmount }} ₽</span>
					</p>

					<button @click.prevent="toOrderPage" v-show="store.state.cartProductsData.length > 0" class="cart__button button button--primery" type="submit">Оформить заказ</button>
				</div>
			</form>
		</section>
	</main>
</template>

<script setup>
	import { computed } from 'vue';
	import { useStore } from 'vuex';
	import { useRouter } from 'vue-router';
	import CartItem from '@/components/CartItem.vue';

	const store = useStore();
	const router = useRouter();

	const cartData = computed(() => store.state.cartProductsData);
	const totalAmount = computed(() => store.getters.cartTotalPrice);

	const toOrderPage = () => {
		router.push({ name: 'order' });
	};
</script>
