import FormItem from '../components/FormItem';

const Plugin = {
    install(Vue, options = {}) {
        /**
         * Makes sure that plugin can be installed only once
         */
        if (this.installed) {
            return;
        }

        /**
         * Functions
         */
        function subscribeFormItem(item) {
            Plugin.activeItems.push(item);
        }

        function unsubscribeFormItem(item) {
            const index = Plugin.activeItems.indexOf(item);

            if (index !== -1) {
                Plugin.activeItems.splice(index, 1);
            }
        }

        function callFunctionOnFormItem(name, functionName) {
            Plugin.activeItems.filter(item => item.groupName !== '' && item.groupName === name)
                .forEach((item) => {
                    item[functionName]();
                });
        }

        function getErrors(name) {
            const errors = [];

            Plugin.activeItems.filter(item => item.groupName !== '' && item.groupName === name)
                .forEach((item) => {
                    if (item.errors.length > 0) {
                        errors.push(...item.errors);
                    }
                });

            return errors;
        }

        /**
         * Main logic
         */
        const defaultComponentName = 'form-item';
        const defaultTrans = key => key;
        const {
            componentName = defaultComponentName,
            trans = defaultTrans,
        } = options;

        this.installed = true;
        this.event = new Vue();
        this.componentName = componentName;
        this.activeItems = [];

        this.event.$on('subscribe', subscribeFormItem);
        this.event.$on('unsubscribe', unsubscribeFormItem);

        /**
         * Plugin API
         */
        // eslint-disable-next-line
        Vue.prototype.$formItem = {
            // methods
            validate(name) {
                callFunctionOnFormItem(name, 'validate');
            },
            clear(name) {
                callFunctionOnFormItem(name, 'clear');
            },
            getErrors(name) {
                return getErrors(name);
            },
            hasErrors(name) {
                return getErrors(name).length > 0;
            },

            // properties
            event: this.event,

            // methods
            trans,
        };

        /**
         * Sets custom component name (if provided)
         */
        Vue.component(this.componentName, FormItem);
    },
};

export default Plugin;
