const { Piece } = require('./Piece')

class Pawn extends Piece {
    constructor(color, square) {
        super(color, square)
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

        // pawn is at edge of board, cannot push any further
        if ((this.isWhite() && this.square.rank === 7) ||
            (!this.isWhite() && this.square.rank === 0)) {
                return res
        }

        const direction = this.isWhite() ? 1 : -1
        if (!board.pieceOnSquare({ rank: this.square.rank + direction, file: this.square.file }))
            res.push({ oldSquare: { ...this.square }, newSquare: { rank: this.square.rank + direction, file: this.square.file }})
        
        else if (this.isOnHomeRank()) {
            if (!board.pieceOnSquare({ rank: this.square.rank + 2 * direction, file: this.square.file }))
                res.push({ oldSquare: { ...this.square }, newSquare: { rank: this.square.rank + 2 * direction, file: this.square.file }})
        }
        return res
    }

    toString() {
        return this.isWhite() ? 'P' : 'p'
    }
}

module.exports = {
    Pawn,
}