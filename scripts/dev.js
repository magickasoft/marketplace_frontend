process.env.NODE_ENV = 'development';

const path = require('path');
const chalk = require('chalk');
const detectPort = require('detect-port');
const historyApiFallback = require('connect-history-api-fallback');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('../webpack.config.dev');

const DEFAULT_PORT = process.env.PORT || 3000;

/* eslint-disable no-console */

function proxyRequests(devServer) {
    devServer.use(historyApiFallback({
        disableDotRule: true,
        htmlAcceptHeaders: ['text/html', '*/*']
    }));

    devServer.use(devServer.middleware);
}

function runDevServer(host, port, protocol, compiler) {
    const devServer = new WebpackDevServer(compiler, {
        compress: true,
        clientLogLevel: 'none',
        contentBase: path.resolve(__dirname, '..', 'public'),
        hot: true,
        publicPath: config.output.publicPath,
        quiet: true,
        watchOptions: {
            ignored: /node_modules/
        },
        https: protocol === 'https',
        host
    });

    proxyRequests(devServer);

    devServer.listen(port, err => {
        if (err) {
            console.log(err);
            return;
        }

        console.log(chalk.cyan('Starting the development server...'));
        console.log();
    });
}

function setupCompiler(host, port, protocol) {
    const compiler = webpack(config);
    let isFirstCompile = true;

    compiler.plugin('invalid', () => {
        console.log('Compiling...');
    });

    compiler.plugin('done', stats => {
        const messages = formatWebpackMessages(stats.toJson({}, true));
        const isSuccessful = !messages.errors.length && !messages.warnings.length;
        const showInstructions = isSuccessful && isFirstCompile;

        if (isSuccessful) {
            console.log(chalk.green('Compiled successfully!'));
        }

        if (showInstructions) {
            const url = `${protocol}://${host}:${port}/`;

            console.log();
            console.log('The app is running at:');
            console.log();
            console.log(`  ${chalk.cyan(url)}`);
            console.log();
            console.log('Note that the development build is not optimized.');
            console.log();
            isFirstCompile = false;
        }

        // If errors exist, only show errors.
        if (messages.errors.length) {
            console.log(chalk.red('Failed to compile.'));
            console.log();
            messages.errors.forEach(message => {
                console.log(message);
                console.log();
            });
            return;
        }

        // Show warnings if no errors were found.
        if (messages.warnings.length) {
            console.log(chalk.yellow('Compiled with warnings.'));
            console.log();
            messages.warnings.forEach(message => {
                console.log(message);
                console.log();
            });
        }
    });

    return compiler;
}

function run(port) {
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const host = process.env.HOST || 'localhost';
    const compiler = setupCompiler(host, port, protocol);

    runDevServer(host, port, protocol, compiler);
}

detectPort(DEFAULT_PORT).then(port => {
    if (port === DEFAULT_PORT) {
        run(port);
    } else {
        console.log(
            chalk.red(`Something is already running on port ${DEFAULT_PORT}.`)
        );
    }
});

/* eslint-enable no-console */
