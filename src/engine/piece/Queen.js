const { Piece } = require('./Piece')
const { isInBounds } = require('../util')

class Queen extends Piece {
    constructor(color, square) {
        super(color, square)
    }

    getLegalMoves(board) {
        const res = []
        const currentSquare = this.square

        // send queen up
        let square = { rank: currentSquare.rank + 1, file: currentSquare.file }
        while (isInBounds(square)) {
            if (this.friendlyPieceOnSquare(board, square.rank, square.file))
                break
            
            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

            if (this.opponentPieceOnSquare(board, square.rank, square.file))
                break

            square.rank++
        }

        // send queen down
        square = { rank: currentSquare.rank - 1, file: currentSquare.file }
        while (isInBounds(square)) {
            if (this.friendlyPieceOnSquare(board, square.rank, square.file))
                break

            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

            if (this.opponentPieceOnSquare(board, square.rank, square.file))
                break

            square.rank--
        }

        // send queen right
        square = { rank: currentSquare.rank, file: currentSquare.file + 1 }
        while (isInBounds(square)) {
            if (this.friendlyPieceOnSquare(board, square.rank, square.file))
                break

            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

            if (this.opponentPieceOnSquare(board, square.rank, square.file))
                break

            square.file++
        }

        // send queen left
        square = { rank: currentSquare.rank, file: currentSquare.file - 1 }
        while (isInBounds(square)) {
            if (this.friendlyPieceOnSquare(board, square.rank, square.file))
                break

            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

            if (this.opponentPieceOnSquare(board, square.rank, square.file))
                break

            square.file--
        }

        // send queen up right
        square = { rank: currentSquare.rank + 1, file: currentSquare.file + 1 }
        while (isInBounds(square)) {
            if (this.friendlyPieceOnSquare(board, square.rank, square.file))
                break
            
            res.push({ oldSquare: { ...this.square }, newSquare: { rank: square.rank, file: square.file }})

            if (this.opponentPieceOnSquare(board, square.rank, square.file))
                break

            square.rank++
            square.file++
        }

        // send queen up left
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

        // send queen down right
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

        // send queen down left
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

    toString() {
        return this.isWhite() ? 'Q' : 'q'
    }
}

module.exports = {
    Queen,
}