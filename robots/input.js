const readline = require('readline-sync');
const state = require('./state.js');
const chalk = require('chalk');

function robot() {
    const content = {
        maximumSentences: 7
    }

    content.searchTerm = askAndReturnSearchTerm();
    content.prefix = askAndReturnPrefix();
    content.lang = askAndReturnLanguage();
    state.save(content);

    function askAndReturnSearchTerm() {
        return readline.question(chalk.yellow('Termo de Busca: '));
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of'];
        const selectedPrefixIndex = readline.keyInSelect(prefixes, chalk.yellow('Choose one from list: '));
        const selectedPrefixText = prefixes[selectedPrefixIndex];
        return selectedPrefixText
    }

    function askAndReturnLanguage() {
        const language = ['pt','en']
        const selectedLangIndex = readline.keyInSelect(language, chalk.yellow('Choice Language: '));
        const selectedLangText = language[selectedLangIndex];
        return selectedLangText;
    }
}

module.exports = robot