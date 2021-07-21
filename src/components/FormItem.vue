<template>
    <div
        :class="{
            'form-item--filled': isFilled,
            'form-item--error': isErrorClass,
            'form-item--no-label': !showLabel,
            'form-item--required': isRequired,
            'form-item--readonly': isReadonly,
            'form-item--hidden': isHidden,
            'form-item--disabled': isDisabled,
        }"
        class="form-item"
    >
        <div class="form-item__field">
            <slot name="prepend"></slot>

            <div
                v-if="showHider"
                class="form-item__hider"
            ></div>

            <label
                :for="input.id"
                class="form-item__wrapper"
            >
                <textarea
                    v-if="isTextArea"
                    :id="input.id"
                    ref="input"
                    v-model="localValue"
                    :autocomplete="autocomplete"
                    :class="inputClass"
                    :name="input.name"
                    :placeholder="translate(input.placeholder)"
                    :readonly="isReadonly"
                    :required="isRequired"
                    :disabled="isDisabled"
                    :autofocus="input.autofocus"
                    :rows="input.rows"
                    v-bind="bindToInput"
                    class="form-item__input"
                    @blur="blur"
                    @focus="focus"
                    @input="change"
                    @keydown="keydown"
                ></textarea>

                <input
                    v-else
                    :id="input.id"
                    ref="input"
                    v-model="localValue"
                    :accept="input.accept"
                    :autocomplete="autocomplete"
                    :class="inputClass"
                    :multiple="input.multiple"
                    :name="input.name"
                    :pattern="input.pattern"
                    :step="input.step"
                    :min="input.min"
                    :max="input.max"
                    :placeholder="translate(input.placeholder)"
                    :readonly="isReadonly"
                    :disabled="isDisabled"
                    :required="isRequired"
                    :autofocus="input.autofocus"
                    :type="type"
                    v-bind="bindToInput"
                    class="form-item__input"
                    @blur="blur"
                    @focus="focus"
                    @input="change"
                    @keydown="keydown"
                >

                <span
                    v-if="showLabel"
                    class="form-item__label"
                >
                    {{ translate(input.label) }}
                </span>
            </label>

            <slot name="append"></slot>
        </div>

        <slot name="result"></slot>

        <form-errors
            v-if="showFormErrors"
            :form-errors="formErrors"
        ></form-errors>
        <form-errors
            v-else
            :form-errors="errors"
        ></form-errors>
    </div>
</template>

<script>
import VALIDATORS from '../constants/validators';
import FormErrors from './FormErrors';

export default {
    components: { FormErrors },
    props: {
        groupName: {
            type: String,
            default: '',
        },
        input: {
            type: Object,
            required: true,
        },
        formErrors: {
            type: [Array, Object],
            default: () => ([]),
        },
        value: {
            type: [String, Number, Boolean, Date, Symbol],
            default: '',
        },
        bindToInput: {
            type: Object,
            default: null,
        },
        inputClass: {
            type: String,
            default: '',
        },
        trans: {
            type: Function,
            default: null,
        },
    },
    data() {
        return {
            localValue: this.value != null ? this.value : '',
            errors: [],
            showFormErrors: (this.formErrors.length > 0),
            hadErrorState: false,
            inputValidators: null,
        };
    },
    computed: {
        autocomplete() {
            return this.input.autocomplete || 'off';
        },
        type() {
            return this.input.type || 'text';
        },
        isTextArea() {
            return this.type === 'textarea';
        },
        isFilled() {
            return typeof this.localValue !== 'undefined' && `${this.localValue}`.length > 0;
        },
        isErrorClass() {
            return this.errors.length || (this.formErrors.length && this.showFormErrors);
        },
        isHidden() {
            return this.type === 'hidden';
        },
        isReadonly() {
            return this.input.readonly;
        },
        isDisabled() {
            return this.input.disabled;
        },
        isRequired() {
            return this.input.required;
        },
        showLabel() {
            return this.input.label && this.type !== 'file';
        },
        showHider() {
            return this.isTextArea && this.input.label;
        },
        validatorEvent() {
            return this.input.validatorEvent || 'none';
        },
        requiredMessage() {
            return (this.validator('required') && this.validator('required').message)
                || VALIDATORS.required.message;
        },
    },
    watch: {
        value(n) {
            this.localValue = n != null ? n : '';
            /**
             * When value change hide errors.
             * @type {boolean}
             */
            this.showFormErrors = false;

            this.validateByEventType('input');
        },
        formErrors() {
            this.showFormErrors = true;
            this.hadErrorState = true;
        },
    },
    mounted() {
        this.$formItem.event.$emit('subscribe', this);
        this.inputValidators = this.input.validators || null;
    },
    beforeDestroy() {
        this.$formItem.event.$emit('unsubscribe', this);
    },
    methods: {
        focus(ev) {
            this.$emit('focus', ev);
        },
        blur(ev) {
            ev.target.value = this.localValue;

            this.validateByEventType(ev.type);
            this.$emit('blur', ev);
        },
        validate(scroll = false) {
            this.errors = [];

            if (this.isDisabled) {
                return;
            }

            if (
                this.input.required
                && (this.localValue === null || this.localValue === '')
            ) {
                this.errors.push(this.translate(this.requiredMessage));
            } else if (
                this.localValue !== null
                && this.localValue !== ''
                && this.inputValidators
            ) {
                this.validateTypes();
            }

            if (this.errors.length) {
                this.hadErrorState = true;
            }

            if (scroll && this.errors.length) {
                this.$el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        },
        validateTypes() {
            this.inputValidators.forEach((rawValidator) => {
                const {
                    message = 'Custom error message',
                    validator,
                } = rawValidator;

                if (typeof validator === 'function') {
                    if (!validator(this.localValue)) {
                        this.errors.push(this.translate(message));
                    }

                    return;
                }

                const [command, rawAttrs] = validator.split(':');
                const attrs = rawAttrs ? rawAttrs.split(',') : [];
                const validatorType = VALIDATORS[command];
                const isError = validatorType.test
                    && !validatorType.test(this.localValue, attrs, this.$refs.input);

                if (isError) {
                    const customMessage = this.validator(command).message
                        || validatorType.message;
                    const replaceNumbers = this.translate(customMessage)
                        .replace(/\$(\d+)/g, (match, number) => attrs[+number]);
                    this.errors.push(replaceNumbers);
                }
            });
        },
        validateByEventType(type) {
            if (this.validatorEvent === 'onBlurThenOnInput') {
                if (this.hadErrorState && type === 'input') {
                    this.validate();
                } else if (type === 'blur') {
                    this.validate();
                }
            }

            if (this.validatorEvent === 'onBlur') {
                if (type === 'blur') {
                    this.validate();
                }
            }

            if (this.validatorEvent === 'onInput') {
                if (type === 'input') {
                    this.validate();
                }
            }
        },
        change(ev) {
            this.validateByEventType(ev.type);

            this.$emit('input', this.localValue);
        },
        keydown(event) {
            this.$emit('keydown', event);
        },
        clear() {
            this.localValue = '';
            this.$emit('input', this.localValue);
            this.errors = [];
            this.showFormErrors = false;
            this.hadErrorState = false;
        },
        translate(key) {
            if (typeof this.trans === 'function') {
                return this.trans.bind(this)(key);
            }

            return this.$formItem.trans.bind(this)(key);
        },
        getType(type) {
            if (typeof type !== 'string') {
                return '';
            }
            return type.split(':')[0];
        },
        validator(type) {
            return this.inputValidators
                && this.inputValidators
                    .find((validator) => this.getType(validator.validator) === type);
        },
    },
};
</script>

<style lang="less">
@import '../less/form-item.less';
</style>
