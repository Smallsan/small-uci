import { spawn } from 'child_process'

export class ChessEngineInterface {
  private engine_process

  constructor (engine_path: string) {
    this.engine_process = spawn(engine_path)
  }

  // Bot Commands.

  async send_command_expect_output (command: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.engine_process.stdin.write(command + '\n')

      this.engine_process.stdout.once('data', data => {
        const response = data.toString()
        resolve(response)
      })

      this.engine_process.stdout.once('error', reject)
    })
  }

  async send_command_no_output (command: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.engine_process.stdin.write(command + '\n')

      this.engine_process.stdout.once('error', reject)
      resolve()
    })
  }

  shutdown () {
    this.engine_process.kill()
  }

  // Uci Commands.

  async uci (): Promise<string> {
    return this.send_command_expect_output('uci')
  }

  async isReady (): Promise<string> {
    return this.send_command_expect_output('isready')
  }

  async position (fen_or_start_pos: string, moves?: string[]): Promise<void> {
    let command = ''
    if (fen_or_start_pos === 'startpos') {
      command = 'position startpos'
    } else {
      command = `position fen ${fen_or_start_pos}`
    }

    if (moves) {
      command += ` moves ${moves.join(' ')}`
    }

    await this.send_command_no_output(command)
  }

  async go_depth(depth: number): Promise<string> {
    const command = `go depth ${depth}`;
    const response = await this.send_command_expect_output(command);
  
    const bestMoveLine = response.split('\n').find(line => line.startsWith('bestmove'));
    if (!bestMoveLine) {
      throw new Error('No best move found in engine response');
    }
  
    const bestMove = bestMoveLine.split(' ')[1];
    return bestMove;
  }

  
}
