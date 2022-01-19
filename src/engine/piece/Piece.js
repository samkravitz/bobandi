const Color = {
   white: 'white',
   black: 'black',
}

class Piece {
    constructor(color, square) {
        this.color = color
        this.square = square
        this.isCaptured = false
    }

    isWhite() {
        return this.color === Color.white
    }

    opponentPieceOnSquare(board, rank, file) {
        const piece = board.board[rank][file]
        if (piece === 0)
            return false
        
        return this.color !== piece.color
    }

    friendlyPieceOnSquare(board, rank, file) {
        const piece = board.board[rank][file]
        if (piece === 0)
            return false
        
        return this.color === piece.color
    }

    getLegalMoves(board) {
        throw new Error('Method getLegalMoves must be implemented.')
    }

    toString() {
        throw new Error('Method toString() must be implemented.')
    }
}

module.exports = {
    Piece,
    Color,
}
