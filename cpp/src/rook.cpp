#include "rook.h"

#include "square.h"

Rook::Rook(Color color, Square square)
    : Piece(color, square)
{

}

void Rook::update_legal_moves(Board *board)
{
    legal_moves.clear();

    if (is_captured)
        return;

    auto current_square = square;
    for (auto const &direction : attacking_directions)
    {
        auto new_square = current_square + direction;
        while (Board::is_in_bounds(new_square))
        {
            if (friendly_piece_on_square(board, new_square))
                break;
            
            legal_moves.push_back({ current_square, new_square });

            if (opponent_piece_on_square(board, new_square))
                break;

            new_square = new_square + direction;
        }
    }
}

std::string Rook::to_string()
{
    return is_white() ? "R" : "r";
}