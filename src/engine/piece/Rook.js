const { Piece } = require('./Piece')

class Rook extends Piece {
    constructor(color, square) {
        super(color, square)
    }

    toString() {
        return this.isWhite() ? 'R' : 'r'
    }
}

module.exports = {
    Rook,
}