const { Board } = require('./Board')

const board = new Board()
board.parseUciMoves('e2e4 e7e5')
console.log(board.toString())