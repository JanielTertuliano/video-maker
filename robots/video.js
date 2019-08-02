const gm = require('gm').subClass({ imageMagick: true });
const state = require('./state.js');
const spawn = require('child_process').spawn;
const path = require('path');
const rootPath = path.resolve(__dirname, '..');
const logger = require('../utils/logger');

async function robot() {
    const content = state.load();
    logger.loading('> [video-robot] Starting... ');

    await convertAllImages(content);
    await createAllSentenceImages(content);
    await createYouTubeThumbnail(content);
    // await createAfterEffectsScript(content);
    // await renderVideoWithAfterEffects();

    logger.succeed('> [video-robot] Completed! ');
    state.save(content);

    async function convertAllImages(content) {
        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
            await convertImage(sentenceIndex);
        }
    }

    async function convertImage(sentenceIndex) {
        logger.loading('> Convertendo Imagem... ');

        return new Promise((resolve, reject) => {
            const inputFile = `./content/${sentenceIndex}-original.png[0]`;
            const outputFile = `./content/${sentenceIndex}-converted.png`;
            const width = 1920;
            const height = 1080;
            gm()
                .in(inputFile)
                .out('(')
                .out('-clone')
                .out('0')
                .out('-background', 'white')
                .out('-blur', '0x9')
                .out('-resize', `${width}x${height}^`)
                .out(')')
                .out('(')
                .out('-clone')
                .out('0')
                .out('-background', 'white')
                .out('-resize', `${width}x${height}`)
                .out(')')
                .out('-delete', '0')
                .out('-gravity', 'center')
                .out('-compose', 'over')
                .out('-composite')
                .out('-extent', `${width}x${height}`)
                .write(outputFile, (error) => {
                    if (error) {
                        logger.error(error);
                        return reject(error);
                    }

                    logger.succeed(`> [video-robot] Image converted: ${outputFile}`);
                    resolve();
                });

        });
    }

    async function createAllSentenceImages(content) {
        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
            await createSentenceImage(sentenceIndex, content.sentences[sentenceIndex].text)
        }
    }


    async function createSentenceImage(sentenceIndex, sentenceText) {
        logger.loading('> criando uma imagem das sentenças... ');

        return new Promise((resolve, reject) => {
            const outputFile = `./content/${sentenceIndex}-sentence.png`

            const templateSettings = {
                0: {
                    size: '1920x400',
                    gravity: 'center'
                },
                1: {
                    size: '1920x1080',
                    gravity: 'center'
                },
                2: {
                    size: '800x1080',
                    gravity: 'west'
                },
                3: {
                    size: '1920x400',
                    gravity: 'center'
                },
                4: {
                    size: '1920x1080',
                    gravity: 'center'
                },
                5: {
                    size: '800x1080',
                    gravity: 'west'
                },
                6: {
                    size: '1920x400',
                    gravity: 'center'
                }

            }

            gm()
                .out('-size', templateSettings[sentenceIndex].size)
                .out('-gravity', templateSettings[sentenceIndex].gravity)
                .out('-background', 'transparent')
                .out('-fill', 'white')
                .out('-kerning', '-1')
                .out(`caption:${sentenceText}`)
                .write(outputFile, (error) => {
                    if (error) {
                        logger.error(error);
                        return reject(error)
                    }

                    logger.succeed(`> [video-robot] Sentence created: ${outputFile}`);
                    resolve()
                })
        })
    }

    async function createYouTubeThumbnail() {
        logger.loading('> criando Thumbnail para o Youtube... ');

        return new Promise((resolve, reject) => {
            gm()
                .in('./content/0-converted.png')
                .write('./content/youtube-thumbnail.jpg', (error) => {
                    if (error) {
                        logger.error(error);
                        return reject(error)
                    }

                    logger.succeed('> [video-robot] YouTube thumbnail created');
                    resolve()
                })
        })
    }

    async function createAfterEffectsScript(content) {
        await state.saveScript(content);
    }

    async function renderVideoWithAfterEffects() {
        return new Promise((resolve, reject) => {
            const aerenderFilePath = 'C:/Program Files/Adobe/Adobe After Effects CS6/Support Files/aerender';
            const templateFilePath = `${rootPath}/templates/1/template.aep`;
            const destinationFilePath = `${rootPath}/content/output.mov`;

            logger.loading('> [video-robot] Starting After Effects');

            const aerender = spawn(aerenderFilePath, [
                '-comp', 'main',
                '-project', templateFilePath,
                '-output', destinationFilePath
            ])

            aerender.stdout.on('data', (data) => {
                process.stdout.write(data);
            })

            aerender.on('close', () => {
                logger.succeed('> [video-robot] After Effects closed')
                resolve();
            })
        })
    }
}

module.exports = robot