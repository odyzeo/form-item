<template>
    <div
        id="app"
        class="app">
        <div class="container">
            <h1 class="text-center">Form item</h1>

            <inputs></inputs>

            <a
                href
                @click.prevent="submit"
            >
                Submit to show errors
            </a>
            <br>
            <a
                href
                @click.prevent="clearErrors"
            >
                Clear errors
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'App',

    methods: {
        submit() {
            this.validateAll();

            if (!this.$formItem.getErrors('form-item-form-1').length) {
                // eslint-disable-next-line no-console
                console.log('no errors');
            }
        },
        validateAll() {
            this.$formItem.validate('form-item-form-1');
        },
        clearErrors() {
            this.$formItem.clear('form-item-form-1');
        },
    },
};
</script>

<style lang="less">
@import '../src/less/app.less';
</style>
