// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';
import FormItemPlugin from './plugin/FormItem';
import App from './App';
import Inputs from './components/Inputs';
import TextareaAutoresize from './directives/TextareaAutoresize';

Vue.component('Inputs', Inputs);

Vue.config.productionTip = false;

Vue.use(FormItemPlugin);
Vue.directive('textarea-autoresize', TextareaAutoresize);

new Vue({
    render: (h) => h(App),
}).$mount('#app');
