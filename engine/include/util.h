#pragma once

#include <random>
#include <string>
#include <vector>

#include "move.h"

namespace util
{
    std::string uci_string_from_move(Move const &);

    template <typename T>
    T get_random_element(std::vector<T> const &vec)
    {
        std::random_device dev;
        std::mt19937 rng(dev());
        std::uniform_int_distribution<std::mt19937::result_type> uni(0, vec.size() - 1);

        return vec[uni(rng)];
    }
}