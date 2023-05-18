<template>
	<BaseFormField :title="title" :error="error">
		<input v-model="dataValue" class="form__input" :type="type" :placeholder="placeholder" />
	</BaseFormField>
</template>

<script>
	import { defineComponent } from 'vue';
	import formFieldMixin from '@/mixins/formFieldMixin.js';

	export default defineComponent({
		props: {
			type: {
				default: 'text',
			},
		},
		mixins: [formFieldMixin],
	});
</script>
