#pragma once

#include "board.h"
#include "piece.h"
#include "move.h"

#include <string>
#include <tuple>

class Engine
{
public:
    Board board;

    float evaluate();
    void parse_uci_moves(std::string);
    void parse_uci_move(std::string const &);
    std::tuple<Move, float> best_move(Color);
};