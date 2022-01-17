const { Piece } = require('./Piece')

class Knight extends Piece {
    constructor(color, square) {
        super(color, square)
    }

    toString() {
        return this.isWhite() ? 'N' : 'n'
    }
}

module.exports = {
    Knight,
}