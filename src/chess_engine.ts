import { spawn, ChildProcessWithoutNullStreams } from 'child_process'

export class ChessEngineInterface {
  private engineProcess: ChildProcessWithoutNullStreams

  constructor (enginePath: string) {
    try {
      this.engineProcess = spawn(enginePath);
    } catch (error) {
      throw new Error(`Failed to spawn engine process: ${(error as Error).message}`);
    }
  }

  // Sends a command to the engine and returns the engine's response.
  async sendCommandExpectOutput (command: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.engineProcess.stdin.write(command + '\n')

      this.engineProcess.stdout.once('data', data => {
        const response = data.toString()
        resolve(response)
      })

      this.engineProcess.stdout.once('error', reject)
    })
  }

  // Sends a command to the engine and does not expect a response.
  async sendCommandNoOutput (command: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.engineProcess.stdin.write(command + '\n')

      this.engineProcess.stdout.once('error', reject)
      resolve()
    })
  }

  // Shuts down the engine process.
  shutdown () {
    this.engineProcess.kill()
  }

  // Sends the 'uci' command to the engine and returns the engine's response.
  async uci (): Promise<string> {
    return this.sendCommandExpectOutput('uci')
  }

  // Sends the 'isready' command to the engine and returns the engine's response.
  async isReady (): Promise<string> {
    return this.sendCommandExpectOutput('isready')
  }

  // Sends a 'position' command to the engine.
  async position (fen_or_start_pos: string, moves?: string[]): Promise<void> {
    let command = fen_or_start_pos === 'startpos'
      ? 'position startpos'
      : `position fen ${fen_or_start_pos}`

    if (moves) {
      command += ` moves ${moves.join(' ')}`
    }

    await this.sendCommandNoOutput(command)
  }

  // Sends a 'go depth' command to the engine and returns the best move.
  async goDepth(depth: number): Promise<string> {
    const command = `go depth ${depth}`
    const response = await this.sendCommandExpectOutput(command)

    const bestMoveLine = response.split('\n').find(line => line.startsWith('bestmove'))
    if (!bestMoveLine) {
      throw new Error(`No best move found in engine response: ${response}`)
    }

    const bestMove = bestMoveLine.split(' ')[1]
    return bestMove
  }
}