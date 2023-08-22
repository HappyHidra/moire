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

<script setup>
	import { ref, reactive, computed, watch } from 'vue';
	import axios from 'axios';
	import { API_BASE_URL } from '@/config.js';

	const props = defineProps({
		categoryId: Number,
		materialIds: Array,
		seasonIds: Array,
		colorIds: Array,
		priceFrom: Number,
		priceTo: Number,
	});

	const emit = defineEmits(['update:categoryId', 'update:materialIds', 'update:seasonIds', 'update:colorIds', 'update:priceFrom', 'update:priceTo']);

	const currentCategoryId = ref(0);
	const currentMaterialIds = ref([]);
	const currentSeasonIds = ref([]);
	const currentColorIds = ref([]);
	const currentPriceFrom = ref(null);
	const currentPriceTo = ref(null);
	const categoriesData = ref(null);
	const colorsData = ref(null);
	const seasonsData = ref(null);
	const materialsData = ref(null);
	const colorsState = ref([]);
	const seasonsState = ref([]);
	const materialsState = ref([]);

	const loadCategories = () => {
		axios.get(API_BASE_URL + `/api/productCategories`).then((response) => (categoriesData.value = response.data));
	};

	const loadColors = () => {
		axios.get(API_BASE_URL + `/api/colors`).then((response) => (colorsData.value = response.data));
	};

	const loadMaterials = () => {
		axios.get(API_BASE_URL + `/api/materials`).then((response) => (materialsData.value = response.data));
	};

	const loadSeasons = () => {
		axios.get(API_BASE_URL + `/api/seasons`).then((response) => (seasonsData.value = response.data));
	};

	const submit = () => {
		emit('update:categoryId', currentCategoryId.value);
		// Здесь событие присваивает реактивную ссылку на массив currentMaterialIds  в materialIds,
		// нужно сделать копию спред оператором чтобы избежать реактивности  (currentMaterialIds.value реактивно и ссылка другая)
		emit('update:materialIds', [...currentMaterialIds.value]);
		// Здесь реактивность currentSeasonIds.value
		emit('update:seasonIds', [...currentSeasonIds.value]);
		// Здесь реактивность currentColorIds.value
		emit('update:colorIds', [...currentColorIds.value]);
		emit('update:priceFrom', currentPriceFrom.value);
		emit('update:priceTo', currentPriceTo.value);
	};

	const reset = () => {
		emit('update:categoryId', 0);
		emit('update:materialIds', []);
		emit('update:seasonIds', []);
		emit('update:colorIds', []);
		emit('update:priceFrom', 0);
		emit('update:priceTo', 0);
		colorsState.value = [];
		seasonsState.value = [];
		materialsState.value = [];
		currentMaterialIds.value = [];
		currentColorIds.value = [];
		currentSeasonIds.value = [];
		currentPriceFrom.value = null;
		currentPriceTo.value = null;
		currentCategoryId.value = 0;
	};

	const toggleColor = (id, currentStatus, colorIndex) => {
		let newStatus;
		let index = currentColorIds.value.findIndex((colorId) => colorId === id);
		if (!currentStatus && index === -1) {
			newStatus = true;
			currentColorIds.value.push(id);
		} else {
			newStatus = false;
			currentColorIds.value.splice(index, 1);
		}
		colorsState.value[colorIndex] = newStatus;
	};

	const toggleSeason = (id, currentStatus, seasonIndex) => {
		let newStatus;
		let index = currentSeasonIds.value.findIndex((seasonId) => seasonId === id);

		if (!currentStatus && index === -1) {
			newStatus = true;
			currentSeasonIds.value.push(id);
		} else {
			newStatus = false;
			currentSeasonIds.value.splice(index, 1);
		}
		seasonsState.value[seasonIndex] = newStatus;
	};

	const toggleMaterial = (id, currentStatus, materialIndex) => {
		let newStatus;
		let index = currentMaterialIds.value.findIndex((materialId) => materialId === id);
		if (!currentStatus && index === -1) {
			newStatus = true;
			currentMaterialIds.value.push(id);
		} else {
			newStatus = false;
			currentMaterialIds.value.splice(index, 1);
		}
		materialsState.value[materialIndex] = newStatus;
	};

	const categories = computed(() => {
		return categoriesData.value ? categoriesData.value.items : [];
	});

	const colors = computed(() => {
		return colorsData.value ? colorsData.value.items : [];
	});

	const materials = computed(() => {
		return materialsData.value ? materialsData.value.items : [];
	});

	const seasons = computed(() => {
		return seasonsData.value ? seasonsData.value.items : [];
	});

	const filtersActive = computed(() => {
		return props.categoryId !== 0 || props.materialIds.length !== 0 || props.seasonIds.length !== 0 || props.colorIds.length !== 0 || props.priceFrom !== 0 || props.priceTo !== 0;
	});

	const initialState = () => {
		colorsData.value
			? colorsData.value.items.forEach(() => {
					colorsState.value.push(false);
			  })
			: [];
		seasonsData.value
			? seasonsData.value.items.forEach(() => {
					seasonsState.value.push(false);
			  })
			: [];
		materialsData.value
			? materialsData.value.items.forEach(() => {
					materialsState.value.push(false);
			  })
			: [];
	};
	initialState();

	watch(props.categoryId, {
		handler: function (newValue) {
			currentCategoryId.value = newValue;
		},
	});

	// Хз зачем нужно ещё покапаться , особо не нужно вроде
	// watch(props.materialIds, {
	// 	handler: function (newValue) {
	// 		currentMaterialIds.value = newValue;
	// 	},
	// 	deep: true,
	// });

	// watch(props.seasonIds, {
	// 	handler: function (newValue) {
	// 		currentSeasonIds.value = newValue;
	// 	},
	// 	deep: true,
	// });

	// watch(props.colorIds, {
	// 	handler: function (newValue) {
	// 		currentColorIds.value = newValue;
	// 	},
	// 	deep: true,
	// });

	watch(props.priceFrom, {
		handler: function (newValue) {
			currentPriceFrom.value = newValue;
		},
	});
	watch(props.currentPriceTo, {
		handler: function (newValue) {
			currentPriceTo.value = newValue;
		},
	});

	loadCategories();
	loadColors();
	loadMaterials();
	loadSeasons();
</script>
