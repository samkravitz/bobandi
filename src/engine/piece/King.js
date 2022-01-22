const { Piece } = require('./Piece')
const { isInBounds } = require('../util')

class King extends Piece {
    constructor(color, square) {
        super(color, square)
        this.attackedSquares = []
    }

    getLegalMoves(board, checkForCastle = true) {
        const res = []

        if (this.isCaptured)
            return res

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
        
        if (checkForCastle)
            this.getCastleMoves(board).forEach(move => res.push({ ...move }))
        
        return res
    }

    updateAttackedSquares(board) {
        if (this.isCaptured) {
            this.attackedSquares = []
            return
        }

        this.attackedSquares = this.getLegalMoves(board, false)
            .map(move => ({ ...move.newSquare }))
    }

    canCastleKingside(board) {
        // we can't castle if our king has moved
        if (this.moves.length !== 0)
            return false
        
        // we can't castle if our kingside rook has moved either
        const kingsideRook = this.isWhite() ? board.pieces[7] : board.pieces[23]
        if (kingsideRook.moves.length !== 0)
            return false
        
        // we can't castle if there is a piece on the board in between the king and the rook
        const direction = this.isWhite() ? 1 : -1
        if ((board.pieceOnSquare({ rank: this.square.rank, file: this.square.file + direction })) ||
            (board.pieceOnSquare({ rank: this.square.rank, file: this.square.file + 2 * direction }))) {
                return false
        }

        // we can't castle if we are in check
        if (board.isInCheck(this.color))
            return false

        // we can't castle through check
        board.makeMove({ oldSquare: { ...this.square }, newSquare: { rank: this.square.rank, file: this.square.file + direction }})

        if (board.isInCheck(this.color)) {
            board.undoLastMove()
            return false
        }

        board.undoLastMove()

        // now check if the final castled position is in check
        board.makeMove({ oldSquare: { ...this.square }, newSquare: { rank: this.square.rank, file: this.square.file + 2 * direction }})
        board.makeMove({ oldSquare: { ...kingsideRook.square }, newSquare: { rank: kingsideRook.square.rank, file: kingsideRook.square.file + 2 * -direction }})

        if (board.isInCheck(this.color)) {
            board.undoLastMove()
            board.undoLastMove()
            return false
        }

        board.undoLastMove()
        board.undoLastMove()

        // finally! we have determined that we can castle kingside.
        return true
    }

    canCastleQueenside(board) {
        // we can't castle if our king has moved
        if (this.moves.length !== 0)
            return false
        
        // we can't castle if our queenside rook has moved either
        const queensideRook = this.isWhite() ? board.pieces[0] : board.pieces[16]
        if (queensideRook.moves.length !== 0)
            return false
        
        // we can't castle if there is a piece on the board in between the king and the rook
        const direction = this.isWhite() ? -1 : 1
        if ((board.pieceOnSquare({ rank: this.square.rank, file: this.square.file + direction })) ||
            (board.pieceOnSquare({ rank: this.square.rank, file: this.square.file + 2 * direction })) ||
            (board.pieceOnSquare({ rank: this.square.rank, file: this.square.file + 3 * direction }))) {
                return false
        }

        // we can't castle if we are in check
        if (board.isInCheck(this.color))
            return false

        // we can't castle through check
        board.makeMove({ oldSquare: { ...this.square }, newSquare: { rank: this.square.rank, file: this.square.file + direction }})

        if (board.isInCheck(this.color)) {
            board.undoLastMove()
            return false
        }

        board.undoLastMove()

        // now check if the final castled position is in check
        board.makeMove({ oldSquare: { ...this.square }, newSquare: { rank: this.square.rank, file: this.square.file + 2 * direction }})
        board.makeMove({ oldSquare: { ...queensideRook.square }, newSquare: { rank: queensideRook.square.rank, file: queensideRook.square.file + 3 * -direction }})

        if (board.isInCheck(this.color)) {
            board.undoLastMove()
            board.undoLastMove()
            return false
        }

        board.undoLastMove()
        board.undoLastMove()

        // finally! we have determined that we can castle queenside.
        return true
    }

    getCastleMoves(board) {
        const castleMoves = []

        if (this.canCastleKingside(board)) {
            const direction = this.isWhite() ? 1 : -1
            castleMoves.push({
                oldSquare: { ...this.square },
                newSquare: { rank: this.square.rank, file: this.square.file + 2 * direction },
                isCastle: true,
            })
        }

        if (this.canCastleQueenside(board)) {
            const direction = this.isWhite() ? -1 : 1
            castleMoves.push({
                oldSquare: { ...this.square },
                newSquare: { rank: this.square.rank, file: this.square.file + 2 * direction },
                isCastle: true,
            })
        }

        return castleMoves
    }

    toString() {
        return this.isWhite() ? 'K' : 'k'
    }
}

module.exports = {
    King,
}