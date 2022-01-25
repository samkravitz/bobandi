#pragma once

#include <string>
#include <stack>
#include <vector>

#include "move.h"
#include "square.h"

class Board;

enum class Color
{
    White,
    Black,
};

class Piece
{
public:
    Piece(Color, Square);

    bool is_captured = false;
    std::stack<Move> moves;

    inline int rank() { return square.rank; };
    inline int file() { return square.file; };

    std::vector<Move> get_legal_moves();
    std::vector<Square> get_attacked_squares();

    void make_move(Square const &);
    void undo_last_move();
    void update(Board *);

    bool is_white();
    virtual std::string to_string() = 0;
    virtual void update_legal_moves(Board *) = 0;
    virtual void update_attacked_squares();

protected:
    Color color;
    Square square;
    std::vector<Move> legal_moves;
    std::vector<Square> attacked_squares;

    bool friendly_piece_on_square(Board *, Square);
    bool opponent_piece_on_square(Board *, Square);
};