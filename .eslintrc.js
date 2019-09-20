module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "airbnb-base"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "getFactory": "readonly",
        "getAssetRegistery": "readonly",
        "emit": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "no-param-reassign": 0,
        "no-plusplus": 0,
        "no-use-before-define": 0,
        "no-unused-vars": 0
    }
};
