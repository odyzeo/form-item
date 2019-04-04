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
        function getActiveItems(item) {
            Plugin.activeItems.push(item);
        }

        function removeInactiveItems(item) {
            const index = Plugin.activeItems.indexOf(item);

            if (index !== -1) {
                Plugin.activeItems.splice(index, 1);
            }
        }

        function iterateOverItems(name, callbackString) {
            Plugin.activeItems
                .filter(item => item.name !== '' && item.name === name)
                .forEach((item) => {
                    item[callbackString]();
            });
        }

        function getErrors(name) {
            const errors = [];

            Plugin.activeItems
                .filter(item => item.name !== '' && item.name === name)
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

        this.installed = true;
        this.event = new Vue();
        this.componentName = options.componentName || defaultComponentName;
        this.activeItems = [];

        this.event.$on('form-item-activated', getActiveItems);
        this.event.$on('form-item-destroyed', removeInactiveItems);

        /**
         * Plugin API
         */
        // eslint-disable-next-line
        Vue.prototype.$formItem = {
            // methods
            validate(name) {
                iterateOverItems(name, 'validate');
            },
            clear(name) {
                iterateOverItems(name, 'clear');
            },
            getErrors(name) {
                return getErrors(name);
            },

            // properties
            event: this.event,
        };

        /**
         * Sets custom component name (if provided)
         */
        Vue.component(this.componentName, FormItem);
    },
};

export default Plugin;
