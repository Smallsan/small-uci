# Small UCI

A Small TypeScript library for interacting with a chess engine using the Universal Chess Interface (UCI) protocol.

## Installation

```bash
npm install small-uci
```

## Usage

```rust
import { ChessEngineInterface } from "small-uci"

// Creating an engine interface.
let engineInterface = new ChessEngineInterface('enginePath')

// Using the uci command.
const response = await engineInterface.uci()

// Using the isready command.
const response = await engineInterface.isReady()

// Using the position command.(fen/startpos, moves[])
await engineInterface.position('startpos', ['e2e4', 'e7e5'])

// Using the ucinewgame command.
await engineInterface.uciNewGame()

// Using the go depth command. (search depth)
const response = await engineInterface.goDepth(4)

// Starts a go search using go and ends later with a stop returning the best move.
await engineInterface.go()
const response = await engineInterface.stop()

// Starts a go search with parameters. 
await engineInterface.go({
  searchmoves: ['e2e4', 'd2d4'],
  ponder: true,
  wtime: 10000,
  btime: 10000,
  winc: 1000,
  binc: 1000,
  movestogo: 10,
  depth: 5,
  nodes: 1000000,
  mate: 5,
  movetime: 500,
  infinite: false
});

// Enables engine debug mode. (boolean)
await engineInterface.setDebugMode(true)

// Sets engine options. Example: sets nullmove to true (optionName, value)
await engineInterface.setOption("Nullmove", "true")

// Register later
await this.register()

// Register now
await this.register("Small", "4359874324");

// Notify the engine that the user has played the expected move
await this.ponderhit();  
```
