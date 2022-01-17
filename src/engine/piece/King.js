const { Piece } = require('./Piece')

class King extends Piece {
    constructor(color, square) {
        super(color, square)
    }

    toString() {
        return this.isWhite() ? 'K' : 'k'
    }
}

module.exports = {
    King,
}