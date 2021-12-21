<template>
    <div :class="componentClassName">
        <div :class="$options.CLASS_NAME.field">
            <slot name="prepend"></slot>

            <div
                v-if="showHider"
                :class="$options.CLASS_NAME.hider"
            ></div>

            <label
                :for="input.id"
                :class="$options.CLASS_NAME.wrapper"
            >
                <textarea
                    v-if="isTextArea"
                    :id="input.id"
                    ref="input"
                    v-model="localValue"
                    :autocomplete="autocomplete"
                    :class="inputClassName"
                    :name="input.name"
                    :placeholder="translate(input.placeholder)"
                    :readonly="isReadonly"
                    :required="isRequired"
                    :disabled="isDisabled"
                    :autofocus="input.autofocus"
                    :rows="input.rows"
                    v-bind="bindToInput"
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
                    :class="inputClassName"
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
                    @blur="blur"
                    @focus="focus"
                    @input="change"
                    @keydown="keydown"
                >

                <span
                    v-if="showLabel"
                    :class="$options.CLASS_NAME.label"
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
    CLASS_NAME: {},
    components: { FormErrors },
    props: {
        className: {
            type: String,
            default: null,
        },
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
        componentClassName() {
            return {
                [this.getClassName()]: true,
                [this.getClassName(null, 'filled')]: this.isFilled,
                [this.getClassName(null, 'error')]: this.isErrorClass,
                [this.getClassName(null, 'no-label')]: !this.showLabel,
                [this.getClassName(null, 'required')]: this.isRequired,
                [this.getClassName(null, 'readonly')]: this.isReadonly,
                [this.getClassName(null, 'hidden')]: this.isHidden,
                [this.getClassName(null, 'disabled')]: this.isDisabled,
            };
        },
        type() {
            return this.input.type || 'text';
        },
        inputClassName() {
            return [
                this.inputClass,
                this.getClassName('input'),
            ];
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
    created() {
        this.initClassName(this.$formItem.className);
    },
    mounted() {
        this.$formItem.event.$emit('subscribe', this);
        this.inputValidators = this.input.validators || null;
    },
    beforeDestroy() {
        this.$formItem.event.$emit('unsubscribe', this);
    },
    methods: {
        initClassName(block) {
            this.$options.CLASS_NAME = {
                component: block,
                field: this.getClassName('field'),
                hider: this.getClassName('hider'),
                label: this.getClassName('label'),
                wrapper: this.getClassName('wrapper'),
            };
        },
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
        getClassName(element = null, modifier = null) {
            let className = this.className ?? this.$formItem.className;
            if (element) {
                className = `${className}__${element}`;
            }
            if (modifier) {
                className = `${className}--${modifier}`;
            }
            return className;
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
