#include "king.h"

#include <algorithm>

#include "square.h"

King::King(Color color, Square square)
    : Piece(color, square)
{

}

void King::update_legal_moves(Board *board)
{
    legal_moves.clear();

    if (is_captured)
        return;

    auto current_square = square;
    for (auto const &direction : attacking_directions)
    {
        auto new_square = current_square + direction;
        if (Board::is_in_bounds(new_square) && !friendly_piece_on_square(board, new_square))
            legal_moves.push_back({ current_square, new_square });
    }
    
    auto castle_moves = get_castle_moves(board);
    for (auto move : castle_moves)
        legal_moves.push_back(move);
}

void King::update_attacked_squares()
{
    attacked_squares.clear();

    if (is_captured)
        return;
    
    std::for_each(legal_moves.begin(), legal_moves.end(), [this](auto const &move)
    {
        if (move.flags != MoveFlags::Castle)
            attacked_squares.push_back({ move.new_square });
    });
}

bool King::can_castle_kingside(Board *board)
{
    // we can't castle if our king has moved
    if (!moves.empty())
        return false;
    
    // we can't castle if our kingside rook has moved either
    auto *kingside_rook = is_white() ? board->pieces[7] : board->pieces[23];
    if (kingside_rook->moves.size() != 0)
        return false;
    
    // we can't castle if there is a piece on the board in between the king and the rook
    auto direction = is_white() ? 1 : -1;
    if ((board->piece_on_square({ rank(), file() + direction })) ||
        (board->piece_on_square({ rank(), file() + 2 * direction })))
            return false;


    // we can't castle if we are in check
    if (board->is_in_check(color))
        return false;

    // we can't castle through check
    board->make_move({ square, { rank(), file() + direction }});

    if (board->is_in_check(color))
    {
        board->undo_last_move();
        return false;
    }

    board->undo_last_move();

    // now make_move if the final castled position is in check
    board->make_move({ square , { rank(), file() + 2 * direction }});
    board->make_move({{ kingside_rook->rank(), kingside_rook->file() }, { kingside_rook->rank(), kingside_rook->file() + 2 * -direction }});

    if (board->is_in_check(color))
    {
        board->undo_last_move();
        board->undo_last_move();
        return false;
    }

    board->undo_last_move();
    board->undo_last_move();

    // finally! we have determined that we can castle kingside.
    return true;
}

bool King::can_castle_queenside(Board *board)
{
    // we can't castle if our king has moved
    if (moves.size() != 0)
        return false;
    
    // we can't castle if our queenside rook has moved either
    auto *queenside_rook = is_white() ? board->pieces[0] : board->pieces[16];
    if (queenside_rook->moves.size() != 0)
        return false;
    
    // we can't castle if there is a piece on the board in between the king and the rook
    auto direction = is_white() ? -1 : 1;
    if ((board->piece_on_square({ rank(), file() + direction })) ||
        (board->piece_on_square({ rank(), file() + 2 * direction })) ||
        (board->piece_on_square({ rank(), file() + 3 * direction })))
            return false;

    // we can't castle if we are in check
    if (board->is_in_check(color))
        return false;

    // we can't castle through check
    board->make_move({ square,{ rank(), file() + direction }});

    if (board->is_in_check(color))
    {
        board->undo_last_move();
        return false;
    }

    board->undo_last_move();

    // now check if the final castled position is in check
    board->make_move({ square, { rank(), file() + 2 * direction }});
    board->make_move({{ queenside_rook->rank(), queenside_rook->file() }, { queenside_rook->rank(), queenside_rook->file() + 3 * -direction }});

    if (board->is_in_check(color))
    {
        board->undo_last_move();
        board->undo_last_move();
        return false;
    }

    board->undo_last_move();
    board->undo_last_move();

    // finally! we have determined that we can castle queenside.
    return true;
}

    
std::vector<Move> King::get_castle_moves(Board *board)
{
    std::vector<Move> castle_moves;

    if (can_castle_kingside(board))
    {
        auto direction = is_white() ? 1 : -1;
        castle_moves.push_back({ square, { rank(), file() + 2 * direction }, MoveFlags::Castle });
    }

    if (can_castle_queenside(board))
    {
        auto direction = is_white() ? -1 : 1;
        castle_moves.push_back({ square, { rank(), file() + 2 * direction }, MoveFlags::Castle });
    }

    return castle_moves;
}

std::string King::to_string()
{
    return is_white() ? "K" : "k";
}
