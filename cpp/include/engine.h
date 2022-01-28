#pragma once

#include "board.h"

#include <string>

class Engine
{
public:
    Board board;

    void parse_uci_moves(std::string);
    void parse_uci_move(std::string const &);
};