process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const chalk = require('chalk');

const config = require('../webpack.config.prod');

/* eslint-disable no-console */

function printErrors(summary, errors) {
    console.log(chalk.red(summary));
    console.log();
    errors.forEach(err => {
        console.log(err.message || err);
        console.log();
    });
}

webpack(config).run((err, stats) => {
    if (err) {
        printErrors('Failed to compile.', [ err ]);
        throw new Error();
    }

    if (stats.compilation.errors.length) {
        printErrors('Failed to compile.', stats.compilation.errors);
        throw new Error();
    }

    console.log(chalk.green('Compiled successfully.'));
});

/* eslint-enable no-console */
