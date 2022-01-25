#pragma once

#include "board.h"
#include "piece.h"

class Knight : public Piece
{
public:
    Knight(Color, Square);

    void update_legal_moves(Board *);
    std::string to_string();
};