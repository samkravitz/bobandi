const { Piece } = require('./Piece')

class Bishop extends Piece {
    constructor(color, square) {
        super(color, square)
    }

    toString() {
        return this.isWhite() ? 'B' : 'b'
    }
}

module.exports = {
    Bishop,
}