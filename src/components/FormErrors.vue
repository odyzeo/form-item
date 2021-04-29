<template>
    <div>
        <!--eslint-disable vue/no-v-html vue/require-v-for-key-->
        <div
            v-for="error in formErrors"
            class="form-item__error"
            v-html="error"
        ></div>
        <!--eslint-enable vue/no-v-html vue/require-v-for-key-->
    </div>
</template>

<script>
export default {
    name: 'FormErrors',
    props: {
        formErrors: {
            type: [Array, Object],
            default: () => ([]),
        },
    },
};
</script>
