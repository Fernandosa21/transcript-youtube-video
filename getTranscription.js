const { YoutubeTranscript } = require('youtube-transcript')
const fs = require('fs')
const allVideos = require('./allvideos')

const allVideosTranscription = []; 

const createFile = (text) => {
    var stream = fs.createWriteStream("transcription.json");
    stream.once('open', function (fd) {
        stream.write(text);
        stream.end();
    });
}
const getVideoTranscription = async (url) => {
    try {
        await YoutubeTranscript.fetchTranscript(url)
        .then((items, index) => {
            const videoTranscription = items.reduce((acc, item) => {
                return `${acc} ${item.text}`;
            }, '')
            const transcriptionObject = {
                url,
                transcription: videoTranscription
            }
            allVideosTranscription.push(transcriptionObject)
        });
    } catch (error) {
        allVideosTranscription.push({
            url,
            transcription: 'NA'
        })
    }
}
const awaitPromises = async () => {
    for (let index = 0; index < allVideos.length; index++) {
        await getVideoTranscription(allVideos[index])
    }
    createFile(JSON.stringify(allVideosTranscription, null, 2));
}

awaitPromises();