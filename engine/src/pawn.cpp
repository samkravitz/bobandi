#include "pawn.h"

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

    auto direction = is_white() ? 1 : -1;

    Square new_square = { rank() + direction, file() };
    if (!board->piece_on_square(new_square))
    {
        Move m { square, new_square };
        // test for promotion
        if (new_square.rank == 0 || new_square.rank == 7)
            m.flags = MoveFlags::Promotion;
        legal_moves.push_back(m);
        
        // pawn is on home rank, so it can move forward 2 squares
        if (on_home_rank() && !board->piece_on_square({ rank() + 2 * direction, file() }))
            legal_moves.push_back({ square, { rank() + 2 * direction, file() }});
    }

    Square right_attacking { rank() + direction, file() + 1 }, left_attacking { rank() + direction, file() - 1 };

    if (Board::is_in_bounds(left_attacking) && opponent_piece_on_square(board, left_attacking))
         legal_moves.push_back({ square, left_attacking });
    
    if (Board::is_in_bounds(right_attacking) && opponent_piece_on_square(board, right_attacking))
         legal_moves.push_back({ square, right_attacking });

    auto enpassant_square = get_enpassant_square(board);
    if (enpassant_square.rank >= 0)
       legal_moves.push_back({ square, enpassant_square, MoveFlags::EnPassant });
    
}

void Pawn::update_attacked_squares()
{
    attacked_squares.clear();
    auto direction = is_white() ? 1 : -1;
    Square check1{ rank() + direction, file() + 1 }, check2{ rank() + direction, file() - 1 };
    if (Board::is_in_bounds(check1))
        attacked_squares.push_back(check1);
    if (Board::is_in_bounds(check2))
        attacked_squares.push_back(check2);
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
