export declare class ChessEngineInterface {
    private engineProcess;
    constructor(enginePath: string);
    sendCommand(command: string): Promise<void>;
    getEngineOutput(endSignal: string): Promise<string>;
    quit(): void;
    uci(): Promise<string>;
    isReady(): Promise<string>;
    position(fen_or_start_pos: string, moves?: string[]): Promise<void>;
    uciNewGame(): Promise<void>;
    goDepth(depth: number): Promise<string>;
    go(options?: {
        searchmoves?: string[];
        ponder?: boolean;
        wtime?: number;
        btime?: number;
        winc?: number;
        binc?: number;
        movestogo?: number;
        depth?: number;
        nodes?: number;
        mate?: number;
        movetime?: number;
        infinite?: boolean;
    }): Promise<void>;
    setOption(name: string, value?: string): Promise<void>;
    stop(): Promise<String>;
    setDebugMode(on: boolean): Promise<void>;
    register(name?: string, code?: string): Promise<void>;
    ponderhit(): Promise<void>;
}
