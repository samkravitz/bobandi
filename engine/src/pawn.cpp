#include "pawn.h"

#include <algorithm>
#include <cmath>

#include "square.h"

Pawn::Pawn(Color color, Square square)
    : Piece(color, square)
{

}

void Pawn::update_legal_moves(Board *board)
{
    legal_moves.clear();

    if (is_captured)
        return;

    // pawn is at edge of board, cannot push any further
    if ((is_white() && rank() == 7) ||
        (!is_white() && rank() == 0))
            return;

    auto direction = is_white() ? 1 : -1;
    if (!board->piece_on_square({ rank() + direction, file() }))
    {
        legal_moves.push_back({ square, { rank() + direction, file() }});
        
        // pawn is on home rank, so it can move forward 2 squaenpassant_square
        if (on_home_rank() && !board->piece_on_square({ rank() + 2 * direction, file() }))
            legal_moves.push_back({ square, { rank() + 2 * direction, file() }});
    }

    auto enpassant_square = get_enpassant_square(board);
    if (enpassant_square.rank >= 0)
       legal_moves.push_back({ square, enpassant_square, MoveFlags::EnPassant });
    
}

void Pawn::update_attacked_squares(Board *board)
{
    attacked_squares.clear();
    auto direction = is_white() ? 1 : -1;
    attacked_squares.push_back({ rank() + direction, file() + 1 });
    attacked_squares.push_back({ rank() + direction, file() - 1 });
    std::remove_if(attacked_squares.begin(), attacked_squares.end(), [](auto const &sq) { return Board::is_in_bounds(sq); });
}

Square Pawn::get_enpassant_square(Board *board)
{
    auto enpassant_square = Square{ -1, -1 };

    // a pawn can only en passant if it is on rank 4 (white) or 5 (black)
    if (is_white() && rank() != 4)
        return enpassant_square;
    
    if (!is_white() && rank() != 3)
        return enpassant_square;

    // a pawn can only en passant if the last move was a pawn move that moved the pawn 2 squares and put the pawn 
    // on rank 4 (white) or 5 (black)
    if (board->moves.empty())
        return enpassant_square;

    auto last_move = board->moves.top();
    board->moves.pop();

    auto *last_moved_piece = board->board[last_move.new_square.rank][last_move.new_square.file];

    // the last moved piece was not a pawn
    auto *pawn = dynamic_cast<Pawn*>(last_moved_piece);
    if (!pawn)
    {
        board->moves.push(last_move);
        return enpassant_square;
    }
    
    // the last move was not a 2 square move
    if (std::abs(last_move.new_square.rank - last_move.old_square.rank) != 2)
    {
        board->moves.push(last_move);
        return enpassant_square;
    }

    // the last move did not put the pawn directly next to our pawn
    if ((last_move.new_square.file != file() + 1) && (last_move.new_square.file != file() - 1))
    {
        board->moves.push(last_move);
        return enpassant_square;
    }

    // finally! we have determined that we can en passant.

    auto direction = is_white() ? 1 : -1;
    
    enpassant_square.rank = rank() + direction;
    if (last_move.new_square.file == file() + 1)
        enpassant_square.file = file() + 1;
    else
        enpassant_square.file = file() - 1;

    board->moves.push(last_move);
    return enpassant_square;
}

bool Pawn::on_home_rank()
{
    if (is_white())
        return rank() == 1;
    else
        return rank() == 6;
}

std::string Pawn::to_string()
{
    return is_white() ? "P" : "p";
}
