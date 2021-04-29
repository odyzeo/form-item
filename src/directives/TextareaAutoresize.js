import debounce from 'lodash.debounce';

/**
 * Directive for auto-resizing of textarea
 *
 * Will locate textarea tag if directive is bound on parent element instead
 * Accepting these params as binding.value:
 * @param {Object}  - {min = 0, max = scroll height of textarea, initiate: true}
 *                  - sets min and max height for resizing
 * @arg {String}    - window - will add listener for window resize;
 */
export default {
    inserted(element, binding) {
        const { value = {} } = binding;
        const { initiate = true } = value;

        if (!initiate) {
            return;
        }

        element.el = element.tagName === 'TEXTAREA'
            ? element
            : element.querySelector('textarea');

        if (!element.el) {
            // eslint-disable-next-line no-console
            console.error('[v-textarea-autoresize directive] No textarea tag found.');

            return;
        }

        function getAdjustedHeight() {
            const { scrollHeight } = element.el;
            const { min = 0, max = scrollHeight } = value;

            if (min > max) {
                // eslint-disable-next-line no-console
                console.error('v-textarea-autoresize directive] Min value shouldn`t be greater or equal to Max value');
                return 'auto';
            }

            const height = Math.min(Math.max(scrollHeight, min), max);
            return `${height}px`;
        }

        function setAdditionalStyles() {
            const { scrollHeight } = element.el;
            const { max = scrollHeight } = value;

            element.el.style.resize = 'none';

            if (max <= scrollHeight) {
                element.el.style.overflowY = 'auto';
            } else {
                element.el.style.overflowY = 'hidden';
            }
        }

        function autoresize() {
            element.el.style.height = getAdjustedHeight();
            setAdditionalStyles();
        }

        element.onInput = () => {
            element.el.style.height = 'auto';
            element.el.style.height = getAdjustedHeight();
            setAdditionalStyles();
        };
        element.debouncedHeight = debounce(element.onInput, 300);

        if (binding.arg === 'window') {
            window.addEventListener('resize', element.debouncedHeight);
        }

        element.el.addEventListener('input', element.onInput);
        autoresize();
    },
    unbind(element, binding) {
        if (!element.el) {
            return;
        }

        const { initiate = true } = binding.value;

        if (!initiate) {
            return;
        }

        if (binding.arg === 'window') {
            window.removeEventListener('resize', element.debouncedHeight);
        }

        element.el.removeEventListener('input', element.onInput);
    },
};
