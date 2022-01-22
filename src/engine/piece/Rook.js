const { Piece } = require('./Piece')
const { isInBounds } = require('../util')

class Rook extends Piece {
    constructor(color, square) {
        super(color, square)
        this.attackedSquares = []
        this.value = 5
    }

    getLegalMoves(board) {
        const res = []

        if (this.isCaptured)
            return res

        const currentSquare = this.square

        // send rook up
        let square = { rank: currentSquare.rank + 1, file: currentSquare.file }
        while (isInBounds(square)) {
            if (this.friendlyPieceOnSquare(board, square.rank, square.file))
                break
            
            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

            if (this.opponentPieceOnSquare(board, square.rank, square.file))
                break

            square.rank++
        }

        // send rook down
        square = { rank: currentSquare.rank - 1, file: currentSquare.file }
        while (isInBounds(square)) {
            if (this.friendlyPieceOnSquare(board, square.rank, square.file))
                break

            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

            if (this.opponentPieceOnSquare(board, square.rank, square.file))
                break

            square.rank--
        }

        // send rook right
        square = { rank: currentSquare.rank, file: currentSquare.file + 1 }
        while (isInBounds(square)) {
            if (this.friendlyPieceOnSquare(board, square.rank, square.file))
                break

            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

            if (this.opponentPieceOnSquare(board, square.rank, square.file))
                break

            square.file++
        }

        // send rook left
        square = { rank: currentSquare.rank, file: currentSquare.file - 1 }
        while (isInBounds(square)) {
            if (this.friendlyPieceOnSquare(board, square.rank, square.file))
                break

            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

            if (this.opponentPieceOnSquare(board, square.rank, square.file))
                break

            square.file--
        }

        return res
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
        return this.isWhite() ? 'R' : 'r'
    }
}

module.exports = {
    Rook,
}