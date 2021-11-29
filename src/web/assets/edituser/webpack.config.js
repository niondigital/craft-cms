/* jshint esversion: 6 */
/* globals module, require */
const {getConfig} = require('@craftcms/webpack');

module.exports = getConfig({
    context: __dirname,
    config: {
        entry: {
            AccountSettingsForm: './AccountSettingsForm.js',
            profile: './profile.js'
        },
    }
});