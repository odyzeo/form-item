<template>
    <div>
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
            :form-errors="beErrors.full"
            :input="full"
            v-model="full.value"
            class="form-item--group"
            input-class="custom-class-for-input"
            group-name="form-item-form-1"
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
            group-name="form-item-form-1"
        ></form-item>

        <h3>ZIP (with validator): {{ zip.value }}</h3>
        <form-item
            :input="zip"
            v-model="zip.value"
            :ref="zip.name"
            group-name="form-item-form-1"
        ></form-item>

        <h3>Textarea: {{ textarea.value }}</h3>
        <form-item
            :input="textarea"
            v-model="textarea.value"
            :ref="textarea.name"
            :trans="customTranslate"
        ></form-item>

        <h3>Hidden: {{ hidden.value }}</h3>
        <p>
            Start:
            <form-item
                :input="hidden"
                v-model="hidden.value"
                :ref="hidden.name"
                group-name="form-item-form-1"
            ></form-item>
            end;
        </p>
        <p>
            Set hidden value:<br>
            <input
                v-model="hidden.value"
                type="text"
            >
        </p>
    </div>
</template>

<script>
const myFunc = param => value => value.indexOf(`${param}doe`) !== -1;

export default {
    props: {
        beErrors: {
            type: Object,
            default: () => ({}),
        },
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
                        message: 'Iba $0 znakov',
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
                    {
                        validator: myFunc('john.'),
                        message: 'Your email should start with john.doe',
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
            hidden: {
                value: '',
                name: 'hidden',
                type: 'hidden',
                required: true,
                validators: [
                    {
                        validator: 'required',
                    },
                ],
                validatorEvent: 'onBlurThenOnInput',
            },
        };
    },
    methods: {
        customTranslate(key) {
            return key.toUpperCase();
        },
    },
};
</script>
