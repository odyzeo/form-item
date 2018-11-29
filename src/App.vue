<template>
  <div
    id="app"
    class="app">
    <div class="container">
      <h1>Text with prepend and append</h1>
      <form-item
        :input="text"
        v-model="textValue"
        class="form-item--group"
      >
        <template slot="prepend">
          <div class="form-item__readonly">prepend</div>
        </template>
        <template slot="append">
          <div class="form-item__readonly">append</div>
        </template>
      </form-item>
      <h1>ZIP (with validator)</h1>
      <form-item
        :input="zip"
        v-model="zipValue"
      />
      <h1>Textarea</h1>
      <form-item
        :input="textarea"
        v-model="textareaValue"
      />
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
      textValue: 'some text',
      zipValue: '',
      textareaValue: '',
      zip: {
        name: 'input_zip',
        label: 'ZIP',
        type: 'text',
        required: true,
        validators: ['zip'],
        autocomplete: 'off',
      },
      textarea: {
        name: 'textarea_name',
        label: 'Textarea label (use this or placeholder)',
        type: 'textarea',
        required: true,
        validators: [],
        autocomplete: 'off',
        rows: 10,
        placeholder: '',
      },
      text: {
        name: 'input_name',
        label: 'Name',
        type: 'text',
        required: true,
        validators: [],
        group: true,
        autocomplete: 'off',
      },
    };
  },
};
</script>

<style lang="less">
@import '../src/less/app.less';
</style>
