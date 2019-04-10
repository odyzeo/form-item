import Vue from 'vue';
import FormItem from './plugin/formItem';
import App from './App';
import Inputs from './components/Inputs';

Vue.component('inputs', Inputs);

Vue.config.productionTip = false;

Vue.use(FormItem);

new Vue({
    render: h => h(App),
}).$mount('#app');
