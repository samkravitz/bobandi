require('dotenv').config()
const axios = require('axios')
const hyperquest = require('hyperquest')
const ndjson = require('ndjson')

const headers = {
    Authorization: `Bearer ${process.env.lichessToken}`,
    Accept: 'application/x-ndjson',
}

hyperquest('https://lichess.org/api/bot/game/stream/wfFigTQaXM9S', { headers })
    .pipe(ndjson.parse())
    .on('data', console.log)

//axios.get('https://lichess.org/api/account', { headers })
//    .then(res => console.log(res.data))
