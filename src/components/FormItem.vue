<template>
  <div
    class="form-item"
    :class="{
      'form-item--filled': isFilled,
      'form-item--error': isErrorClass,
      'form-item--no-label': !showLabel,
    }"
  >
    <div class="form-item__field">
      <slot name="prepend"></slot>
      <div
        class="form-item__hider"
        v-if="showHider"
      ></div>
      <div class="form-item__wrapper">
        <textarea
          class="form-item__input"
          :class="inputClass"
          v-if="isTextArea"
          ref="input"
          v-model="localValue"
          :id="uid"
          :name="input.name"
          :required="input.required"
          :readonly="input.readonly"
          :autocomplete="autocomplete"
          :rows="input.rows"
          :placeholder="input.placeholder"
          v-bind="bindToInput"
          @focus="focus"
          @blur="blur"
          @input="change"
          @keydown="keydown"
        ></textarea>
        <input
          class="form-item__input"
          :class="inputClass"
          v-else
          ref="input"
          v-model="localValue"
          :id="uid"
          :type="type"
          :name="input.name"
          :required="input.required"
          :readonly="input.readonly"
          :autocomplete="autocomplete"
          :placeholder="input.placeholder"
          :accept="input.accept"
          :pattern="input.pattern"
          v-bind="bindToInput"
          @focus="focus"
          @blur="blur"
          @input="change"
          @keydown="keydown"
        >
        <label
          class="form-item__label"
          v-if="showLabel"
          :for="uid"
        >
          {{ input.label }}
        </label>
      </div>
      <slot name="append"></slot>
    </div>
    <slot name="result"></slot>
    <div
      class="form-item__error"
      v-for="(error, key) in errors"
      :key="`fe_error_${key}`"
      v-html="error"
    ></div>
    <div v-if="showFormErrors">
      <div
        class="form-item__error"
        v-for="(error, key) in formErrors"
        :key="`be_error_${key}`"
        v-html="error"
      ></div>
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
      type: [Array, Object],
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
    bindToInput: {
      type: Object,
      default: () => {},
    },
    inputClass: {
      type: String,
      default: '',
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
    isFilled() {
      return typeof this.localValue !== 'undefined' && `${this.localValue}`.length > 0;
    },
    isErrorClass() {
      return this.errors.length || (this.formErrors.length && this.showFormErrors);
    },
    showLabel() {
      return this.input.label && this.input.type !== 'file';
    },
    showHider() {
      return this.isTextArea && this.input.label;
    },
  },
  watch: {
    value(n) {
      this.localValue = (typeof n === 'undefined') ? '' : n;
      /**
       * When value change hide errors.
       * @type {boolean}
       */
      this.showFormErrors = false;
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
      if (
        this.input.required &&
        (
          this.localValue === null || this.localValue === ''
        )
      ) {
        this.errors.push(this.msgRequired);
      } else if (
        this.localValue !== null &&
        this.localValue !== '' &&
        this.input.validators
      ) {
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
@import '../less/form-item.less';
</style>
