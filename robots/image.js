const imageDownload = require('image-downloader');
const state = require('./state.js');
const google = require('googleapis').google;
const customSearch = google.customsearch('v1');
const googleSearchCredentials = require('../credentials/google-search.json');

async function robot() {
    const content = state.load();
    console.log('> [image-robot] Starting...')

    await fetchImagesOgAllSentences(content);
    await downloadAllImages(content);

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

    async function downloadAllImages (content) {
        content.downloadedImages = [];

        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex ++) {
            const images = content.sentences[sentenceIndex].images;

            for (let imageIndex = 0; imageIndex < images.length; imageIndex ++) {
                const imageUrl = images[imageIndex];

                try {
                    if (content.downloadedImages.includes(imageUrl)) {
                        throw new Error('Imagem já foi baixada');
                    }

                    await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`);
                    content.downloadedImages.push(imageUrl);
                    console.log('Image successfully downloaded: ', imageUrl);
                    break;
                } catch (error) {
                    console.log('error ao baixar imagem', error);
                }
            }
        }
    }

    async function downloadAndSave(url, fileName) {
        return imageDownload.image({
            url: url,
            dest: `./content/${fileName}`
        })
    }
}

module.exports = robot