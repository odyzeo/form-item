# @odyzeo/form-item

Simple input and textarea Vue.js component.

## Installation

### npm

```
npm install --save @odyzeo/form-item
```

### yarn

```
yarn add @odyzeo/form-item
```

Import component in your where you want to use it and register it:

```
import FormItem from '@odyzeo/form-item';
export default {
  components: { FormItem },
}
```

Import styles or make your own.

```
import '@odyzeo/form-item/dist/form-item.css';
```

## Usage

```
<template>
  <h1>Input</h1>
  <form-item
    :input="text"
    :value="initialTextValue"
  />
  <h1>Textarea</h1>
  <form-item
    :input="textarea"
    :value="initialTextareaValue"
  />
</template>
```

```
<script>
import FormItem from '@odyzeo/form-item'

export default {
  name: 'App',
  components: {
    FormItem,
  },
  data() {
    return {
      initialInputValue: '',
      initialTextareaValue: '',
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
        label: 'Name',
        type: 'text',
        required: true,
        validators: [],
        autocomplete: 'off',
      },
    };
  },
};
</script>
```

## Props

### input - required
| property name | type | description |
| --- | --- | --- |
| type | string | 'text', 'file' or 'textarea' |
| name | string | textarea or input name attribute |
| required | boolean | if value is required |
| readonly | boolean | if field is read only |
| placeholder | string | placeholder for input/textarea |
| accept | string | what file types should be accepted if type is file |
| validators | array | which validators should be used to validate input value |
| rows | number | how many rows should textarea have |
| autocomplete | string | HTML5 autocomplete attribute, default is 'off', check [docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for more info and possible values |

### value - optional
This is the initial value of the form input/textarea.

### msg-required - optional
Error message for required field

## Available validators
- email
- zip
- tel : phone number
- min : length of string
- confirmed :
- regex : your custom regex

## Events
Component emits these events:
- focus
- blur
- input : emits with value of the element
- keydown

## CSS classes
*TODO*

## Development

```
npm run serve
```

or

```bash
yarn serve
```


# TODO
- translate default texts in validators to english
- allow custom validator texts with props
- integrate some mask (v-mask or vue-inputmask or custom) for zip and phone
- add total maxLength to textarea
- add maxLength per line to textarea
- add maxRows to textarea
