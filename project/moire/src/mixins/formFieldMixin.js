import BaseFormField from '@/components/BaseFormField.vue';

export default {
	components: { BaseFormField },
	props: ['title', 'error', 'placeholder', 'modelValue'],
	computed: {
		dataValue: {
			get() {
				return this.modelValue;
			},
			set(modelValue) {
				this.$emit('update:modelValue', modelValue);
			},
		},
	},
};
