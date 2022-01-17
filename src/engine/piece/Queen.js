const { Piece } = require('./Piece')

class Queen extends Piece {
    constructor(color, square) {
        super(color, square)
    }

    toString() {
        return this.isWhite() ? 'Q' : 'q'
    }
}

module.exports = {
    Queen,
}