# Small UCI

A Small TypeScript library for interacting with a chess engine using the Universal Chess Interface (UCI) protocol.

## Work In Progress, Currently Only Supports

Only supports:

- go depth
  
- go

- stop
  
- uci
  
- isready
  
- position

- ucinewgame

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
```
