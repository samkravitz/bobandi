const { Piece } = require('./Piece')
const { isInBounds } = require('../util')

class Knight extends Piece {
    constructor(color, square) {
        super(color, square)
    }

    getLegalMoves(board) {
        return [
            { rank: this.square.rank + 1, file: this.square.file + 2 },
            { rank: this.square.rank + 1, file: this.square.file - 2 },
            { rank: this.square.rank - 1, file: this.square.file + 2 },
            { rank: this.square.rank - 1, file: this.square.file - 2 },
            { rank: this.square.rank + 2, file: this.square.file + 1 },
            { rank: this.square.rank + 2, file: this.square.file - 1 },
            { rank: this.square.rank - 2, file: this.square.file + 1 },
            { rank: this.square.rank - 2, file: this.square.file - 1 },
        ]
            .filter(square => isInBounds(square))
            .filter(square => !this.friendlyPieceOnSquare(board, square.rank, square.file))
            .map(newSquare => ({ oldSquare: { ...this.square }, newSquare: { rank: newSquare.rank, file: newSquare.file }}))
    }

    toString() {
        return this.isWhite() ? 'N' : 'n'
    }
}

module.exports = {
    Knight,
}