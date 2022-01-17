const { Piece } = require('./Piece')

class Pawn extends Piece {
    constructor(color, square) {
        super(color, square)
    }

    toString() {
        return this.isWhite() ? 'P' : 'p'
    }
}

module.exports = {
    Pawn,
}