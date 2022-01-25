#pragma once

#include "board.h"
#include "piece.h"

class Queen : public Piece
{
public:
    Queen(Color, Square);

    void update_legal_moves(Board *);
    void update_attacked_squares(Board *);
    std::string to_string();

private:
    const Square attacking_directions[8] = {
        { 1, 1 },
        { 1, 0 },
        { 1, -1 },
        { 0, 1 },
        { 0, -1 },
        { -1, 1 },
        { -1, 0 },
        { -1, -1 }
    };
};