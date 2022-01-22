const { Bishop, King, Knight, Pawn, Queen, Rook, Color } = require('./piece')
const { uciStringFromMove, squareEquals } = require ('./util')

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

        this.lastMoveWasCapture = false
        this.lastMoveCapturedPiece = null

        this.moves = []
    }

    pieceOnSquare(square) {
        return this.board[square.rank][square.file] !== 0
    }

    parseUciMove(move) {
        const oldFile = move.charCodeAt(0) - 'a'.charCodeAt()
        const oldRank = move.charAt(1) - 1
        const newFile = move.charCodeAt(2) - 'a'.charCodeAt()
        const newRank = move.charAt(3) - 1

        // check if move is castle
        let isCastle = false

        const pieceOnOldSquare = this.board[oldRank][oldFile]

        if (pieceOnOldSquare instanceof King) {
            // white kingside castle
            if (move === 'e1g1')
                isCastle = true
            // white queenside castle
            else if (move === 'e1c1')
                isCastle = true
            // black kingside castle
            else if (move === 'e7g7')
                isCastle = true
            // black queenside castle
            else if (move === 'e7c7')
                isCastle === true
        }

        this.makeMove({
            oldSquare: { file: oldFile, rank: oldRank },
            newSquare: { file: newFile, rank: newRank },
            isCastle,
        })
    }

    parseUciMoves(moves) {
        if (moves === '')
            return
        moves.split(' ').forEach(move => this.parseUciMove(move))
    }

    getLegalMoves(color) {
        const res = []
        const pieces = color === Color.white ? this.pieces.slice(0, 16) : this.pieces.slice(16, 32)
        pieces.forEach(piece => res.push(...piece.getLegalMoves(this)))

        return res
            .filter(move => {
                this.makeMove(move)            
                // keep only moves that do not put our color in check
                const ret = !this.isInCheck(color)
                this.undoLastMove()
                return ret
            })
            .map(move => uciStringFromMove(move.oldSquare, move.newSquare))
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

    isInCheck(color) {
        const attackedSquares = color === Color.white ? this.getSquaresBlackAttacks() : this.getSquaresWhiteAttacks()
        const kingSquare = color === Color.white ? this.pieces[4].square : this.pieces[20].square

        for (const square of attackedSquares) {
            if (squareEquals(kingSquare, square))
                return true
        }

        return false
    }

    makeMove(move) {
        const oldRank = move.oldSquare.rank
        const oldFile = move.oldSquare.file
        const newRank = move.newSquare.rank
        const newFile = move.newSquare.file

        if (move.isCastle) {
            let king
            let oldSquare
            // white castling
            if (newRank === 0) {
                king = this.pieces[4]
                oldSquare = { ...king.square }

                // kingside castle
                if (newFile === 6) {
                    const rook = this.pieces[7]
                    king.makeMove({ rank: 0, file: 6 })
                    rook.makeMove({ rank: 0, file: 5 })
                    this.board[0][6] = king
                    this.board[0][5] = rook
                    this.board[0][7] = 0
                }

                // queenside castle
                else {
                    const rook = this.pieces[0]
                    king.makeMove({ rank: 0, file: 2 })
                    rook.makeMove({ rank: 0, file: 3 })
                    this.board[0][2] = king
                    this.board[0][3] = rook
                    this.board[0][0] = 0
                }

                this.board[0][4] = 0
            }
            
            // black castling
            else if (newRank === 7) {
                king = this.pieces[20]
                oldSquare = { ...king.square }
                // kingside castle
                if (newFile === 6) {
                    const rook = this.pieces[23]
                    king.makeMove({ rank: 7, file: 6 })
                    rook.makeMove({ rank: 7, file: 5 })
                    this.board[7][6] = king
                    this.board[7][5] = rook
                    this.board[7][7] = 0
                }

                // queenside castle
                else {
                    const rook = this.pieces[16]
                    king.makeMove({ rank: 7, file: 2 })
                    rook.makeMove({ rank: 7, file: 3 })
                    this.board[7][2] = king
                    this.board[7][3] = rook
                    this.board[7][0] = 0
                }

                this.board[7][4] = 0
            }

            this.moves.push({ oldSquare: { ...oldSquare }, newSquare: { ...king.square }, isCastle: true })
            return
        }

        let wasCapture

        if (this.pieceOnSquare(move.newSquare)) {
            const capturedPiece = this.board[newRank][newFile]
            capturedPiece.isCaptured = true
            wasCapture = true
            this.lastMoveCapturedPiece = capturedPiece
        } else {
            wasCapture = false
        }

        const piece = this.board[oldRank][oldFile]
        piece.makeMove({ rank: newRank, file: newFile })

        this.board[newRank][newFile] = piece
        this.board[oldRank][oldFile] = 0

        this.moves.push({ ...move, wasCapture })
        this.pieces.forEach(piece => piece.updateAttackedSquares(this))
    }

    undoLastMove() {
        const lastMove = this.moves.pop()
        const movedPiece = this.board[lastMove.newSquare.rank][lastMove.newSquare.file]

        // undo castle move
        if (lastMove.isCastle) {
            let rook

            // white castled
            if (movedPiece.isWhite()) {
                this.board[0][4] = movedPiece
                // kingside castle
                if (lastMove.newSquare.file === 6) { 
                    rook = this.pieces[7]
                    this.board[0][7] = rook
                    this.board[0][5] = 0
                    this.board[0][6] = 0
                }

                // queenside castle
                else {
                    rook = this.pieces[0]
                    this.board[0][0] = rook
                    this.board[0][2] = 0
                    this.board[0][3] = 0
                }
            }

            // black castled
            else {
                this.board[7][4] = movedPiece
                // kingside castle
                if (lastMove.newSquare.file === 6) { 
                    rook = this.pieces[23]
                    this.board[7][7] = rook
                    this.board[7][5] = 0
                    this.board[7][6] = 0
                }

                // queenside castle
                else {
                    rook = this.pieces[16]
                    this.board[7][0] = rook
                    this.board[7][2] = 0
                    this.board[7][3] = 0
                }
            }

            rook.undoLastMove()
            movedPiece.undoLastMove()
            return
        }

        movedPiece.undoLastMove()
        this.board[lastMove.oldSquare.rank][lastMove.oldSquare.file] = movedPiece
        this.board[lastMove.newSquare.rank][lastMove.newSquare.file] = 0

        if (lastMove.wasCapture) {
            this.board[lastMove.newSquare.rank][lastMove.newSquare.file] = this.lastMoveCapturedPiece
            this.lastMoveCapturedPiece.isCaptured = false
        }

        this.pieces.forEach(piece => piece.updateAttackedSquares(this))
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