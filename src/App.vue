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
      ></form-item>

      <h3>Full example: {{ full.value }}</h3>
      <form-item
        :input="full"
        v-model="full.value"
        :msg-required="requiredMessage"
        :form-errors="formErrors.full"
        class="form-item--group"
        :bind-to-input="{ 'data-hj-whitelist': true }"
        input-class="custom-class-for-input"
      >
        <template slot="prepend">
          <div class="form-item__readonly">Your</div>
        </template>
        <template slot="append">
          <div class="form-item__readonly">Please</div>
        </template>
      </form-item>

      <a
        href
        v-if="isFormErrors"
        @click.prevent="clear"
      >
        Clear BE errors
      </a>
      <a
        href
        v-else
        @click.prevent="submit"
      >
        Submit to show BE errors
      </a>

      <h3>ZIP (with validator): {{ zip.value }}</h3>
      <form-item
        :input="zip"
        v-model="zip.value"
      ></form-item>

      <h3>Textarea: {{ textarea.value }}</h3>
      <form-item
        :input="textarea"
        v-model="textarea.value"
      ></form-item>
    </div>
  </div>
</template>

<script>
import FormItem from './components/FormItem.vue';

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
      },
      full: {
        type: 'email',
        name: 'email',
        required: true,
        readonly: false,
        placeholder: 'example@odyzeo.com',
        accept: '', // Just for input type 'file'
        validators: ['email'],
        rows: 0, // Just for input type 'textarea'
        autocomplete: 'username email',
        label: 'E-mail',
        value: '',
      },
      zip: {
        name: 'zip',
        placeholder: 'placeholder',
        label: 'ZIP',
        required: true,
        validators: ['zip'],
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
      this.formErrors = {
        full: ['Some BE error'],
      };
    },
    clear() {
      this.formErrors = {};
    },
  },
};
</script>

<style lang="less">
@import '../src/less/app.less';
</style>
