#include "knight.h"

#include <algorithm>

#include "square.h"

Knight::Knight(Color color, Square square)
    : Piece(color, square)
{

}

void Knight::update_legal_moves(Board *board)
{
    legal_moves.clear();

    if (is_captured)
        return;

    std::vector<Square> squares = {
        { rank() + 1, file() + 2 },
        { rank() + 1, file() - 2 },
        { rank() - 1, file() + 2 },
        { rank() - 1, file() - 2 },
        { rank() + 2, file() + 1 },
        { rank() + 2, file() - 1 },
        { rank() - 2, file() + 1 },
        { rank() - 2, file() - 1 },
    };

    for (const auto &sq : squares)
    {
        if (Board::is_in_bounds(sq) && !friendly_piece_on_square(board, sq))
            legal_moves.push_back({ square, sq });
    }
}

std::string Knight::to_string()
{
    return is_white() ? "N" : "n";
}