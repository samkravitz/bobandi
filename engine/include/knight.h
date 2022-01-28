#pragma once

#include "board.h"
#include "piece.h"

class Knight : public Piece
{
public:
    Knight(Color, Square);

    int value() { return 3; }

    void update_legal_moves(Board *);
    std::string to_string();
};