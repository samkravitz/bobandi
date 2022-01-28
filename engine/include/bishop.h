#pragma once

#include "board.h"
#include "piece.h"

class Board;

class Bishop : public Piece
{
public:
    Bishop(Color, Square);

    int value() { return 3; }

    void update_legal_moves(Board *);
    std::string to_string();

private:
    const Square attacking_directions[4] = {
        { 1, 1 },
        { 1, -1 },
        { -1, 1 },
        { -1, -1 }
    };
};