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

  async sendCommand(command: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.engineProcess.stdin.write(command + '\n', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
  
  async getEngineOutput(endSignal: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let dataBuffer = '';
  
      const dataListener = (data:Buffer) => {
        dataBuffer += data.toString();
        if (dataBuffer.includes(endSignal)) {
          this.engineProcess.stdout.off('data', dataListener);
          resolve(dataBuffer);
        }
      };
  
      this.engineProcess.stdout.on('data', dataListener);
      this.engineProcess.stdout.once('error', (err) => {
        this.engineProcess.stdout.off('data', dataListener);
        reject(err);
      });
    });
  }

  // Shuts down the engine process.
  shutdown () {
    this.engineProcess.kill()
  }

  // Sends the 'uci' command to the engine and returns the engine's response.
  async uci (): Promise<string> {
    await this.sendCommand('uci')
    const response = await this.getEngineOutput('uciok')
    return response
  }

  // Sends the 'isready' command to the engine and returns the engine's response.
  async isReady (): Promise<string> {
    await this.sendCommand('isready')
    const response = await this.getEngineOutput('readyok')
    return response
  }

  // Sends a 'position' command to the engine.
  async position (fen_or_start_pos: string, moves?: string[]): Promise<void> {
    let command = fen_or_start_pos === 'startpos'
      ? 'position startpos'
      : `position fen ${fen_or_start_pos}`

    if (moves) {
      command += ` moves ${moves.join(' ')}`
    }

    await this.sendCommand(command)
  }

  // Sends a 'go depth' command to the engine and returns the best move.
  async goDepth(depth: number): Promise<string> {
    await this.sendCommand(`go depth ${depth}`)
    const response = await this.getEngineOutput('bestmove')

    console.log(response
    )

    const bestMoveLine = response.split('\n').find(line => line.startsWith('bestmove'))
    if (!bestMoveLine) {
      throw new Error(`No best move found in engine response: ${response}`)
    }

    const bestMove = bestMoveLine.split(' ')[1]
    return bestMove
  }
}