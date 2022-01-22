const { isInBounds } = require('../util')
const { Piece } = require('./Piece')

class Pawn extends Piece {
    constructor(color, square) {
        super(color, square)

        const attackedSquares = []
        this.attackedSquares = []
        if (this.isWhite()) {
            attackedSquares.push({ rank: this.square.rank + 1, file: this.square.file + 1 })
            attackedSquares.push({ rank: this.square.rank + 1, file: this.square.file - 1 })
        } else {
            attackedSquares.push({ rank: this.square.rank - 1, file: this.square.rank + 1 })
            attackedSquares.push({ rank: this.square.rank - 1, file: this.square.rank + 1 })
        }
        this.attackedSquares = attackedSquares.filter(square => isInBounds(square))
    }

    isOnHomeRank() {
        if (this.isWhite())
            return this.square.rank === 1
        else
            return this.square.rank === 6
    }

    /**
     * @TODO - en passant and make sure the move doesn't put us in check
     */
    getLegalMoves(board) {
        const res = []

        if (this.isCaptured)
            return res

        // pawn is at edge of board, cannot push any further
        if ((this.isWhite() && this.square.rank === 7) ||
            (!this.isWhite() && this.square.rank === 0)) {
                return res
        }

        const direction = this.isWhite() ? 1 : -1
        if (!board.pieceOnSquare({ rank: this.square.rank + direction, file: this.square.file })) {
            res.push({ oldSquare: { ...this.square }, newSquare: { rank: this.square.rank + direction, file: this.square.file }})
            
            // pawn is on home rank, so it can move forward 2 squares
            if (this.isOnHomeRank() && !board.pieceOnSquare({ rank: this.square.rank + 2 * direction, file: this.square.file }))
                res.push({ oldSquare: { ...this.square }, newSquare: { rank: this.square.rank + 2 * direction, file: this.square.file }})
        }
        
        return res
    }

    updateAttackedSquares(board) {
        if (this.isCaptured) {
            this.attackedSquares = []
            return
        }

        this.attackedSquares = []
        if (this.isWhite()) {
            this.attackedSquares.push({ rank: this.square.rank + 1, file: this.square.file + 1 })
            this.attackedSquares.push({ rank: this.square.rank + 1, file: this.square.file - 1 })
        } else {
            this.attackedSquares.push({ rank: this.square.rank - 1, file: this.square.file + 1 })
            this.attackedSquares.push({ rank: this.square.rank - 1, file: this.square.file - 1 })
        }
        this.attackedSquares = this.attackedSquares.filter(square => isInBounds(square))
    }

    toString() {
        return this.isWhite() ? 'P' : 'p'
    }
}

module.exports = {
    Pawn,
}