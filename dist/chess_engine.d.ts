export declare class ChessEngineInterface {
    private engine_process;
    constructor(engine_path: string);
    send_command_expect_output(command: string): Promise<string>;
    send_command_no_output(command: string): Promise<void>;
    shutdown(): void;
    uci(): Promise<string>;
    isReady(): Promise<string>;
    position(fen_or_start_pos: string, moves?: string[]): Promise<void>;
    go_depth(depth: number): Promise<string>;
}
