#pragma once

#include "board.h"
#include "piece.h"

class Rook : public Piece
{
public:
    Rook(Color, Square);

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