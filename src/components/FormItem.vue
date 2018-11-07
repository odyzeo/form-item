<template>
  <div
    :class="['form-item', {
      'form-item--filled': localValue && localValue.length > 0,
      'form-item--error': errors.length || (formErrors.length && showFormErrors),
      'form-item--no-label': !input.label || input.type === 'file'
  }]">
    <div :class="['form-item__field', {'form-item__field--empty': localValue === ''}]">
      <div
        v-if="isTextArea && input.label"
        :class="['form-item__hider', {'form-item__hider--empty': localValue === ''}]"
      />
      <textarea
        v-if="isTextArea"
        ref="input"
        :class="['form-item__input', {'form-item__input--empty': localValue === ''}]"
        v-model="localValue"
        :id="uid"
        :name="input.name"
        :required="input.required"
        :readonly="input.readonly"
        :autocomplete="autocomplete"
        :rows="input.rows"
        :placeholder="input.placeholder"
        @focus="focus"
        @blur="blur"
        @input="change"
        @keydown="keydown"
      />
      <input
        v-else
        ref="input"
        :class="['form-item__input', {'form-item__input--empty': localValue === ''}]"
        v-model="localValue"
        :id="uid"
        :type="type"
        :name="input.name"
        :required="input.required"
        :readonly="input.readonly"
        :autocomplete="autocomplete"
        :placeholder="input.placeholder"
        :accept="input.accept"
        @focus="focus"
        @blur="blur"
        @input="change"
        @keydown="keydown"
      >
      <label
        v-if="input.label && input.type !== 'file'"
        :for="uid"
        :class="['form-item__label', { 'form-item__label--with-placeholder': input.placeholder }]"
      >
        {{ input.label }}
      </label>
    </div>
    <div
      v-for="(error, key) in errors"
      :key="`fe_error_${key}`"
      class="form-item__error"
      v-html="error"
    />
    <div v-if="showFormErrors">
      <div
        v-for="(error, key) in formErrors"
        :key="`be_error_${key}`"
        class="form-item__error"
        v-html="error"
      />
    </div>
  </div>
</template>

<script>
import VALIDATORS from '@/constants/validators';

export default {
  props: {
    input: {
      type: Object,
      required: true,
    },
    formErrors: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
      default: '',
    },
    msgRequired: {
      type: String,
      default: 'This field is required',
    },
  },
  data() {
    const autocomplete = this.input.autocomplete || 'off';
    const type = this.input.type || 'text';

    return {
      autocomplete,
      type,
      localValue: this.value || '',
      errors: [],
      validating: false,
      isTextArea: type === 'textarea',
      showFormErrors: !!this.formErrors,
    };
  },
  computed: {
    uid() {
      return `form-item-${this._uid}`;
    },
  },
  watch: {
    value(n, o) {
      this.localValue = n;
      if (typeof o !== 'undefined' && n !== o) {
        this.showFormErrors = false;
      }
    },
    formErrors() {
      this.showFormErrors = true;
    },
  },
  methods: {
    focus() {
      this.$emit('focus');
    },
    blur() {
      this.validate();
      this.$emit('blur');
    },
    validate(scroll = false) {
      this.errors = [];
      if (this.localValue && this.localValue.length === 0) {
        if (this.input.required) {
          this.errors.push(this.msgRequired);
        }
      } else if (this.input.validators) {
        this.input.validators.forEach((rawValidator) => {
          const [command, rawAttrs] = rawValidator.split(':');
          const attrs = rawAttrs ? rawAttrs.split(',') : [];
          const validator = VALIDATORS[command];
          if (!validator.test(this.localValue, attrs, this.$refs.input)) {
            this.errors.push(validator.message.replace(/\$(\d+)/g, (match, number) => attrs[+number]));
          }
        });
      }
      if (scroll && this.errors.length) {
        this.$el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    },
    change() {
      this.$emit('input', this.localValue);
    },
    keydown(event) {
      this.$emit('keydown', event);
    },
  },
};
</script>

<style lang="less">
@import '../less/item.less';
</style>
