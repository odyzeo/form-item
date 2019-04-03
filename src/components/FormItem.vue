<template>
    <div
        :class="{
            'form-item--filled': isFilled,
            'form-item--error': isErrorClass,
            'form-item--no-label': !showLabel,
        }"
        class="form-item"
    >
        <div class="form-item__field">
            <slot name="prepend"></slot>

            <div
                v-if="showHider"
                class="form-item__hider"
            ></div>

            <div class="form-item__wrapper">
                <textarea
                    v-if="isTextArea"
                    ref="input"
                    :autocomplete="autocomplete"
                    :class="inputClass"
                    :id="uid"
                    :name="input.name"
                    :placeholder="input.placeholder"
                    :readonly="input.readonly"
                    :required="input.required"
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
                    :id="uid"
                    :name="input.name"
                    :pattern="input.pattern"
                    :placeholder="input.placeholder"
                    :readonly="input.readonly"
                    :required="input.required"
                    :type="type"
                    v-bind="bindToInput"
                    v-model="localValue"
                    class="form-item__input"
                    @blur="blur"
                    @focus="focus"
                    @input="change"
                    @keydown="keydown"
                >

                <label
                    v-if="showLabel"
                    :for="uid"
                    class="form-item__label"
                >
                    {{ input.label }}
                </label>
            </div>

            <slot name="append"></slot>
        </div>

        <slot name="result"></slot>

        <template v-if="!showFormErrors">
            <div
                v-for="(error, key) in errors"
                :key="`fe_error_${key}`"
                class="form-item__error"
                v-html="error"
            ></div>
        </template>

        <div v-else>
            <div
                v-for="(error, key) in formErrors"
                :key="`be_error_${key}`"
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
        input: {
            type: Object,
            required: true,
        },
        formErrors: {
            type: [Array, Object],
            default: () => ([]),
        },
        value: {
            type: String,
            default: '',
        },
        msgRequired: {
            type: String,
            default: 'Toto pole je povinné',
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
            showFormErrors: (this.formErrors.length > 0),
            hadErrorState: false,
        };
    },
    computed: {
        uid() {
            // eslint-disable-next-line no-underscore-dangle
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
        getType() {
            return type => type.split(':')[0];
        },
        validator() {
            return type => this.input.validators
                && this.input.validators
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
            this.localValue = (typeof n === 'undefined') ? '' : n;
            /**
             * When value change hide errors.
             * @type {boolean}
             */
            this.showFormErrors = false;
        },
        formErrors() {
            this.showFormErrors = true;
            this.hadErrorState = true;
        },
    },
    methods: {
        focus() {
            this.$emit('focus');
        },
        blur(ev) {
            ev.target.value = this.localValue;

            this.setValidationType(ev);
            this.$emit('blur');
        },
        validate(scroll = false) {
            this.errors = [];

            if (
                this.input.required
                && (
                this.localValue === null || this.localValue === ''
                )
            ) {
                this.errors.push((this.validator('required')
                    && this.requiredMessage)
                    || this.msgRequired);
            } else if (
                this.localValue !== null
                && this.localValue !== ''
                && this.input.validators
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
            this.input.validators.forEach((rawValidator) => {
                const [command, rawAttrs] = rawValidator.validator.split(':');
                const attrs = rawAttrs ? rawAttrs.split(',') : [];
                const validator = VALIDATORS[command];

                if (validator.test
                    && !validator.test(this.localValue, attrs, this.$refs.input)) {
                        this.errors
                            .push(
                                this.validator(command).message
                                    || validator.message
                                        .replace(/\$(\d+)/g, (match, number) => attrs[+number]),
                        );
                    }
            });
        },
        setValidationType(ev) {
            if (this.validatorEvent === 'onBlurThenOnInput') {
                if (this.hadErrorState && ev.type === 'input') {
                    this.validate();
                } else if (ev.type === 'blur') {
                    this.validate();
                }
            }

            if (this.validatorEvent === 'onBlur') {
                if (ev.type === 'blur') {
                    this.validate();
                }
            }

            if (this.validatorEvent === 'onInput') {
                if (ev.type === 'input') {
                    this.validate();
                }
            }
        },
        change(ev) {
            this.setValidationType(ev);

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
