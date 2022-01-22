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

        const enPassantMove = this.getEnPassantMove(board)
        if (enPassantMove.rank)
            res.push({ oldSquare: { ...this.square }, newSquare: { ...enPassantMove } })
        
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

    getEnPassantMove(board) {
        const res = {}
        // a pawn can only en passant if it is on rank 4 (white) or 5 (black)
        if (this.isWhite() && this.square.rank !== 4)
            return res
        
        if (!this.isWhite() && this.square.rank !== 3)
            return res

        // a pawn can only en passant if the last move was a pawn move that moved the pawn 2 squares and put the pawn 
        // on rank 4 (white) or 5 (black)

        const lastMove = board.moves.pop()

        if (!lastMove)
            return res

        const lastMovedPiece = board.board[lastMove.newSquare.rank][lastMove.newSquare.file]

        // the last moved piece was not a pawn
        if (!lastMovedPiece instanceof Pawn) {
            board.moves.push({ ...lastMove })
            return res
        }
        
        // the last move was not a 2 square move
        if (Math.abs(lastMove.newSquare.rank - lastMove.oldSquare.rank) !== 2) {
            board.moves.push({ ...lastMove })
            return res
        }

        // the last move did not put the pawn directly next to our pawn
        if ((lastMove.newSquare.file !== this.square.file + 1) && (lastMove.newSquare.file !== this.square.file - 1)) {
            board.moves.push({ ...lastMove })
            return res
        }

        // finally! we have determined that we can en passant.

        const direction = this.isWhite() ? 1 : -1
        
        res.rank = this.square.rank + direction
        if (lastMove.newSquare.file === this.square.file + 1)
            res.file = this.square.file + 1
        else
            res.file = this.square.file - 1

        board.moves.push({ ...lastMove })
        return res
    }

    toString() {
        return this.isWhite() ? 'P' : 'p'
    }
}

module.exports = {
    Pawn,
}