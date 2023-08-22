<template>
	<ul class="catalog__pagination pagination">
		<li class="pagination__item">
			<a
				class="pagination__link pagination__link--arrow"
				href="#"
				aria-label="Предыдущая страница"
				:class="{ 'pagination__link--disabled': page <= 1 }"
				@click.prevent="paginate(page - 1)">
				<svg width="8" height="14" fill="currentColor">
					<use xlink:href="#icon-arrow-left"></use>
				</svg>
			</a>
		</li>
		<li class="pagination__item" v-for="pageNumber in pageCount" :key="pageNumber">
			<a href="#" class="pagination__link" :class="{ 'pagination__link--current': pageNumber === page }" @click.prevent="paginate(pageNumber)"> {{ pageNumber }} </a>
		</li>
		<li class="pagination__item">
			<a
				class="pagination__link pagination__link--arrow"
				href="#"
				aria-label="Следующая страница"
				:class="{ 'pagination__link--disabled': page >= pageCount }"
				@click.prevent="paginate(page + 1)">
				<svg width="8" height="14" fill="currentColor">
					<use xlink:href="#icon-arrow-right"></use>
				</svg>
			</a>
		</li>
	</ul>
</template>

<script setup>
	import { computed } from 'vue';

	const props = defineProps({
		page: Number,
		elemCount: Number,
		perPage: Number,
	});

	const emit = defineEmits(['update:page']);

	const page = computed(() => {
		return props.page;
	});

	const pageCount = computed(() => {
		return Math.ceil(props.elemCount / props.perPage);
	});

	const paginate = (page) => {
		if (page >= 1 && page <= pageCount.value) {
			emit('update:page', page);
		} else return;
	};
</script>
