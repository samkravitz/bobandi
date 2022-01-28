#pragma once

#include <vector>

#include "board.h"
#include "piece.h"

class King : public Piece
{
public:
    King(Color, Square);

    int value() { return 100; }

    void update_legal_moves(Board *);
    void update_attacked_squares();
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

    bool can_castle_kingside(Board *);
    bool can_castle_queenside(Board *);
    
    std::vector<Move> get_castle_moves(Board *);
};