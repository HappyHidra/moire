<template>
	<li class="cart__item product">
		<div class="product__pic">
			<img :src="item.color.gallery[0].file.url" width="120" height="120" :srcset="item.color.gallery[0].file.url" alt="Название товара" />
		</div>
		<h3 class="product__title">{{ item.product.title }}</h3>
		<p class="product__info product__info--color">
			Цвет:
			<span>
				<i :style="{ background: item.color.color.code }"></i>
				{{ item.color.color.title }}
			</span>
			<br />
			Размер:
			<span>
				{{ item.size.title }}
			</span>
		</p>
		<span class="product__code"> Артикул: {{ item.product.id }} </span>

		<div class="product__counter form__counter">
			<!-- - -->
			<button @click.prevent="amount > 1 ? (amount = amount - 1) : deleteProduct(item.product.id)" type="button" aria-label="Убрать один товар">
				<svg width="10" height="10" fill="currentColor">
					<use xlink:href="#icon-minus"></use>
				</svg>
			</button>

			<input type="text" :value="amount" name="count" />
			<!-- + -->
			<button @click.prevent="amount = amount + 1" type="button" aria-label="Добавить один товар">
				<svg width="10" height="10" fill="currentColor">
					<use xlink:href="#icon-plus"></use>
				</svg>
			</button>
		</div>

		<b class="product__price"> {{ item.product.price }}₽ </b>
		<!-- del -->
		<button @click.prevent="deleteProduct(item.product.id)" class="product__del button-del" type="button" aria-label="Удалить товар из корзины">
			<svg width="20" height="20" fill="currentColor">
				<use xlink:href="#icon-close"></use>
			</svg>
		</button>
		<!-- Loaders -->
		<div v-if="productRemovedSending">
			Обновляем...<br />
			<img src="@/assets/Spinner-3.gif" alt="spinner loader" />
		</div>
		<div v-if="isShowAddedMessage">{{ message }}</div>
	</li>
</template>

<script setup>
	import { ref, computed } from 'vue';
	import { useStore } from 'vuex';

	const store = useStore();

	const props = defineProps({
		item: {
			type: Object,
			required: true,
		},
	});

	// const item = ref(props.item);

	const productRemoved = ref(false);
	const productRemovedSending = ref(false);
	const isShowAddedMessage = ref(false);
	const message = ref('');

	const amount = computed({
		get() {
			return props.item.quantity;
		},
		set(value) {
			productRemoved.value = false;
			productRemovedSending.value = true;
			isShowAddedMessage.value = false;
			message.value = '';
			store
				.dispatch('updateCartProductAmount', {
					basketItemId: props.item.id,
					amount: value,
				})
				.then((resp) => {
					productRemoved.value = true;
					productRemovedSending.value = false;
					message.value = 'Обновили успешно!';
					isShowAddedMessage.value = true;
				})
				.catch((error) => {
					productRemoved.value = false;
					productRemovedSending.value = false;
					message.value = `Обновить корзину не удалось! ${error}`;
					isShowAddedMessage.value = true;
				});
		},
	});

	const deleteProduct = () => {
		productRemoved.value = false;
		productRemovedSending.value = true;
		store
			.dispatch('deleteCartProduct', { basketItemId: props.item.id })
			.then((resp) => {
				productRemoved.value = true;
				productRemovedSending.value = false;
				isShowAddedMessage.value = true;
			})
			.catch((error) => {
				productRemoved.value = false;
				productRemovedSending.value = false;
				isShowAddedMessage.value = true;
				message.value = `Удалить из корзины не удалось! ${error}`;
			});
	};
</script>
