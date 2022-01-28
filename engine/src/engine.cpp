#include "engine.h"

#include <functional>

#include "piece.h"
#include "king.h"
#include "util.h"

float Engine::evaluate()
{
    float eval = 0.0f;
    for (auto *piece : board.pieces)
    {
        if (piece->is_captured)
            continue;
        
        if (piece->is_white())
            eval += piece->value();
        else
            eval -= piece->value();
    }

    return eval;
}

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
        else if (move == "e8g8")
            is_castle = true;
        // black queenside castle
        else if (move == "e8c8")
            is_castle = true;
    }

    Move m { { old_rank, old_file }, { new_rank, new_file }};
    if (is_castle)
        m.flags = MoveFlags::Castle;

    board.make_move(m);
}

std::tuple<Move, float> Engine::best_move(Color c)
{
    auto legal_moves = board.get_legal_moves(c);
    auto best_evalutation = c == Color::White ? -1000 : 1000;
    std::vector<std::tuple<Move, float>> considered_moves;

    const auto ge = [](float a, float b) { return std::greater<float>{}(a, b); };
    const auto le = [](float a, float b) { return std::less<float>{}(a, b); };

    auto cmp_func = c == Color::White ? +ge : +le;

    for (auto const &move : legal_moves)
    {
        board.make_move(move);
        float eval = evaluate();

        if (eval == best_evalutation)
            considered_moves.push_back(std::make_tuple(move, eval));

        else if (cmp_func(eval, best_evalutation))
        {
            considered_moves.clear();
            considered_moves.push_back(std::make_tuple(move, eval));
            best_evalutation = eval;
        }

        board.undo_last_move();
    }

    return util::get_random_element(considered_moves);
}