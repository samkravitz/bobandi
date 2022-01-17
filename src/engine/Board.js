const { Bishop, King, Knight, Pawn, Queen, Rook, Color } = require('./piece')
const { uciStringFromMove } = require ('./util')

class Board {
    constructor() {
        this.board = [
            [
                new Rook(Color.white,   { rank: 0, file: 0 }),
                new Knight(Color.white, { rank: 0, file: 1 }),
                new Bishop(Color.white, { rank: 0, file: 2 }),
                new Queen(Color.white,  { rank: 0, file: 3 }),
                new King(Color.white,   { rank: 0, file: 4 }),
                new Bishop(Color.white, { rank: 0, file: 5 }),
                new Knight(Color.white, { rank: 0, file: 6 }),
                new Rook(Color.white,   { rank: 0, file: 7 }),
            ],
            [
                new Pawn(Color.white, { rank: 1, file: 0 }),
                new Pawn(Color.white, { rank: 1, file: 1 }),
                new Pawn(Color.white, { rank: 1, file: 2 }),
                new Pawn(Color.white, { rank: 1, file: 3 }),
                new Pawn(Color.white, { rank: 1, file: 4 }),
                new Pawn(Color.white, { rank: 1, file: 5 }),
                new Pawn(Color.white, { rank: 1, file: 6 }),
                new Pawn(Color.white, { rank: 1, file: 7 }),
            ],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [
                new Pawn(Color.black, { rank: 6, file: 0 }),
                new Pawn(Color.black, { rank: 6, file: 1 }),
                new Pawn(Color.black, { rank: 6, file: 2 }),
                new Pawn(Color.black, { rank: 6, file: 3 }),
                new Pawn(Color.black, { rank: 6, file: 4 }),
                new Pawn(Color.black, { rank: 6, file: 5 }),
                new Pawn(Color.black, { rank: 6, file: 6 }),
                new Pawn(Color.black, { rank: 6, file: 7 }),
            ],
            [
                new Rook(Color.black,   { rank: 7, file: 0 }),
                new Knight(Color.black, { rank: 7, file: 1 }),
                new Bishop(Color.black, { rank: 7, file: 2 }),
                new Queen(Color.black,  { rank: 7, file: 3 }),
                new King(Color.black,   { rank: 7, file: 4 }),
                new Bishop(Color.black, { rank: 7, file: 5 }),
                new Knight(Color.black, { rank: 7, file: 6 }),
                new Rook(Color.black,   { rank: 7, file: 7 }),
            ],
        ]
    }

    pieceOnSquare(square) {
        return this.board[square.rank][square.file] !== 0
    }

    parseUciMove(move) {
        const oldFile = move.charCodeAt(0) - 'a'.charCodeAt()
        const oldRank = move.charAt(1) - 1
        const newFile = move.charCodeAt(2) - 'a'.charCodeAt()
        const newRank = move.charAt(3) - 1

        this.board[newRank][newFile] = this.board[oldRank][oldFile]
        this.board[newRank][newFile].square = { rank: newRank, file: newFile }
        this.board[oldRank][oldFile] = 0
    }

    parseUciMoves(moves) {
        if (moves === '')
            return
        moves.split(' ').forEach(move => this.parseUciMove(move))
    }

    getLegalMoves() {
        const black = []
        const white = []

        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                if (!this.pieceOnSquare({ rank, file }))
                    continue
                
                const piece = this.board[rank][file]
                if (piece.isWhite())
                    white.push(...piece.getLegalMoves(this))
                else
                    black.push(...piece.getLegalMoves(this))
            }
        }
        
        return {
            black: black.map(move => uciStringFromMove(move.oldSquare, move.newSquare)),
            white: white.map(move => uciStringFromMove(move.oldSquare, move.newSquare)),
        }
    }

    toString() {
        let res = ''
        for (let rank = 7; rank >= 0; rank--) {
            for (let file = 0; file < 8; file++) {
                if (this.pieceOnSquare({ rank, file }))
                    res += this.board[rank][file].toString()
                else
                    res += '*'
                res += ' '
            }
            res += '\n'
        }
        return res
    }
}

module.exports = {
    Board,
}