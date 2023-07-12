const { YoutubeTranscript } = require('youtube-transcript')
const fs = require('fs')
const allVideos = require('./allvideos')

const allVideosTranscription = []; // Objetct{url: string, transcription: string}

const createFile = (text) => {
    console.log('NOW', text)
    var stream = fs.createWriteStream("my_file.json");
    stream.once('open', function (fd) {
        stream.write(text);
        stream.end();
    });
}
const getVideoTranscription = async (watchCode) => {
    const url = `https://www.youtube.com/watch?v=${watchCode}&ab_channel=FrancoEscamilla`
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
    console.log(allVideos.length);
    for (let index = 0; index < allVideos.length; index++) {
        console.log(index)
        await getVideoTranscription(allVideos[index])
    }
    // const allResponses = allVideos.map(getVideoTranscription);
    // await Promise.all(allResponses);
    createFile(JSON.stringify(allVideosTranscription, null, 2));
}

awaitPromises();