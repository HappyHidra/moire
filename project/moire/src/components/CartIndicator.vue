<template>
	<router-link class="header__cart" href="cart.html" aria-label="Корзина с товарами" :to="{ name: 'cart' }">
		<svg v-if="store.state.cartProductsData" width="19" height="24">
			<use xlink:href="#icon-cart"></use>
		</svg>
		<div v-else>
			<span>Загрузка товаров...</span>
			<img src="@/assets/Spinner-3.gif" />
		</div>
		<span class="header__count" aria-label="Количество товаров">{{ store.state.cartProductsData.length }}</span>
	</router-link>
</template>

<script setup>
	import { useStore } from 'vuex';
	const store = useStore();
</script>
