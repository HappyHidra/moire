<template>
	<main class="content container">
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

			<div class="content__row">
				<h1 class="content__title">Оформление заказа</h1>
			</div>
		</div>

		<section class="cart">
			<form class="cart__form form" action="#" method="POST" @submit.prevent="makeOrder">
				<div class="cart__field">
					<div class="cart__data">
						<BaseFormText title="ФИО" :error="formError.name" placeholder="Введите ваше полное имя" v-model="formData.name" />
						<BaseFormText title="Адрес доставки" :error="formError.address" placeholder="Введите ваш адрес" v-model="formData.address" />
						<BaseFormText title="Телефон" type="tel" :error="formError.phone" placeholder="Введите ваш телефон" v-model="formData.phone" />
						<BaseFormText title="Email" type="email" :error="formError.email" placeholder="Введи ваш Email" v-model="formData.email" />
						<BaseFormTextarea title="Комментарий к заказу" :error="formError.comment" placeholder="Ваши пожелания" v-model="formData.comment" />
					</div>

					<div class="cart__options">
						<h3 class="cart__title">Доставка</h3>
						<ul class="cart__options options">
							<li class="options__item">
								<label class="options__label">
									<input @click="deliveryChoice('pickup')" class="options__radio sr-only" type="radio" name="delivery" value="0" checked="" />
									<span class="options__value"> Самовывоз <b>бесплатно</b> </span>
								</label>
							</li>
							<li class="options__item">
								<label class="options__label">
									<input @click="deliveryChoice('courier')" class="options__radio sr-only" type="radio" name="delivery" value="500" />
									<span class="options__value"> Курьером <b>1200 ₽</b> </span>
								</label>
							</li>
						</ul>

						<h3 class="cart__title">Оплата</h3>
						<ul class="cart__options options">
							<li class="options__item">
								<label class="options__label">
									<input @click="paymentChoice('card')" class="options__radio sr-only" type="radio" name="pay" value="card" checked="" />
									<span class="options__value"> Картой при получении </span>
								</label>
							</li>
							<li class="options__item">
								<label class="options__label">
									<input @click="paymentChoice('cash')" class="options__radio sr-only" type="radio" name="pay" value="cash" />
									<span class="options__value"> Наличными при получении </span>
								</label>
							</li>
						</ul>
					</div>
				</div>

				<div class="cart__block">
					<ul class="cart__orders">
						<li v-for="item of cartData" class="cart__order" :key="item.id">
							<h3>
								{{ item.product.title }} <br />
								<b>Размер:</b> {{ item.size.title }}<br />
								<b>Цвет: </b> {{ item.color.color.title }}<br />
								<b>Кол-во: </b>{{ item.quantity }} шт.
							</h3>
							<b> {{ item.product.price }} ₽</b>
							<span>Артикул: {{ item.product.id }}</span>
						</li>
					</ul>

					<div class="cart__total">
						<p>
							{{ deliveryMethodMessage }}: <b>{{ deliveryCostMessage }}</b>
						</p>
						<p>
							Итого: <b> {{ productsAmount }}</b> товара на сумму <b>{{ totalAmount }} ₽</b>
						</p>
					</div>

					<button class="cart__button button button--primery" type="submit">Оформить заказ</button>
				</div>
				<div v-if="preloader">
					Отправка заявки...<br />
					<img src="@/assets/Spinner-3.gif" />
				</div>
				<div class="cart__error form__error-block" v-if="formErrorMessage">
					<h4>Заявка не отправлена!</h4>
					<p>Похоже произошла ошибка. Попробуйте отправить снова или перезагрузите страницу.</p>
					<br />
					{{ formErrorMessage }}
				</div>
			</form>
		</section>
	</main>
</template>

<script setup>
	import { ref, computed } from 'vue';
	import { useStore } from 'vuex';
	import { useRouter } from 'vue-router';
	import BaseFormText from '@/components/BaseFormText.vue';
	import BaseFormTextarea from '@/components/BaseFormTextarea.vue';

	const store = useStore();
	const router = useRouter();

	const deliveryMethod = ref(1);
	const paymentMethod = ref(1);

	const deliveryMethodMessage = ref('Самовывоз');
	const deliveryCostMessage = ref('бесплатно');

	const deliveryChoice = (type) => {
		if (type === 'pickup') {
			deliveryMethod.value = 1;
			deliveryMethodMessage.value = 'Самовывоз';
			deliveryCostMessage.value = 'бесплатно';
		}
		if (type === 'courier') {
			deliveryMethod.value = 2;
			deliveryMethodMessage.value = 'Доставка';
			deliveryCostMessage.value = '1200 ₽';
		}
	};

	const paymentChoice = (type) => {
		if (type === 'card') {
			paymentMethod.value = 1;
		}
		if (type === 'cash') {
			paymentMethod.value = 2;
		}
	};

	// Order
	const preloader = ref(false);
	const formErrorMessage = ref('');
	const formData = ref({});
	const formError = ref({});

	const makeOrder = () => {
		formError.value = {};
		formErrorMessage.value = '';
		preloader.value = true;
		store
			.dispatch('makeOrder', { ...formData.value, deliveryTypeId: deliveryMethod.value, paymentTypeId: paymentMethod.value })
			.then((response) => {
				preloader.value = false;
				store.dispatch('loadCart');
				router.push({ name: 'orderInfo', params: { id: response.data.id } });
			})
			.catch((error) => {
				preloader.value = false;
				formError.value = error.response.data.error.request || {};
				formErrorMessage.value = error.response.data.error.request.paymentTypeId;
			});
	};

	const cartData = computed(() => store.state.cartProductsData);

	const productsAmount = computed(() => store.getters.productsAmount);

	const totalAmount = computed(() => {
		if (deliveryMethod.value === 1) {
			return store.getters.cartTotalPrice;
		} else {
			return store.getters.cartTotalPrice + 1200;
		}
	});
</script>
