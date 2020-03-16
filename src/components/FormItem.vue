<template>
    <div
        :class="{
            'form-item--filled': isFilled,
            'form-item--error': isErrorClass,
            'form-item--no-label': !showLabel,
            'form-item--required': isRequired,
            'form-item--readonly': isReadonly,
            'form-item--hidden': isHidden,
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
                class="form-item__wrapper"
                :for="input.id"
            >
                <textarea
                    v-if="isTextArea"
                    ref="input"
                    :autocomplete="autocomplete"
                    :class="inputClass"
                    :id="input.id"
                    :name="input.name"
                    :placeholder="translate(input.placeholder)"
                    :readonly="isReadonly"
                    :required="isRequired"
                    :autofocus="input.autofocus"
                    :rows="input.rows"
                    v-bind="bindToInput"
                    v-model="localValue"
                    class="form-item__input"
                    @blur="blur"
                    @focus="focus"
                    @input="change"
                    @keydown="keydown"
                ></textarea>

                <input
                    v-else
                    ref="input"
                    :accept="input.accept"
                    :autocomplete="autocomplete"
                    :class="inputClass"
                    :id="input.id"
                    :multiple="input.multiple"
                    :name="input.name"
                    :pattern="input.pattern"
                    :step="input.step"
                    :min="input.min"
                    :max="input.max"
                    :placeholder="translate(input.placeholder)"
                    :readonly="isReadonly"
                    :required="isRequired"
                    :autofocus="input.autofocus"
                    :type="type"
                    v-bind="bindToInput"
                    v-model="localValue"
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

        <template v-if="showFormErrors">
            <div
                v-for="(error, key) in formErrors"
                :key="`be_error_${key}`"
                class="form-item__error"
                v-html="translate(error)"
            ></div>
        </template>
        <div v-else>
            <div
                v-for="(error, key) in errors"
                :key="`fe_error_${key}`"
                class="form-item__error"
                v-html="error"
            ></div>
        </div>
    </div>
</template>

<script>
import VALIDATORS from '@/constants/validators';

export default {
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
            default: () => {
            },
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
        const autocomplete = this.input.autocomplete || 'off';
        const type = this.input.type || 'text';

        return {
            autocomplete,
            type,
            localValue: this.value != null ? this.value : '',
            errors: [],
            validating: false,
            isTextArea: type === 'textarea',
            showFormErrors: (this.formErrors.length > 0),
            hadErrorState: false,
            inputValidators: null,
        };
    },
    computed: {
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
        isRequired() {
            return this.input.required;
        },
        showLabel() {
            return this.input.label && this.type !== 'file';
        },
        showHider() {
            return this.isTextArea && this.input.label;
        },
        getType() {
            return type => type.split(':')[0];
        },
        validator() {
            return type => this.inputValidators
                && this.inputValidators
                    .find(validator => this.getType(validator.validator) === type);
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
        this.$formItem.event.$emit('subscribe', this);
    },
    mounted() {
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
                if (typeof rawValidator.validator === 'function') {
                    const { validator } = rawValidator;
                    const { message = 'Custom error message' } = rawValidator;

                    if (!validator(this.localValue)) {
                        this.errors.push(message);
                    }

                    return;
                }

                const [command, rawAttrs] = rawValidator.validator.split(':');
                const attrs = rawAttrs ? rawAttrs.split(',') : [];
                const validator = VALIDATORS[command];

                const isError = validator.test
                    && !validator.test(this.localValue, attrs, this.$refs.input);
                if (isError) {
                    const message = this.validator(command).message || validator.message;
                    const translatedMessage = this.translate(message);
                    const replaceNumbers = translatedMessage
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
    },
};
</script>

<style lang="less">
@import '../less/form-item.less';
</style>
