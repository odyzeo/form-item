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
  components: {
    FormItem,
  },
}
```

Import styles or make your own.

```
import '@odyzeo/form-item/dist/form-item.css';
```

## Usage

```
<template>
  <div>
      <form-item
        :input="simple"
        v-model="simple.value"
      ></form-item>
      
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
  </div>
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
      requiredMessage: 'Povinné',
      formErrors: {},
    };
  },
};
</script>
```

## Props

### input {Object} -  required
| Property name | Type | Default value | Description |
| ------------- | ---- | ------------- | ----------- |
| `type` | string | `text` | Supports 'textarea' and [all](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) html5 input types supports |
| `name` | string | `` | Textarea or input `name` attribute |
| `label` | string | `''` | Label name for input |
| `required` | boolean | `false` | If value is required |
| `readonly` | boolean | `false` | If field is read only |
| `placeholder` | string | `` | Native placeholder attribute for input/textarea |
| `accept` | string |  | Which file types should be accepted if type is file |
| `validators` | array | `undefined` | Array holding objects with `validator`{`string`} and `message`{`string`} properties |
| `validatorEvent` | string | `none` | Pick validator events which will be used for frontend validation. Choose from: <ul><li>`onBlurThenOnInput`: validate field on blur first, then on input periodically</li> <li>`onBlur`</li> <li>`onInput`</li></ul>|
| `rows` | number, string | `` | Number of rows textarea should have |
| `autocomplete` | string | `off` | HTML5 autocomplete attribute, check [docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for more info and possible values |
| `pattern` | string | `` | Pattern attribute specifies a regular expression that the <input> element's value is checked against on form submission |

### groupName {string = ''} - optional 
Set if you need to target one or more form item components with global methods

### value {string} - optional
This is the initial value of the form input/textarea.

### formErrors {array} - optional
Array of errors to display.

### msgRequired {string} - optional
Error message for required field

## Available validators
- `email`
- `zip`
- `tel` : phone number
- `min` : length of string
- `confirmed `: confirmed passwords
- `regex` : your custom regex
- `required` : for custom required message

### bindToInput {Object} - optional
Used for generating custom attributes to input/textarea element.

### inputClass {string} - optional
Used for adding custom class to input/textarea element.

## Global methods
Methods called on `$formItem` object installed on main Vue instance

### $formItem.validate( name )
- Arguments:
    - `{string} name` Group name of one or multiple form items
    
- Usage: 

    Trigger validation of all form items corresponding to group name argument
   
### $formItem.clear( name )
- Arguments:
    - `{string} name` Group name of one or multiple form items
   
- Usage: 

    Clear inputs and errors on all form items corresponding to group name argument

### $formItem.getErrors( name )
- Arguments:
    - `{string} name` Group name of one or multiple form items
   
- Returns: 
    - Array of errors
   
- Usage: 

    Get all current FE errors of all form items corresponding to group name argument 


## Events
Component emits these events:
- `focus`
- `blur`
- `input` : emits with value of the element
- `keydown`

## Development

```
npm run serve
```

or

```bash
yarn serve
```

# TODO
- validate on custom events, e.g. form submit not just on blur
- integrate some mask (v-mask or vue-inputmask or custom) for zip and phone
- add total maxLength to textarea
- add maxLength per line to textarea
- add maxRows to textarea
