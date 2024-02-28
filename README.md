# Small UCI

A Small TypeScript library for interacting with a chess engine using the Universal Chess Interface (UCI) protocol.

## Work In Progress, Currently Only Supports 

Only supports:

- go
  
- uci
  
- isready
  
- position

## Installation

```bash
npm install small-uci
```

## Usage

```rust
// Creating an engine interface.
let engineInterface = new ChessEngineInterface('enginePath')

// Using the uci command.
const response = await engineInterface.uci()

// Using the isready command.
const response = await engineInterface.isReady()

// Using the position command.(fen/startpos, moves[])
await engineInterface.position('startpos', ['e2e4', 'e7e5'])

// Using the go depth command. (search depth)
const response = await engineInterface.goDepth(4)
```