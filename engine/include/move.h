#pragma once

#include "square.h"

enum class MoveFlags
{
    None,
    Castle,
    EnPassant,
    Promotion,
};

struct Move
{
    Square old_square;
    Square new_square;
    MoveFlags flags = MoveFlags::None;
    bool was_capture = false;
};