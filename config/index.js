import { defaultsDeepAll } from 'lodash/fp';
const defaultConfig = require('./default');

let localConfig = {};

try {
    localConfig = require('./local');
} catch (e) {
    // pass
}

export default defaultsDeepAll([
    {
        url: process.env.APP_URL,
        mapbox: {
            key: process.env.MAPBOX_API_KEY
        }
    },
    localConfig,
    defaultConfig
]);
