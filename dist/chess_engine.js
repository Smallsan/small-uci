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
    function ChessEngineInterface(engine_path) {
        this.engine_process = (0, child_process_1.spawn)(engine_path);
    }
    // Bot Commands.
    ChessEngineInterface.prototype.send_command_expect_output = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.engine_process.stdin.write(command + '\n');
                        _this.engine_process.stdout.once('data', function (data) {
                            var response = data.toString();
                            resolve(response);
                        });
                        _this.engine_process.stdout.once('error', reject);
                    })];
            });
        });
    };
    ChessEngineInterface.prototype.send_command_no_output = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.engine_process.stdin.write(command + '\n');
                        _this.engine_process.stdout.once('error', reject);
                        resolve();
                    })];
            });
        });
    };
    ChessEngineInterface.prototype.shutdown = function () {
        this.engine_process.kill();
    };
    // Uci Commands.
    ChessEngineInterface.prototype.uci = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.send_command_expect_output('uci')];
            });
        });
    };
    ChessEngineInterface.prototype.isReady = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.send_command_expect_output('isready')];
            });
        });
    };
    ChessEngineInterface.prototype.position = function (fen_or_start_pos, moves) {
        return __awaiter(this, void 0, void 0, function () {
            var command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = '';
                        if (fen_or_start_pos === 'startpos') {
                            command = 'position startpos';
                        }
                        else {
                            command = "position fen ".concat(fen_or_start_pos);
                        }
                        if (moves) {
                            command += " moves ".concat(moves.join(' '));
                        }
                        return [4 /*yield*/, this.send_command_no_output(command)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChessEngineInterface.prototype.go_depth = function (depth) {
        return __awaiter(this, void 0, void 0, function () {
            var command, response, bestMoveLine, bestMove;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = "go depth ".concat(depth);
                        return [4 /*yield*/, this.send_command_expect_output(command)];
                    case 1:
                        response = _a.sent();
                        bestMoveLine = response.split('\n').find(function (line) { return line.startsWith('bestmove'); });
                        if (!bestMoveLine) {
                            throw new Error('No best move found in engine response');
                        }
                        bestMove = bestMoveLine.split(' ')[1];
                        return [2 /*return*/, bestMove];
                }
            });
        });
    };
    return ChessEngineInterface;
}());
exports.ChessEngineInterface = ChessEngineInterface;
