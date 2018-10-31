<template>
  <div
    id="app"
    class="app">
    <div class="container">
      <h1>ZIP (with validator)</h1>
      <form-item
        :input="text"
      />
      <h1>Textarea</h1>
      <form-item
        :input="textarea"
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
      initialInputValue: 'something',
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
        label: 'ZIP',
        type: 'text',
        required: true,
        validators: ['zip'],
        autocomplete: 'off',
      },
    };
  },
};
</script>

<style lang="less">
@import '../src/less/app.less';
</style>
