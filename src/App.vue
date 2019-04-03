<template>
    <div
        id="app"
        class="app">
        <div class="container">
            <h1 class="text-center">Form item</h1>

            <h3>Simple: {{ simple.value }}</h3>
            <form-item
                :input="simple"
                v-model="simple.value"
                :ref="simple.name"
            ></form-item>

            <h3>Full example: {{ full.value }}</h3>
            <form-item
                :ref="full.name"
                :bind-to-input="{ 'data-hj-whitelist': true }"
                :form-errors="formErrors.full"
                :input="full"
                :msg-required="requiredMessage"
                v-model="full.value"
                class="form-item--group"
                input-class="custom-class-for-input"
            >
                <template slot="prepend">
                    <div class="form-item__readonly">Your</div>
                </template>
                <template slot="append">
                    <div class="form-item__readonly">Please</div>
                </template>
            </form-item>

            <h3>Number: {{ number.value }}</h3>
            <form-item
                :input="number"
                v-model="number.value"
                :ref="number.name"
            ></form-item>

            <a
                v-if="isFormErrors"
                href
                @click.prevent="clear"
            >
                Clear BE errors
            </a>
            <a
                v-else
                href
                @click.prevent="submit"
            >
                Submit to show BE errors
            </a>

            <h3>ZIP (with validator): {{ zip.value }}</h3>
            <form-item
                :input="zip"
                v-model="zip.value"
                :ref="zip.name"
            ></form-item>

            <h3>Textarea: {{ textarea.value }}</h3>
            <form-item
                :input="textarea"
                v-model="textarea.value"
                :ref="textarea.name"
            ></form-item>
        </div>
    </div>
</template>

<script>
import FormItem from './components/FormItem';

export default {
    name: 'App',
    components: {
        FormItem,
    },
    data() {
        return {
            requiredMessage: 'Povinné',
            formErrors: {},
            simple: {
                label: 'Simple',
                value: '',
                name: 'simple',
            },
            number: {
                label: 'Number',
                value: '',
                type: 'number',
                pattern: '\\d*',
                name: 'number',
                required: true,
                validators: [
                    {
                        validator: 'min:5',
                    },
                ],
                validatorEvent: 'onBlurThenOnInput',
            },
            full: {
                type: 'email',
                name: 'email',
                required: true,
                readonly: false,
                placeholder: 'example@odyzeo.com',
                accept: '', // Just for input type 'file'
                rows: 0, // Just for input type 'textarea'
                autocomplete: 'username email',
                label: 'E-mail',
                pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
                value: '',
                validators: [
                    {
                        validator: 'email',
                    },
                    {
                        validator: 'required',
                    },
                ],
                validatorEvent: 'onBlur',
            },
            zip: {
                name: 'zip',
                placeholder: 'placeholder',
                label: 'ZIP',
                required: true,
                validators: [
                    {
                        validator: 'zip',
                    },
                ],
                validatorEvent: 'onInput',
                value: '',
            },
            textarea: {
                name: 'textarea',
                type: 'textarea',
                label: 'Textarea',
                placeholder: 'Textarea placeholder',
                rows: 10,
                value: 'Some text just for textarea',
            },
        };
    },
    computed: {
        isFormErrors() {
            return Object.keys(this.formErrors).length > 0;
        },
    },
    methods: {
        submit() {
            this.validateAll();

            this.formErrors = {
                full: ['Some BE error'],
            };
        },
        clear() {
            this.formErrors = {};
        },
        validateAll() {
            Object.keys(this.$refs).forEach((key) => {
                this.$refs[key].validate();
            });
        },
    },
};
</script>

<style lang="less">
@import '../src/less/app.less';
</style>
