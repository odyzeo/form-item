import Vue from 'vue';
import formItem from './plugin/formItem';
import App from './App';
import Inputs from './components/Inputs';

Vue.component('inputs', Inputs);

Vue.config.productionTip = false;

Vue.use(formItem);

new Vue({
    render: h => h(App),
}).$mount('#app');
