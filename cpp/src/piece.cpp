#include "piece.h"

#include <algorithm>

#include "board.h"

Piece::Piece(Color color, Square square) :
    color(color),
    square(square)
{

}

bool Piece::is_white()
{
    return color == Color::White;
}

void Piece::make_move(Square const &new_square)
{
    moves.push({ square, new_square });
    square = new_square;
}

void Piece::undo_last_move()
{
    auto const &last_move = moves.top();
    moves.pop();
    square = last_move.old_square;
}

bool Piece::friendly_piece_on_square(Board *board, Square sq)
{
    auto *piece = board->board[sq.rank][sq.file];
    if (!piece || piece->is_captured)
        return false;
    
    return piece->color == color;
}

bool Piece::opponent_piece_on_square(Board *board, Square sq)
{
    auto *piece = board->board[sq.rank][sq.file];
    if (!piece || piece->is_captured)
        return false;
    
    return piece->color != color;
}

void Piece::update_attacked_squares()
{
    attacked_squares.clear();

    if (is_captured)
        return;
    
    std::for_each(legal_moves.begin(), legal_moves.end(), [this](auto const &move)
    {
        attacked_squares.push_back({ move.new_square });
    });
}

std::vector<Move> Piece::get_legal_moves()
{
    return legal_moves;
}

std::vector<Square> Piece::get_attacked_squares()
{
    return attacked_squares;
}

void Piece::update(Board *board)
{
    update_legal_moves(board);
    update_attacked_squares();
}
