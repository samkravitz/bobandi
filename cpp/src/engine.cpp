#include "engine.h"

#include "king.h"

void Engine::parse_uci_moves(std::string moves)
{
    while (moves != "")
    {
        auto move = moves.substr(0, 4);
        parse_uci_move(move);
        moves.erase(0, 5);
    }
}

void Engine::parse_uci_move(std::string const &move)
{
    int old_file = move.at(0) - 'a';
    int old_rank = move.at(1) - '1';
    int new_file = move.at(2) - 'a';
    int new_rank = move.at(3) - '1';

    // check if move is castle
    bool is_castle = false;

    auto *piece_on_old_square = board.board[old_rank][old_file];

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

    board.make_move(m);
}