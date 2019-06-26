import Vue from 'vue';
import VueI18n from 'vue-i18n';
import FormItem from './plugin/FormItem';
import App from './App';
import Inputs from './components/Inputs';

Vue.component('inputs', Inputs);

Vue.config.productionTip = false;

Vue.use(VueI18n);

const i18n = new VueI18n({
    locale: 'en',
    messages: {
        en: {
            'formItemSimple': '{msg} world',
        },
        sk: {
            'formItemSimple': '{msg} svet',
        },
    },
});

new Vue({
    i18n,
    render: h => h(App),
    created() {
        Vue.use(FormItem, {
            trans: this.$t,
        });
    }
}).$mount('#app');
