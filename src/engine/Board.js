const { Bishop, King, Knight, Pawn, Queen, Rook, Color } = require('./piece')
const { uciStringFromMove } = require ('./util')

class Board {
    constructor() {
        const whiteRook1 =   new Rook(Color.white,   { rank: 0, file: 0 })
        const whiteRook2 =   new Rook(Color.white,   { rank: 0, file: 7 })
        const whiteKnight1 = new Knight(Color.white, { rank: 0, file: 1 })
        const whiteKnight2 = new Knight(Color.white, { rank: 0, file: 6 })
        const whiteBishop1 = new Bishop(Color.white, { rank: 0, file: 2 })
        const whiteBishop2 = new Bishop(Color.white, { rank: 0, file: 5 })
        const whiteQueen =   new Queen(Color.white,  { rank: 0, file: 3 })
        const whiteKing =    new King(Color.white,   { rank: 0, file: 4 })
        const whitePawn1 =   new Pawn(Color.white,   { rank: 1, file: 0 })
        const whitePawn2 =   new Pawn(Color.white,   { rank: 1, file: 1 })
        const whitePawn3 =   new Pawn(Color.white,   { rank: 1, file: 2 })
        const whitePawn4 =   new Pawn(Color.white,   { rank: 1, file: 3 })
        const whitePawn5 =   new Pawn(Color.white,   { rank: 1, file: 4 })
        const whitePawn6 =   new Pawn(Color.white,   { rank: 1, file: 5 })
        const whitePawn7 =   new Pawn(Color.white,   { rank: 1, file: 6 })
        const whitePawn8 =   new Pawn(Color.white,   { rank: 1, file: 7 })

        const blackRook1 =   new Rook(Color.black,   { rank: 7, file: 0 })
        const blackRook2 =   new Rook(Color.black,   { rank: 7, file: 7 })
        const blackKnight1 = new Knight(Color.black, { rank: 7, file: 1 })
        const blackKnight2 = new Knight(Color.black, { rank: 7, file: 6 })
        const blackBishop1 = new Bishop(Color.black, { rank: 7, file: 2 })
        const blackBishop2 = new Bishop(Color.black, { rank: 7, file: 5 })
        const blackQueen =   new Queen(Color.black,  { rank: 7, file: 3 })
        const blackKing =    new King(Color.black,   { rank: 7, file: 4 })
        const blackPawn1 =   new Pawn(Color.black,   { rank: 6, file: 0 })
        const blackPawn2 =   new Pawn(Color.black,   { rank: 6, file: 1 })
        const blackPawn3 =   new Pawn(Color.black,   { rank: 6, file: 2 })
        const blackPawn4 =   new Pawn(Color.black,   { rank: 6, file: 3 })
        const blackPawn5 =   new Pawn(Color.black,   { rank: 6, file: 4 })
        const blackPawn6 =   new Pawn(Color.black,   { rank: 6, file: 5 })
        const blackPawn7 =   new Pawn(Color.black,   { rank: 6, file: 6 })
        const blackPawn8 =   new Pawn(Color.black,   { rank: 6, file: 7 })

        // representation of all 64 squares
        this.board = [
            [
                whiteRook1,
                whiteKnight1,
                whiteBishop1,
                whiteQueen,
                whiteKing,
                whiteBishop2,
                whiteKnight2,
                whiteRook2,
            ],
            [
                whitePawn1,
                whitePawn2,
                whitePawn3,
                whitePawn4,
                whitePawn5,
                whitePawn6,
                whitePawn7,
                whitePawn8
            ],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [
                blackPawn1,
                blackPawn2,
                blackPawn3,
                blackPawn4,
                blackPawn5,
                blackPawn6,
                blackPawn7,
                blackPawn8
            ],
            [
                blackRook1,
                blackKnight1,
                blackBishop1,
                blackQueen,
                blackKing,
                blackBishop2,
                blackKnight2,
                blackRook2,
            ],
        ]

        // representation of just the pieces for fast lookups
        this.pieces = [
            whiteRook1, whiteKnight1, whiteBishop1, whiteQueen, whiteKing, whiteBishop2, whiteKnight2, whiteRook2,
            whitePawn1, whitePawn2, whitePawn3, whitePawn4, whitePawn5, whitePawn6, whitePawn7, whitePawn8,
            blackRook1, blackKnight1, blackBishop1, blackQueen, blackKing, blackBishop2, blackKnight2, blackRook2,
            blackPawn1, blackPawn2, blackPawn3, blackPawn4, blackPawn5, blackPawn6, blackPawn7, blackPawn8,
        ]

        this.tempMoveWasCapture = false
        this.tempMoveCapturedPiece = null
        this.tempMove = {}
    }

    pieceOnSquare(square) {
        return this.board[square.rank][square.file] !== 0
    }

    parseUciMove(move) {
        const oldFile = move.charCodeAt(0) - 'a'.charCodeAt()
        const oldRank = move.charAt(1) - 1
        const newFile = move.charCodeAt(2) - 'a'.charCodeAt()
        const newRank = move.charAt(3) - 1

        this.makeMove({ oldSquare: { file: oldFile, rank: oldRank }, newSquare: { file: newFile, rank: newRank } })
    }

    parseUciMoves(moves) {
        if (moves === '')
            return
        moves.split(' ').forEach(move => this.parseUciMove(move))
    }

    getLegalMoves() {
        const black = []
        const white = []

        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                if (!this.pieceOnSquare({ rank, file }))
                    continue
                
                const piece = this.board[rank][file]
                if (piece.isWhite())
                    white.push(...piece.getLegalMoves(this))
                else
                    black.push(...piece.getLegalMoves(this))
            }
        }
        
        return {
            black: black.map(move => uciStringFromMove(move.oldSquare, move.newSquare)),
            white: white.map(move => uciStringFromMove(move.oldSquare, move.newSquare)),
        }
    }

    getSquaresWhiteAttacks() {
        const res = []
        this.pieces.slice(0, 16).forEach(piece => res.push(...piece.attackedSquares))
        return res
    }

    getSquaresBlackAttacks() {
        const res = []
        this.pieces.slice(16, 32).forEach(piece => res.push(...piece.attackedSquares))
        return res
    }

    makeMove(move) {
        const oldRank = move.oldSquare.rank
        const oldFile = move.oldSquare.file
        const newRank = move.newSquare.rank
        const newFile = move.newSquare.file

        if (this.pieceOnSquare(move.newSquare)) {
            const capturedPiece = this.board[newRank][newFile]
            capturedPiece.move({ rank: 8, file: 8 })
            capturedPiece.isCaptured = true
        }

        const piece = this.board[oldRank][oldFile]
        piece.move({ rank: newRank, file: newFile })

        this.board[newRank][newFile] = piece
        this.board[oldRank][oldFile] = 0

        this.pieces.forEach(piece => piece.updateAttackedSquares(this))
    }

    makeTempMove(move) {
        if (this.pieceOnSquare(move.newSquare)) {
            const capturedPiece = this.board[move.newSquare.rank][move.newSquare.file]
            this.tempMoveWasCapture = true
            this.tempMoveCapturedPiece = capturedPiece
        }

        this.makeMove(move)
        this.tempMove = move
    }

    undoTempMove() {
        const movedPiece = this.board[this.tempMove.newSquare.rank][this.tempMove.newSquare.file]
        this.board[this.tempMove.oldSquare.rank][this.tempMove.oldSquare.file] = movedPiece
        this.board[this.tempMove.newSquare.rank][this.tempMove.newSquare.file] = 0
        movedPiece.move({ rank: this.tempMove.oldSquare.rank, file: this.tempMove.oldSquare.file })

        if (this.tempMoveWasCapture) {
            this.board[this.tempMove.newSquare.rank][this.tempMove.newSquare.file] = this.tempMoveCapturedPiece
            this.tempMoveCapturedPiece.move({ rank: this.tempMove.newSquare.rank, file: this.tempMove.newSquare.file })
            this.tempMoveCapturedPiece.isCaptured = false
        }

        this.pieces.forEach(piece => piece.updateAttackedSquares(this))
        this.tempMoveWasCapture = false
    }

    toString() {
        let res = ''
        for (let rank = 7; rank >= 0; rank--) {
            for (let file = 0; file < 8; file++) {
                if (this.pieceOnSquare({ rank, file }))
                    res += this.board[rank][file].toString()
                else
                    res += '*'
                res += ' '
            }
            res += '\n'
        }
        return res
    }
}

module.exports = {
    Board,
}