#pragma once

struct Square
{
    int rank;
    int file;

    Square operator+(Square const &other)
    {
        Square square { rank + other.rank, file + other.file };
        return square;
    }

    bool operator==(Square const &other)
    {
        return rank == other.rank && file == other.file;
    }
};