CXX = g++
CXXFLAGS = -g -std=c++2a -I $(INCLUDE)
BIN = bin
SOURCE = src
INCLUDE = include
OBJ = \
	bishop.o \
	board.o \
	king.o \
	knight.o \
	pawn.o \
	piece.o \
	queen.o \
	rook.o \
	util.o \

LIST = $(addprefix $(BIN)/, $(OBJ))
VPATH = $(SOURCE) $(SOURCE)/backup

all: bobandi
bobandi: $(LIST) main.cpp
	$(CXX) $(CXXFLAGS) -o bobandi $(SOURCE)/main.cpp $(LIST)

$(BIN)/%.o : %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

.PHONY: clean
clean:
	rm -f bobandi *.o bin/*