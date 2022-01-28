#pragma once

#include "board.h"
#include "piece.h"

class Rook : public Piece
{
public:
    Rook(Color, Square);

    int value() { return 5; }

    void update_legal_moves(Board *);
    std::string to_string();

private:
    const Square attacking_directions[4] = {
        { 1, 0 },
        { 0, 1 },
        { 0, -1 },
        { -1, 0 },
    };
};