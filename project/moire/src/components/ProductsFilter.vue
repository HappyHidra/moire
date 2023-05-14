<template>
	<aside class="">
		<form class="__form form" action="#" method="get" @submit.prevent="submit">
			<fieldset class="form__block">
				<legend class="form__legend">Цена</legend>
				<label class="form__label form__label--price">
					<input class="form__input" type="text" name="min-price" v-model.number="currentPriceFrom" />
					<span class="form__value">От</span>
				</label>
				<label class="form__label form__label--price">
					<input class="form__input" type="text" name="max-price" v-model.number="currentPriceTo" />
					<span class="form__value">До</span>
				</label>
			</fieldset>

			<fieldset class="form__block">
				<legend class="form__legend">Категория</legend>
				<label class="form__label form__label--select">
					<select class="form__select" type="text" name="category" v-model.number="currentCategoryId">
						<option value="0">Все категории</option>
						<option :value="category.id" v-for="category of categories" :key="category.id">
							{{ category.title }}
						</option>
					</select>
				</label>
			</fieldset>

			<fieldset class="form__block">
				<legend class="form__legend">Цвет</legend>
				<ul class="colors colors--black">
					<li class="colors__item" v-for="(color, colorIndex) of colors" :key="color.id">
						<label class="colors__label">
							<input
								class="colors__radio sr-only"
								type="radio"
								:name="color.id"
								:checked="colorsState[colorIndex]"
								:value="colorsState[colorIndex]"
								v-model="colorsState[colorIndex]"
								@click="toggleColor(color.id, colorsState[colorIndex], colorIndex)" />
							<span class="colors__value" :style="{ background: color.code }"> </span>
						</label>
					</li>
				</ul>
			</fieldset>

			<fieldset class="form__block">
				<legend class="form__legend">Материал</legend>
				<ul class="check-list">
					<li v-for="(material, materialIndex) of materials" class="check-list__item" :key="`m${material.id}`">
						<label class="check-list__label">
							<input
								class="check-list__check sr-only"
								type="checkbox"
								name="material"
								v-model="materialsState[materialIndex]"
								@click="toggleMaterial(material.id, materialsState[materialIndex], materialIndex)" />
							<span class="check-list__desc">
								{{ material.title }}
								<span>({{ material.productsCount }})</span>
							</span>
						</label>
					</li>
				</ul>
			</fieldset>

			<fieldset class="form__block">
				<legend class="form__legend">Коллекция</legend>
				<ul class="check-list">
					<li v-for="(season, seasonIndex) of seasons" class="check-list__item" :key="`s${season.id}`">
						<label class="check-list__label">
							<input
								class="check-list__check sr-only"
								type="checkbox"
								name="collection"
								v-model="seasonsState[seasonIndex]"
								@click="toggleSeason(season.id, seasonsState[seasonIndex], seasonIndex)" />
							<span class="check-list__desc">
								{{ season.title }}
								<span>({{ season.productsCount }})</span>
							</span>
						</label>
					</li>
				</ul>
			</fieldset>

			<button class="__submit button button--primery" type="submit">Применить</button>
			<button v-if="filtersActive" class="__reset button button--second" type="button" @click.prevent="reset">Сбросить</button>
		</form>
	</aside>
</template>

<script>
	import { defineComponent, ref } from 'vue';
	import axios from 'axios';
	import { API_BASE_URL } from '@/config.js';

	export default defineComponent({
		props: {
			categoryId: Number,
			materialIds: Array,
			seasonIds: Array,
			colorIds: Array,
			priceFrom: Number,
			priceTo: Number,
		},
		data() {
			return {
				currentCategoryId: 0,
				currentMaterialIds: [],
				currentSeasonIds: [],
				currentColorIds: [],
				currentPriceFrom: 0,
				currentPriceTo: 0,
				categoriesData: null,
				colorsData: null,
				seasonsData: null,
				materialsData: null,
				colorsState: [],
				seasonsState: [],
				materialsState: [],
			};
		},
		methods: {
			loadCategories() {
				axios.get(API_BASE_URL + `/api/productCategories`).then((response) => (this.categoriesData = response.data));
			},
			loadColors() {
				axios.get(API_BASE_URL + `/api/colors`).then((response) => (this.colorsData = response.data));
			},
			loadMaterials() {
				axios.get(API_BASE_URL + `/api/materials`).then((response) => (this.materialsData = response.data));
			},
			loadSeasons() {
				axios.get(API_BASE_URL + `/api/seasons`).then((response) => (this.seasonsData = response.data));
			},
			submit() {
				this.$emit('update:categoryId', this.currentCategoryId);
				this.$emit('update:materialIds', this.currentMaterialIds);
				this.$emit('update:seasonIds', this.currentSeasonIds);
				this.$emit('update:colorIds', this.currentColorIds);
				this.$emit('update:priceFrom', this.currentPriceFrom);
				this.$emit('update:priceTo', this.currentPriceTo);
			},
			reset() {
				this.$emit('update:categoryId', 0);
				this.$emit('update:materialIds', []);
				this.$emit('update:seasonIds', []);
				this.$emit('update:colorIds', []);
				this.$emit('update:priceFrom', 0);
				this.$emit('update:priceTo', 0);
				this.colorsState = [];
				this.seasonsState = [];
				this.materialsState = [];
			},
			toggleColor(id, currentStatus, colorIndex) {
				let newStatus;
				let index = this.currentColorIds.findIndex((colorId) => colorId === id);
				if (!currentStatus && index === -1) {
					newStatus = true;
					this.currentColorIds.push(id);
				} else {
					newStatus = false;
					this.currentColorIds.splice(index, 1);
				}
				this.colorsState[colorIndex] = newStatus;
			},
			toggleSeason(id, currentStatus, seasonIndex) {
				let newStatus;
				let index = this.currentSeasonIds.findIndex((seasonId) => seasonId === id);

				if (!currentStatus && index === -1) {
					newStatus = true;
					this.currentSeasonIds.push(id);
				} else {
					newStatus = false;
					this.currentSeasonIds.splice(index, 1);
				}
				this.seasonsState[seasonIndex] = newStatus;
			},
			toggleMaterial(id, currentStatus, materialIndex) {
				let newStatus;
				let index = this.currentMaterialIds.findIndex((materialId) => materialId === id);
				if (!currentStatus && index === -1) {
					console.log('NOT Current status: ', !currentStatus);
					console.log('Index', index);
					newStatus = true;
					this.currentMaterialIds.push(id);
				} else {
					newStatus = false;
					this.currentMaterialIds.splice(index, 1);
				}
				this.materialsState[materialIndex] = newStatus;
			},
		},
		computed: {
			categories() {
				return this.categoriesData ? this.categoriesData.items : [];
			},
			colors() {
				return this.colorsData ? this.colorsData.items : [];
			},
			materials() {
				return this.materialsData ? this.materialsData.items : [];
			},
			seasons() {
				return this.seasonsData ? this.seasonsData.items : [];
			},
			filtersActive() {
				return this.categoryId !== 0 || this.materialIds.length !== 0 || this.seasonIds.length !== 0 || this.colorIds.length !== 0 || this.priceFrom !== 0 || this.priceTo !== 0;
			},
			initialState() {
				this.colorsData
					? this.colorsData.items.forEach(() => {
							this.colorsState.push(false);
					  })
					: [];
				this.seasonsData
					? this.seasonsData.items.forEach(() => {
							this.seasonsState.push(false);
					  })
					: [];
				this.materialsData
					? this.materialsData.items.forEach(() => {
							this.materialsState.push(false);
					  })
					: [];
			},
		},
		watch: {
			categoryId(newValue) {
				this.currentCategoryId = newValue;
			},
			materialIds(newValue) {
				this.currentMaterialIds = newValue;
			},
			seasonIds(newValue) {
				this.currentSeasonIds = newValue;
			},
			colorIds(newValue) {
				this.currentColorIds = newValue;
			},
			priceFrom(newValue) {
				this.currentPriceFrom = newValue;
			},
			priceTo(newValue) {
				this.currentPriceTo = newValue;
			},
		},

		created() {
			this.loadCategories();
			this.loadColors();
			this.loadMaterials();
			this.loadSeasons();
		},
	});
</script>
