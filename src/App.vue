<template>
  <div
    id="app"
    class="app">
    <div class="container">
      <h1>ZIP</h1>
      <form-item
        :input="text"
        :ref="text.name"
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
        label: '',
        type: 'textarea',
        required: true,
        validators: [],
        autocomplete: 'off',
        rows: 10,
        placeholder: 'Description',
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
