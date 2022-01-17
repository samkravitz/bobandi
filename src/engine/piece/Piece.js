const Color = {
   white: 'white',
   black: 'black',
}

class Piece {
    constructor(color, square) {
        this.color = color
        this.square = square
    }

    isWhite() {
        return this.color === Color.white
    }

    toString() {
        throw new Error('Method toString() must be implemented.')
    }
}

module.exports = {
    Piece,
    Color,
}
