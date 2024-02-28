export declare class ChessEngineInterface {
    private engineProcess;
    constructor(enginePath: string);
    sendCommand(command: string): Promise<void>;
    getEngineOutput(endSignal: string): Promise<string>;
    shutdown(): void;
    uci(): Promise<string>;
    isReady(): Promise<string>;
    position(fen_or_start_pos: string, moves?: string[]): Promise<void>;
    goDepth(depth: number): Promise<string>;
}
