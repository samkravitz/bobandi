#include "board.h"

#include <algorithm>

#include "bishop.h"
#include "king.h"
#include "knight.h"
#include "pawn.h"
#include "queen.h"
#include "rook.h"

Board::Board()
{
    reset();
}

void Board::reset()
{
    auto *white_kingside_rook    =   new Rook(Color::White,   { 0, 0 });
    auto *white_queenside_rook   =   new Rook(Color::White,   { 0, 7 });
    auto *white_kingside_knight  =   new Knight(Color::White, { 0, 1 });
    auto *white_queenside_knight =   new Knight(Color::White, { 0, 6 });
    auto *white_kingside_bishop  =   new Bishop(Color::White, { 0, 2 });
    auto *white_queenside_bishop =   new Bishop(Color::White, { 0, 5 });
    auto *white_queen            =   new Queen(Color::White,  { 0, 3 });
    auto *white_king             =   new King(Color::White,   { 0, 4 });
    auto *white_pawn1            =   new Pawn(Color::White,   { 1, 0 });
    auto *white_pawn2            =   new Pawn(Color::White,   { 1, 1 });
    auto *white_pawn3            =   new Pawn(Color::White,   { 1, 2 });
    auto *white_pawn4            =   new Pawn(Color::White,   { 1, 3 });
    auto *white_pawn5            =   new Pawn(Color::White,   { 1, 4 });
    auto *white_pawn6            =   new Pawn(Color::White,   { 1, 5 });
    auto *white_pawn7            =   new Pawn(Color::White,   { 1, 6 });
    auto *white_pawn8            =   new Pawn(Color::White,   { 1, 7 });

    auto *black_kingside_rook    =   new Rook(Color::Black,   { 7, 7 });
    auto *black_queenside_rook   =   new Rook(Color::Black,   { 7, 0 });
    auto *black_kingside_knight  =   new Knight(Color::Black, { 7, 6 });
    auto *black_queenside_knight =   new Knight(Color::Black, { 7, 1 });
    auto *black_kingside_bishop  =   new Bishop(Color::Black, { 7, 5 });
    auto *black_queenside_bishop =   new Bishop(Color::Black, { 7, 2 });
    auto *black_queen            =   new Queen(Color::Black,  { 7, 3 });
    auto *black_king             =   new King(Color::Black,   { 7, 4 });
    auto *black_pawn1            =   new Pawn(Color::Black,   { 6, 0 });
    auto *black_pawn2            =   new Pawn(Color::Black,   { 6, 1 });
    auto *black_pawn3            =   new Pawn(Color::Black,   { 6, 2 });
    auto *black_pawn4            =   new Pawn(Color::Black,   { 6, 3 });
    auto *black_pawn5            =   new Pawn(Color::Black,   { 6, 4 });
    auto *black_pawn6            =   new Pawn(Color::Black,   { 6, 5 });
    auto *black_pawn7            =   new Pawn(Color::Black,   { 6, 6 });
    auto *black_pawn8            =   new Pawn(Color::Black,   { 6, 7 });

    for (int rank = 0; rank < 8; ++rank)
        for (int file = 0; file < 8; ++file)
            board[rank][file] = nullptr;
    
    pieces[0] = white_kingside_rook;
    pieces[1] = white_kingside_knight;
    pieces[2] = white_kingside_bishop;
    pieces[3] = white_queen;
    pieces[4] = white_king;
    pieces[5] = white_queenside_bishop;
    pieces[6] = white_queenside_knight;
    pieces[7] = white_queenside_rook;

    pieces[8]  = white_pawn1;
    pieces[9]  = white_pawn2;
    pieces[10] = white_pawn3;
    pieces[11] = white_pawn4;
    pieces[12] = white_pawn5;
    pieces[13] = white_pawn6;
    pieces[14] = white_pawn7;
    pieces[15] = white_pawn8;

    pieces[16] = black_kingside_rook;
    pieces[17] = black_kingside_knight;
    pieces[18] = black_kingside_bishop;
    pieces[19] = black_queen;
    pieces[20] = black_king;
    pieces[21] = black_queenside_bishop;
    pieces[22] = black_queenside_knight;
    pieces[23] = black_queenside_rook;

    pieces[24] = black_pawn1;
    pieces[25] = black_pawn2;
    pieces[26] = black_pawn3;
    pieces[27] = black_pawn4;
    pieces[28] = black_pawn5;
    pieces[29] = black_pawn6;
    pieces[30] = black_pawn7;
    pieces[31] = black_pawn8;

    for (auto *piece : pieces)
        board[piece->rank()][piece->file()] = piece;
}

std::vector<Move> Board::get_legal_moves(Color c)
{
    std::vector<Move> legal_moves;

    int begin, end;
    
    if (c == Color::White)
    {
        begin = 0;
        end = 16;    
    }

    else
    {
        begin = 16;
        end = 32;
    }

    for (int i = begin; i < end; ++i)
    {
        auto moves = pieces[i]->get_legal_moves();
        for (auto move : moves)
            legal_moves.push_back(move);
    }


    std::remove_if(legal_moves.begin(), legal_moves.end(), [this, c](auto const &move)
    {
        make_move(move);
        // keep only moves that do not put our color in check
        bool ret = is_in_check(c);
        undo_last_move();
        return ret;
    });

    return legal_moves;
}

bool Board::piece_on_square(Square square)
{
    return board[square.rank][square.file] != nullptr;
}

bool Board::is_in_check(Color c)
{
    auto attacked_squares = get_squares_attacked(c);
    auto *king = c == Color::White ? pieces[4] : pieces[20];
    auto king_square = Square{ king->rank(), king->file() };

    for (auto const &square : attacked_squares)
    {
        if (king_square == square)
            return true;
    }

    return false;
}

std::vector<Square> Board::get_squares_attacked(Color c)
{
    std::vector<Square> attacked_squares;

    int begin, end;
    
    if (c == Color::White)
    {
        begin = 0;
        end = 16;    
    }

    else
    {
        begin = 16;
        end = 32;
    }

    for (int i = begin; i < end; ++i)
    {
        auto squares = pieces[i]->get_attacked_squares();
        for (auto square : squares)
            attacked_squares.push_back(square);
    }

    return attacked_squares;
}

void Board::parse_uci_moves(std::string moves)
{
    while (moves != "")
    {
        auto move = moves.substr(0, 4);
        parse_uci_move(move);
        moves.erase(0, 5);
    }
}

void Board::parse_uci_move(std::string const &move)
{
    int old_file = move.at(0) - 'a';
    int old_rank = move.at(1) - '1';
    int new_file = move.at(2) - 'a';
    int new_rank = move.at(3) - '1';

    // check if move is castle
    bool is_castle = false;

    auto *piece_on_old_square = board[old_rank][old_file];

    if (King *k = dynamic_cast<King*>(piece_on_old_square))
    {
        // white kingside castle
        if (move == "e1g1")
            is_castle = true;
        // white queenside castle
        else if (move == "e1c1")
            is_castle = true;
        // black kingside castle
        else if (move == "e7g7")
            is_castle = true;
        // black queenside castle
        else if (move == "e7c7")
            is_castle = true;
    }

    Move m { { old_rank, old_file }, { new_rank, new_file }};
    if (is_castle)
        m.flags = MoveFlags::Castle;

    make_move(m);
}

void Board::make_move(Move const &move)
{
    auto old_rank = move.old_square.rank;
    auto old_file = move.old_square.file;
    auto new_rank = move.new_square.rank;
    auto new_file = move.new_square.file;

    if (move.flags == MoveFlags::Castle)
    {
        Piece *king;
        Square old_square;

        // white castling
        if (new_rank == 0)
        {
            king = pieces[4];
            old_square = { king->rank(), king->file() };

            // kingside castle
            if (new_file == 6)
            {
                auto *rook = pieces[7];
                king->make_move({ 0, 6 });
                rook->make_move({ 0, 5 });
                board[0][6] = king;
                board[0][5] = rook;
                board[0][7] = nullptr;
            }

            // queenside castle
            else
            {
                auto *rook = pieces[0];
                king->make_move({ 0, 2 });
                rook->make_move({ 0, 3 });
                board[0][2] = king;
                board[0][3] = rook;
                board[0][0] = nullptr;
            }

            board[0][4] = 0;
        }
        
        // black castling
        else if (new_rank == 7)
        {
            king = pieces[20];
            old_square = { king->rank(), king->file() };
            // kingside castle
            if (new_file == 6)
            {
                auto *rook = pieces[23];
                king->make_move({ 7, 6 });
                rook->make_move({ 7, 5 });
                board[7][6] = king;
                board[7][5] = rook;
                board[7][7] = nullptr;
            }

            // queenside castle
            else
            {
                auto *rook = pieces[16];
                king->make_move({ 7, 2 });
                rook->make_move({ 7, 3 });
                board[7][2] = king;
                board[7][3] = rook;
                board[7][0] = nullptr;
            }

            board[7][4] = nullptr;
        }

        moves.push({ old_square, { king->rank(), king->file() }, MoveFlags::Castle });
        return;
    }

    bool was_capture = false;

    if (piece_on_square(move.new_square))
    {
        auto *captured_piece = board[new_rank][new_file];
        captured_piece->is_captured = true;
        was_capture = true;
        last_move_captured_piece = captured_piece;
    }

    auto *piece = board[old_rank][old_file];
    piece->make_move({ new_rank, new_file });

    board[new_rank][new_file] = piece;
    board[old_rank][old_file] = nullptr;

    auto new_move = move;
    if (was_capture)
        new_move.was_capture = true;
    moves.push(new_move);
    for (auto *piece : pieces)
        piece->update(this);
}

void Board::undo_last_move()
{
    auto last_move = moves.top();
    moves.pop();

    auto *moved_piece = board[last_move.new_square.rank][last_move.new_square.file];

    // undo castle move
    if (last_move.flags == MoveFlags::Castle)
    {
        Piece *rook;

        // white castled
        if (moved_piece->is_white())
        {
            board[0][4] = moved_piece;
            // kingside castle
            if (last_move.new_square.file == 6)
            { 
                rook = pieces[7];
                board[0][7] = rook;
                board[0][5] = 0;
                board[0][6] = 0;
            }

            // queenside castle
            else
            {
                rook = pieces[0];
                board[0][0] = rook;
                board[0][2] = 0;
                board[0][3] = 0;
            }
        }

        // black castled
        else
        {
            board[7][4] = moved_piece;
            // kingside castle
            if (last_move.new_square.file == 6)
            { 
                rook = pieces[23];
                board[7][7] = rook;
                board[7][5] = 0;
                board[7][6] = 0;
            }

            // queenside castle
            else
            {
                rook = pieces[16];
                board[7][0] = rook;
                board[7][2] = 0;
                board[7][3] = 0;
            }
        }

        rook->undo_last_move();
        moved_piece->undo_last_move();
        for (auto *piece : pieces)
            piece->update(this);
        return;
    }

    moved_piece->undo_last_move();
    board[last_move.old_square.rank][last_move.old_square.file] = moved_piece;
    board[last_move.new_square.rank][last_move.new_square.file] = nullptr;

    if (last_move.was_capture)
    {
        board[last_move.new_square.rank][last_move.new_square.file] = last_move_captured_piece;
        last_move_captured_piece->is_captured = false;
    }

}

std::string Board::to_string()
{
    std::string res = "";
    for (int rank = 7; rank >= 0; rank--)
    {
        for (int file = 0; file < 8; file++)
        {
            if (piece_on_square({ rank, file }))
                res += board[rank][file]->to_string();
            else
                res += '*';
            res += ' ';
        }
        res += '\n';
    }
    return res;
}
