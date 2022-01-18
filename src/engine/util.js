const BOARD_WIDTH = 8

/**
 * 
 * @param {*} square object that contains rank & file as array indices ex: { rank: 0, file: 5 }
 * @returns true if the given square is a square on the board
 * 
 * example invocation:
 * isInBounds({ rank: 1, file: 4}) => true
 */
const isInBounds = square => {
    return (
        square.rank >= 0 &&
        square.rank < BOARD_WIDTH &&
        square.file >= 0 &&
        square.file < BOARD_WIDTH
    )
}

/**
 * Takes in an old square and new square as array indices and calculates the equivalent UCI move
 * 
 * @param {*} oldSquare object that contains rank & file as array indices ex: { rank: 0, file: 5 }
 * @param {*} newSquare object that contains rank & file as array indices ex: { rank: 2, file: 3 }
 * @returns String of uci move
 * 
 * example invocation:
 * uciStringFromMove({ rank: 1, file: 4 }, { rank: 3, file: 4 }) => 'e2e4'
 */
const uciStringFromMove = (oldSquare, newSquare) => {
    let res = ''
    res += String.fromCharCode(oldSquare.file + 'a'.charCodeAt())
    res += oldSquare.rank + 1
    res += String.fromCharCode(newSquare.file + 'a'.charCodeAt())
    res += newSquare.rank + 1
    return res
}

module.exports = {
    isInBounds,
    uciStringFromMove,
}
