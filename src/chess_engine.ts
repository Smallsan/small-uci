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
  quit () {
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

  // Sends a 'ucinewgame' command to the engine.
  async uciNewGame(): Promise<void> {
    await this.sendCommand('ucinewgame')
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

  // Sends a 'go' command to the engine with the given options.
  async go(options: {
    searchmoves?: string[],
    ponder?: boolean,
    wtime?: number,
    btime?: number,
    winc?: number,
    binc?: number,
    movestogo?: number,
    depth?: number,
    nodes?: number,
    mate?: number,
    movetime?: number,
    infinite?: boolean
  } = {}): Promise<string | void> {
    let command = 'go';
    for (const [option, value] of Object.entries(options)) {
      if (option === 'searchmoves' && Array.isArray(value)) {
        command += ` ${option} ${value.join(' ')}`;
      } else if (value !== undefined) {
        command += ` ${option} ${value}`;
      }
    }
  
    await this.sendCommand(command);
  
    if (!options.infinite) {
      return new Promise((resolve, reject) => {
        this.engineProcess.on('bestmove', (move: string) => {
          resolve(move);
        });
  
        this.engineProcess.on('error', (err: Error) => {
          reject(err);
        });
      });
    }
  }

  // Sends a 'setoption' command to the engine.
  async setOption(name: string, value?: string): Promise<void> {
    let command = `setoption name ${name}`;
    if (value !== undefined) {
      command += ` value ${value}`;
    }
    await this.sendCommand(command);
  }

  // Sends a 'stop' command to the engine and returns the best move.
  async stop(): Promise<String> { 
    await this.sendCommand('stop')
    const response = await this.getEngineOutput('bestmove')
    return response
  }

  // Sends a 'debug' command to the engine.
  async setDebugMode(on: boolean): Promise<void> {
    const mode = on ? 'on' : 'off';
    await this.sendCommand(`debug ${mode}`);
  }

  // Sends a 'register' command to the engine.
  async register(name?: string, code?: string): Promise<void> {
    let command = 'register';
    if (name && code) {
      command += ` name ${name} code ${code}`;
    } else {
      command += ' later';
    }
    await this.sendCommand(command);
  }

  // Sends a 'ponderhit' command to the engine.
  async ponderhit(): Promise<void> {
    await this.sendCommand('ponderhit');
  }

}