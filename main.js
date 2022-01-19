require('dotenv').config()
const axios = require('axios')
const hyperquest = require('hyperquest')
const ndjson = require('ndjson')

const { Board } = require('./src/engine/Board')
const { Color } = require('./src/engine/piece')

const headers = {
    Authorization: `Bearer ${process.env.lichessToken}`,
    Accept: 'application/x-ndjson',
}

const gameId = 'oKlwlvjS'
let board
let color

const handleData = data => {
    switch (data.type) {
        case 'gameFull':
            color = data.white.name === 'bobandi' ? Color.white : Color.black
            axios.post(`https://lichess.org/api/bot/game/${gameId}/chat`, {
                room: 'player',
                text: `Thanks for the challenge! I love playing the ${color} pieces. Let's get started!`
            }, { headers })
                .catch(err => console.log('error sending chat'))

            board = new Board()
            board.parseUciMoves(data.state.moves)
            break
        case 'gameState':
            board = new Board()
            board.parseUciMoves(data.moves)
            const legalMoves = board.getLegalMoves(color)

            // no legal moves, so we must resign the game :(
            if (legalMoves.length === 0) {
                console.log('we have no moves!')
                axios.post(`https://lichess.org/api/bot/game/${gameId}/chat`, {
                    room: 'player',
                    text: 'I\'m out of moves! Remember I am still a very weak player. Let\'s play again soon!'
                }, { headers })
                    .catch(err => console.log('error sending chat'))

                axios.post(`https://lichess.org/api/bot/game/${gameId}/resign`, {}, { headers })
                    .catch(err => console.log('error resigning 1'))
                break
            }

            // pick a random legal move and play it
            const move = legalMoves[Math.floor(Math.random() * legalMoves.length)]
            axios.post(`https://lichess.org/api/bot/game/${gameId}/move/${move}`, {}, { headers })
                .catch(err => {
                    if (err.response?.status === 400) {
                        // this is fine, it's just not our turn
                       if (err.response.data.error === 'Not your turn, or game already over') {
                            console.log('its fine, its just not our turn!')
                            axios.post(`https://lichess.org/api/bot/game/${gameId}/chat`, {
                                room: 'player',
                                text: 'Fantastic move!! Let me analyze...'
                            }, { headers })
                                .catch(err => console.log('error sending chat'))
                       }                        
                        // Our move is not legal, so we must resign the game :(
                        else {
                            console.log('Our move was illegal!', err.response.data.error)
                            axios.post(`https://lichess.org/api/bot/game/${gameId}/chat`, {
                                room: 'player',
                                text: 'I\'m out of moves! Remember I am still a very weak player. Let\'s play again soon!'
                            }, { headers })
                                .catch(err => console.log('error sending chat'))
                            axios.post(`https://lichess.org/api/bot/game/${gameId}/resign`, {}, { headers })
                        }
                    }
                })

            break
        case 'chatLine':
            console.log(data)
            break
    }
}

hyperquest(`https://lichess.org/api/bot/game/stream/${gameId}`, { headers })
    .pipe(ndjson.parse())
    .on('data', data => handleData(data))

//axios.get('https://lichess.org/api/account', { headers })
//    .then(res => console.log(res.data))
