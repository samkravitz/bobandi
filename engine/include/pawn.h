#pragma once

#include "board.h"
#include "piece.h"

class Pawn : public Piece
{
public:
    Pawn(Color, Square);

    int value() { return 1; }

    void update_legal_moves(Board *);
    void update_attacked_squares();
    std::string to_string();

private:
    Square get_enpassant_square(Board *);
    bool on_home_rank();
};