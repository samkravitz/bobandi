#pragma once

#include "board.h"
#include "piece.h"

class Board;

class Bishop : public Piece
{
public:
    Bishop(Color, Square);

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