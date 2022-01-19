const { Piece } = require('./Piece')
const { isInBounds } = require('../util')

class Bishop extends Piece {
    constructor(color, square) {
        super(color, square)
        this.attackedSquares = []
    }

    getLegalMoves(board) {
        const res = []

        if (this.isCaptured)
            return res

        const currentSquare = this.square

        // send bishop up right
        let square = { rank: currentSquare.rank + 1, file: currentSquare.file + 1 }
        while (isInBounds(square)) {
            if (this.friendlyPieceOnSquare(board, square.rank, square.file))
                break
            
            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

            if (this.opponentPieceOnSquare(board, square.rank, square.file))
                break

            square.rank++
            square.file++
        }

        // send bishop up left
        square = { rank: currentSquare.rank + 1, file: currentSquare.file - 1 }
        while (isInBounds(square)) {
            if (this.friendlyPieceOnSquare(board, square.rank, square.file))
                break

            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

            if (this.opponentPieceOnSquare(board, square.rank, square.file))
                break

            square.rank++
            square.file--
        }

        // send bishop down right
        square = { rank: currentSquare.rank - 1, file: currentSquare.file + 1 }
        while (isInBounds(square)) {
            if (this.friendlyPieceOnSquare(board, square.rank, square.file))
                break

            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

            if (this.opponentPieceOnSquare(board, square.rank, square.file))
                break

            square.rank--
            square.file++
        }

        // send bishop down left
        square = { rank: currentSquare.rank - 1, file: currentSquare.file - 1 }
        while (isInBounds(square)) {
            if (this.friendlyPieceOnSquare(board, square.rank, square.file))
                break

            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

            if (this.opponentPieceOnSquare(board, square.rank, square.file))
                break

            square.rank--
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
        return this.isWhite() ? 'B' : 'b'
    }
}

module.exports = {
    Bishop,
}