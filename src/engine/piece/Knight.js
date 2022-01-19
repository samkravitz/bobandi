const { Piece } = require('./Piece')
const { isInBounds } = require('../util')

class Knight extends Piece {
    constructor(color, square) {
        super(color, square)
        
        // initial attacking squares
        if (this.square.rank === 0 && this.square.file === 1) {
            this.attackedSquares = [{ rank: 2, file: 0}, { rank: 2, file: 2}]
        } else if (this.square.rank === 0 && this.square.file === 6) {
            this.attackedSquares = [{ rank: 2, file: 5}, { rank: 2, file: 7}]
        } else if (this.square.rank === 0 && this.square.file === 1) {
            this.attackedSquares = [{ rank: 5, file: 0}, { rank: 5, file: 2}]
        } else {
            this.attackedSquares = [[{ rank: 5, file: 5}, { rank: 5, file: 7}]]
        }
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

    updateAttackedSquares(board) {
        if (this.isCaptured) {
            this.attackedSquares = []
            return
        }

        this.attackedSquares = this.getLegalMoves(board)
            .map(move => ({ ...move.newSquare }))
    }

    toString() {
        return this.isWhite() ? 'N' : 'n'
    }
}

module.exports = {
    Knight,
}