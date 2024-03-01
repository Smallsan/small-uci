"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChessEngineInterface = void 0;
var child_process_1 = require("child_process");
var ChessEngineInterface = /** @class */ (function () {
    function ChessEngineInterface(enginePath) {
        try {
            this.engineProcess = (0, child_process_1.spawn)(enginePath);
        }
        catch (error) {
            throw new Error("Failed to spawn engine process: ".concat(error.message));
        }
    }
    ChessEngineInterface.prototype.sendCommand = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.engineProcess.stdin.write(command + '\n', function (err) {
                            if (err)
                                reject(err);
                            else
                                resolve();
                        });
                    })];
            });
        });
    };
    ChessEngineInterface.prototype.getEngineOutput = function (endSignal) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var dataBuffer = '';
                        var dataListener = function (data) {
                            dataBuffer += data.toString();
                            if (dataBuffer.includes(endSignal)) {
                                _this.engineProcess.stdout.off('data', dataListener);
                                resolve(dataBuffer);
                            }
                        };
                        _this.engineProcess.stdout.on('data', dataListener);
                        _this.engineProcess.stdout.once('error', function (err) {
                            _this.engineProcess.stdout.off('data', dataListener);
                            reject(err);
                        });
                    })];
            });
        });
    };
    // Shuts down the engine process.
    ChessEngineInterface.prototype.quit = function () {
        this.engineProcess.kill();
    };
    // Sends the 'uci' command to the engine and returns the engine's response.
    ChessEngineInterface.prototype.uci = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendCommand('uci')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getEngineOutput('uciok')];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // Sends the 'isready' command to the engine and returns the engine's response.
    ChessEngineInterface.prototype.isReady = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendCommand('isready')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getEngineOutput('readyok')];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // Sends a 'position' command to the engine.
    ChessEngineInterface.prototype.position = function (fen_or_start_pos, moves) {
        return __awaiter(this, void 0, void 0, function () {
            var command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = fen_or_start_pos === 'startpos'
                            ? 'position startpos'
                            : "position fen ".concat(fen_or_start_pos);
                        if (moves) {
                            command += " moves ".concat(moves.join(' '));
                        }
                        return [4 /*yield*/, this.sendCommand(command)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Sends a 'ucinewgame' command to the engine.
    ChessEngineInterface.prototype.uciNewGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendCommand('ucinewgame')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Sends a 'go depth' command to the engine and returns the best move.
    ChessEngineInterface.prototype.goDepth = function (depth) {
        return __awaiter(this, void 0, void 0, function () {
            var response, bestMoveLine, bestMove;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendCommand("go depth ".concat(depth))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getEngineOutput('bestmove')];
                    case 2:
                        response = _a.sent();
                        console.log(response);
                        bestMoveLine = response.split('\n').find(function (line) { return line.startsWith('bestmove'); });
                        if (!bestMoveLine) {
                            throw new Error("No best move found in engine response: ".concat(response));
                        }
                        bestMove = bestMoveLine.split(' ')[1];
                        return [2 /*return*/, bestMove];
                }
            });
        });
    };
    // Sends a 'go' command to the engine with the given options.
    ChessEngineInterface.prototype.go = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var command, _i, _a, _b, option, value;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        command = 'go';
                        for (_i = 0, _a = Object.entries(options); _i < _a.length; _i++) {
                            _b = _a[_i], option = _b[0], value = _b[1];
                            if (option === 'searchmoves' && Array.isArray(value)) {
                                command += " ".concat(option, " ").concat(value.join(' '));
                            }
                            else if (value !== undefined) {
                                command += " ".concat(option, " ").concat(value);
                            }
                        }
                        return [4 /*yield*/, this.sendCommand(command)];
                    case 1:
                        _c.sent();
                        if (!options.infinite) {
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    _this.engineProcess.on('bestmove', function (move) {
                                        resolve(move);
                                    });
                                    _this.engineProcess.on('error', function (err) {
                                        reject(err);
                                    });
                                })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Sends a 'setoption' command to the engine.
    ChessEngineInterface.prototype.setOption = function (name, value) {
        return __awaiter(this, void 0, void 0, function () {
            var command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = "setoption name ".concat(name);
                        if (value !== undefined) {
                            command += " value ".concat(value);
                        }
                        return [4 /*yield*/, this.sendCommand(command)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Sends a 'stop' command to the engine and returns the best move.
    ChessEngineInterface.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendCommand('stop')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getEngineOutput('bestmove')];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // Sends a 'debug' command to the engine.
    ChessEngineInterface.prototype.setDebugMode = function (on) {
        return __awaiter(this, void 0, void 0, function () {
            var mode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mode = on ? 'on' : 'off';
                        return [4 /*yield*/, this.sendCommand("debug ".concat(mode))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Sends a 'register' command to the engine.
    ChessEngineInterface.prototype.register = function (name, code) {
        return __awaiter(this, void 0, void 0, function () {
            var command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = 'register';
                        if (name && code) {
                            command += " name ".concat(name, " code ").concat(code);
                        }
                        else {
                            command += ' later';
                        }
                        return [4 /*yield*/, this.sendCommand(command)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Sends a 'ponderhit' command to the engine.
    ChessEngineInterface.prototype.ponderhit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendCommand('ponderhit')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ChessEngineInterface;
}());
exports.ChessEngineInterface = ChessEngineInterface;
