const { Piece } = require('./Piece')
const { isInBounds } = require('../util')

class King extends Piece {
    constructor(color, square) {
        super(color, square)
    }

    getLegalMoves(board) {
        const res = []
        const currentSquare = this.square

        // send king up
        let square = { rank: currentSquare.rank + 1, file: currentSquare.file }
        if (isInBounds(square) && !this.friendlyPieceOnSquare(board, square.rank, square.file))
            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

        // send king down
        square = { rank: currentSquare.rank - 1, file: currentSquare.file }
        if (isInBounds(square) && !this.friendlyPieceOnSquare(board, square.rank, square.file))
            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

        // send king right
        square = { rank: currentSquare.rank, file: currentSquare.file + 1 }
        if (isInBounds(square) && !this.friendlyPieceOnSquare(board, square.rank, square.file))
            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

        // send king left
        square = { rank: currentSquare.rank, file: currentSquare.file - 1 }
        if (isInBounds(square) && !this.friendlyPieceOnSquare(board, square.rank, square.file))
            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

        // send king up right
        square = { rank: currentSquare.rank + 1, file: currentSquare.file + 1 }
        if (isInBounds(square) && !this.friendlyPieceOnSquare(board, square.rank, square.file))
            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

        // send king up left
        square = { rank: currentSquare.rank + 1, file: currentSquare.file - 1 }
        if (isInBounds(square) && !this.friendlyPieceOnSquare(board, square.rank, square.file))
            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

        // send king down right
        square = { rank: currentSquare.rank - 1, file: currentSquare.file + 1 }
        if (isInBounds(square) && !this.friendlyPieceOnSquare(board, square.rank, square.file))
            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

        // send king down left
        square = { rank: currentSquare.rank - 1, file: currentSquare.file - 1 }
        if (isInBounds(square) && !this.friendlyPieceOnSquare(board, square.rank, square.file))
            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})
        
        return res
    }

    toString() {
        return this.isWhite() ? 'K' : 'k'
    }
}

module.exports = {
    King,
}