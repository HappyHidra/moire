<template>
	<main v-if="preloader" class="content container">
		<div>
			Получение данных...<br />
			<img src="@/assets/Spinner-3.gif" />
		</div>
	</main>
	<main v-if="errorMessage" class="content container">
		<div class="cart__error form__error-block">
			<h4>Данные о заказе неудалось получить! {{ errorMessage }}</h4>
			<p>Похоже произошла ошибка. Попробуйте ерезагрузите страницу.</p>
		</div>
	</main>

	<main v-else-if="orderData.id" class="content container">
		<div class="content__top">
			<ul class="breadcrumbs">
				<li class="breadcrumbs__item">
					<router-link class="breadcrumbs__link" :to="{ name: 'main' }"> Каталог </router-link>
				</li>
				<li class="breadcrumbs__item">
					<router-link class="breadcrumbs__link" :to="{ name: 'cart' }"> Корзина </router-link>
				</li>
				<li class="breadcrumbs__item">
					<a class="breadcrumbs__link"> Оформление заказа </a>
				</li>
			</ul>

			<h1 class="content__title">
				Заказ оформлен <span>№ {{ orderData.id }}</span>
			</h1>
		</div>

		<section class="cart">
			<form class="cart__form form" action="#" method="POST">
				<div class="cart__field">
					<p class="cart__message">
						Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа. Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения
						деталей доставки.
					</p>

					<ul class="dictionary">
						<li class="dictionary__item">
							<span class="dictionary__key"> Получатель </span>
							<span class="dictionary__value"> {{ orderData.name }} </span>
						</li>
						<li class="dictionary__item">
							<span class="dictionary__key"> Адрес доставки </span>
							<span class="dictionary__value"> {{ orderData.address }} </span>
						</li>
						<li class="dictionary__item">
							<span class="dictionary__key"> Телефон </span>
							<span class="dictionary__value"> {{ orderData.phone }} </span>
						</li>
						<li class="dictionary__item">
							<span class="dictionary__key"> Email </span>
							<span class="dictionary__value"> {{ orderData.email }} </span>
						</li>
						<li class="dictionary__item">
							<span class="dictionary__key"> Способ оплаты </span>
							<span class="dictionary__value"> {{ orderData.paymentType }} </span>
						</li>
					</ul>
				</div>

				<div class="cart__block">
					<ul class="cart__orders">
						<li v-if="orderData.basket" v-for="item in orderData.basket.items" class="cart__order" :key="item.id">
							<h3>{{ item.product.title }} <b>размер</b> {{ item.size.title }}</h3>
							<b>{{ item.price }} ₽</b>
							{{ item.quantity }} шт.
							<span>Артикул: {{ item.product.id }}</span>
						</li>
					</ul>

					<div class="cart__total">
						<p>
							Доставка: <b>{{ orderData.deliveryType.title }} {{ orderData.deliveryType.price }} ₽</b>
						</p>
						<p>
							Итого: <b>{{ productsAmount }}</b> товара на сумму <b>{{ totalAmount }} ₽</b>
						</p>
					</div>
				</div>
			</form>
		</section>
	</main>
</template>

<script setup>
	import { ref, reactive, computed } from 'vue';
	import { useStore } from 'vuex';
	import { useRouter } from 'vue-router';

	const store = useStore();
	const router = useRouter();

	const preloader = ref(true);
	const errorMessage = ref('');
	let orderData = reactive({});

	store
		.dispatch('loadOrderInfo', { id: router.currentRoute.value.params.id })
		.then((resp) => {
			Object.assign(orderData, resp);
			errorMessage.value = '';
			preloader.value = false;
		})
		.catch((error) => {
			preloader.value = false;
			errorMessage.value = error;
		});

	const productsAmount = computed(() => (orderData.basket ? orderData.basket.items.reduce((acc, item) => item.quantity + acc, 0) : 0));

	const totalAmount = computed(() =>
		orderData.basket ? orderData.basket.items.reduce((acc, item) => item.price * item.quantity + acc, 0) + Number(orderData.deliveryType.price) : 0
	);
</script>
