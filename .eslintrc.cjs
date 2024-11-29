/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        '@electron-toolkit',
        '@vue/eslint-config-prettier'
    ],
    parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module'
    },
    rules: {
        'vue/require-default-prop': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-mutating-props': 'off',
        'vue/require-prop-types': 'off',
        "vue/no-v-html": "off"
    }
}
