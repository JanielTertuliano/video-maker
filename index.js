const readline = require('readline-sync');
const robots = {
    text: require('./robots/text.js')
}

async function start () {
    const content = {
        maximumSentences: 7
    }

    content.searchTerm = askAndReturnSearchTerm();
    content.prefix = askAndReturnPrefix();
    content.lang = askAndReturnLanguage();

    await robots.text(content);

    function askAndReturnSearchTerm() {
       return readline.question('Termo de Busca: ');
    }

    function askAndReturnPrefix() {
        const prefixes = ['Quem eh ?', 'O que eh ?', 'A historia de'];
        const selectedPrefixIndex = readline.keyInSelect(prefixes);
        const selectedPrefixText = prefixes[selectedPrefixIndex];
        return selectedPrefixText
    }

    function askAndReturnLanguage() {
        const language = ['pt','en']
        const selectedLangIndex = readline.keyInSelect(language,'Choice Language: ');
        const selectedLangText = language[selectedLangIndex];
        return selectedLangText;
    }
    console.log(JSON.stringify(content, null, 4));
}

start()