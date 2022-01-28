#include "engine.h"
#include "util.h"

#include <iostream>
#include <string>

int main(int argc, char **argv)
{
    Engine engine;
    if (argc > 2)
    {
        for (int i = 1; i < argc; ++i)
        {
            engine.parse_uci_move(std::string(argv[i]));
        }
        
        const auto [move, eval] = engine.best_move(engine.board.to_play());

        std::cout << util::uci_string_from_move(move) << "\n";
    }
    return 0;
}