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

<script>
	import { defineComponent } from 'vue';

	export default defineComponent({
		props: ['modelValue', 'elemCount', 'perPage'],
		computed: {
			page() {
				return this.modelValue;
			},
			pageCount() {
				return Math.ceil(this.elemCount / this.perPage);
			},
		},
		methods: {
			paginate(page) {
				if (page >= 1 && page <= this.pageCount) {
					this.$emit('update:modelValue', page);
				} else return;
			},
		},
	});
</script>
