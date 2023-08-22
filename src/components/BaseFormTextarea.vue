<template>
	<BaseFormField :title="title" :error="error">
		<textarea v-model="dataValue" class="form__input form__input--area" :placeholder="placeholder"></textarea>
	</BaseFormField>
</template>

<script>
	import { defineComponent } from 'vue';
	import formFieldMixin from '@/mixins/formFieldMixin.js';

	export default defineComponent({
		mixins: [formFieldMixin],
	});
</script>
