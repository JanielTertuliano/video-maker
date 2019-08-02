const chalk = require('chalk');
const Ora = require('ora');
const spinner = new Ora({
    spinner: process.argv[2]
});

function loading(text) {
    spinner.indent = 0;
    spinner.spinner = 'dots';
    spinner.text = chalk.cyan(text);
    return spinner.start();
}

function succeed(text) {
    spinner.text = chalk.green(text);;
    return spinner.succeed();
}

function error(text) {
    spinner.text = chalk.red.bgYellow.bold(text);
    return spinner.fail();
}

function info(text) {
    const spinnerInfo = new Ora({
        spinner: process.argv[2]
    });

	spinnerInfo.indent = 2;
	spinnerInfo.text = chalk.blue(text);
    return spinnerInfo.info();
}

module.exports = {
    loading,
    succeed,
    error,
    info
}