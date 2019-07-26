const state = require('./state.js');
const google = require('googleapis').google;
const customSearch = google.customsearch('v1');

const googleSearchCredentials = require('../credentials/google-search.json');

async function robot() {
    const content = state.load();

    await fetchImagesOgAllSentences(content);

    state.save(content);

    async function fetchImagesOgAllSentences(content) {
        for (const sentence of content.sentences) {
            const query = `${content.searchTerm} ${sentence.keywords[0]}`;
            sentence.images = await fetchGoogleAndReturnImagesLinks(query);

            sentence.googleSearchQuery = query;
        }
    }
    
    async function fetchGoogleAndReturnImagesLinks(query) {
        const response = await customSearch.cse.list({
            auth: googleSearchCredentials.apikey,
            cx: googleSearchCredentials.searchEngineId,
            q: query,
            searchType: 'image',
            num: 2
        });

        const imageUrl = response.data.items.map((item) => {
            return item.link
        })

        return imageUrl
    }

}



module.exports = robot