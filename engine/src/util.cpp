#include "util.h"

std::string util::uci_string_from_move(Move const &move)
{
    std::string uci = "";
    uci += move.old_square.file + 'a';
    uci += std::to_string(move.old_square.rank + 1);
    uci += move.new_square.file + 'a';
    uci += std::to_string(move.new_square.rank + 1);
    return uci;
}