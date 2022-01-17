require('dotenv').config()
const axios = require('axios')

const headers = {
    Authorization: `Bearer ${process.env.lichessToken}`,
}


axios.get('https://lichess.org/api/account', { headers })
    .then(res => console.log(res.data))