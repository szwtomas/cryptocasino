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
        while (_) try {
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
exports.__esModule = true;
exports.Dices = void 0;
var react_1 = require("react");
require("./App.css");
var react_2 = require("react");
var ethers_1 = require("ethers");
var antd_1 = require("antd");
var react_dice_roll_1 = require("react-dice-roll");
var FancyButton_1 = require("./FancyButton");
var CryptoCraps_json_1 = require("./artifacts/contracts/CryptoCraps.sol/CryptoCraps.json");
var crapsContractAddress = '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9';
var Title = antd_1.Typography.Title;
function Dices(props) {
    var _this = this;
    var _a = react_2.useState(6), currentPlayersRemaining = _a[0], setCurrentPlayersRemaining = _a[1];
    var _b = react_2.useState(0), currentBetValue = _b[0], setCurrentBetValue = _b[1];
    var _c = react_2.useState(1), choice = _c[0], _setChoice = _c[1];
    var _d = react_2.useState(0), bet = _d[0], _setBet = _d[1];
    var _e = react_2.useState(false), playingDice = _e[0], _setPlayingDice = _e[1];
    var _f = react_2.useState(undefined), winningDice = _f[0], _setWinningDice = _f[1];
    var betRef = react_1.useRef(bet);
    var choiceRef = react_1.useRef(choice);
    var playingDiceRef = react_1.useRef(playingDice);
    var winningDiceRef = react_1.useRef(winningDice);
    var setChoice = function (choice) {
        choiceRef.current = choice;
        _setChoice(choice);
    };
    var setBet = function (bet) {
        betRef.current = bet;
        _setBet(bet);
    };
    var setPlayingDice = function (playing) {
        playingDiceRef.current = playing;
        _setPlayingDice(playing);
    };
    var setWinningDice = function (choice) {
        winningDiceRef.current = choice;
        _setWinningDice(choice);
    };
    react_2.useEffect(function () {
        getDiceInformation();
    }, []);
    react_2.useEffect(function () {
        console.log("dado ganador dice", winningDice);
        winningDice !== undefined && window.dispatchEvent(new KeyboardEvent('keypress', {
            key: 'd'
        }));
    }, [winningDice]);
    react_2.useEffect(function () {
        if (typeof window.ethereum !== 'undefined') {
            var provider = new ethers_1.ethers.providers.Web3Provider(window.ethereum);
            var signer_1 = provider.getSigner();
            var contract_1 = new ethers_1.ethers.Contract(crapsContractAddress, CryptoCraps_json_1["default"].abi, signer_1);
            contract_1.on('DiceRolled', function (winnerAddress, diceNumber) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (playingDiceRef.current.valueOf()) {
                        setWinningDice(diceNumber);
                        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _a = winnerAddress;
                                        return [4 /*yield*/, signer_1.getAddress()];
                                    case 1:
                                        if (!(_a == (_d.sent()))) return [3 /*break*/, 3];
                                        antd_1.Modal.success({ title: "Congrats! You won" });
                                        _b = setPlayingDice;
                                        return [4 /*yield*/, contract_1.playerPlayingDice()];
                                    case 2:
                                        _b.apply(void 0, [_d.sent()]);
                                        return [3 /*break*/, 5];
                                    case 3:
                                        antd_1.Modal.error({ title: "You didn't choose the right one :(" });
                                        _c = setPlayingDice;
                                        return [4 /*yield*/, contract_1.playerPlayingDice()];
                                    case 4:
                                        _c.apply(void 0, [_d.sent()]);
                                        _d.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); }, 3500);
                    }
                    else {
                        winningDice !== undefined && getDiceInformation();
                    }
                    return [2 /*return*/];
                });
            }); });
            contract_1.on('PlayerAdded', function (currentPlayers) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!playingDiceRef.current) return [3 /*break*/, 4];
                            _a = setCurrentPlayersRemaining;
                            _b = 6;
                            return [4 /*yield*/, contract_1.currentPlayersCount()];
                        case 1:
                            _a.apply(void 0, [_b - (_e.sent())]);
                            _c = setCurrentBetValue;
                            return [4 /*yield*/, contract_1.currentBetValue()];
                        case 2:
                            _c.apply(void 0, [_e.sent()]);
                            _d = setBet;
                            return [4 /*yield*/, contract_1.currentBetValue()];
                        case 3:
                            _d.apply(void 0, [_e.sent()]);
                            props.updateBalance();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            return function () {
                contract_1.removeAllListeners();
            };
        }
    }, [playingDice]);
    function requestAccount() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, window.ethereum.request({ method: 'eth_requestAccounts' })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function getDiceInformation() {
        return __awaiter(this, void 0, void 0, function () {
            var provider, signer, contract, _a, _b, _c, _d, _e, err_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!(typeof window.ethereum !== 'undefined')) return [3 /*break*/, 8];
                        provider = new ethers_1.ethers.providers.Web3Provider(window.ethereum);
                        signer = provider.getSigner();
                        contract = new ethers_1.ethers.Contract(crapsContractAddress, CryptoCraps_json_1["default"].abi, signer);
                        console.log("obteniendo dice info");
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 6, , 7]);
                        _a = setCurrentPlayersRemaining;
                        _b = 6;
                        return [4 /*yield*/, contract.currentPlayersCount()];
                    case 2:
                        _a.apply(void 0, [_b - (_f.sent())]);
                        _c = setCurrentBetValue;
                        return [4 /*yield*/, contract.currentBetValue()];
                    case 3:
                        _c.apply(void 0, [_f.sent()]);
                        _d = setPlayingDice;
                        return [4 /*yield*/, contract.playerPlayingDice()];
                    case 4:
                        _d.apply(void 0, [_f.sent()]);
                        _e = setBet;
                        return [4 /*yield*/, contract.currentBetValue()];
                    case 5:
                        _e.apply(void 0, [_f.sent()]);
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _f.sent();
                        console.error('Error: ', err_1);
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        alert('this is a dapp, so please install metamask chrome extensions to continue');
                        _f.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    }
    function betSingleDice(diceNumber, bet) {
        return __awaiter(this, void 0, void 0, function () {
            var provider, signer, contract, transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof window.ethereum !== 'undefined')) return [3 /*break*/, 4];
                        return [4 /*yield*/, requestAccount()];
                    case 1:
                        _a.sent();
                        provider = new ethers_1.ethers.providers.Web3Provider(window.ethereum);
                        signer = provider.getSigner();
                        contract = new ethers_1.ethers.Contract(crapsContractAddress, CryptoCraps_json_1["default"].abi, signer);
                        return [4 /*yield*/, contract.betNumberSingleDice(diceNumber, bet)];
                    case 2:
                        transaction = _a.sent();
                        return [4 /*yield*/, transaction.wait()];
                    case 3:
                        _a.sent();
                        setPlayingDice(true);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    return (react_1["default"].createElement("div", { style: {
            marginTop: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        } },
        react_1["default"].createElement("div", { style: {
                backgroundColor: '#d7d7d7',
                width: 200,
                height: 200,
                border: '10px ridge #c13f3f',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            } },
            react_1["default"].createElement(react_dice_roll_1["default"], { rollingTime: 3000, cheatValue: winningDiceRef.current, triggers: ['d'], defaultValue: 1, size: 100, faceBg: '#d7d7d7', faces: [
                    'Dice-1-b.svg.png',
                    '/Dice-2-b.svg.png',
                    '/Dice-3-b.svg.png',
                    '/Dice-4-b.svg.png',
                    '/Dice-5-b.svg.png',
                    '/Dice-6-b.svg.png',
                ] })),
        react_1["default"].createElement("div", { style: {
                marginTop: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            } },
            react_1["default"].createElement(Title, { style: {
                    fontWeight: 800,
                    margin: 10,
                    fontSize: '1.5rem',
                    color: 'white'
                } }, "Current Bet Value: " + currentBetValue + " chips",
                ' '),
            react_1["default"].createElement(Title, { style: {
                    fontWeight: 800,
                    margin: 20,
                    fontSize: '1.5rem',
                    color: 'white'
                } }, currentPlayersRemaining + " Players remaining to join...",
                ' '),
            !playingDice && (react_1["default"].createElement("div", { style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                } },
                react_1["default"].createElement(FancyButton_1.FancyButton, { customStyle: { width: 300 }, text: "Join Game", onClick: function () { return betSingleDice(choice, bet); } }),
                react_1["default"].createElement(Title, { style: {
                        fontWeight: 800,
                        margin: 20,
                        fontSize: '1.5rem',
                        color: 'white'
                    } },
                    "Choose a number between 1 and 6",
                    ' '),
                react_1["default"].createElement(antd_1.InputNumber, { style: {
                        backgroundColor: 'black',
                        padding: 10,
                        color: 'white',
                        fontSize: 20
                    }, defaultValue: 1, value: choice, onChange: function (newchoice) { return setChoice(newchoice); } }))),
            currentPlayersRemaining === 6 && !playingDice && (react_1["default"].createElement("div", { style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                } },
                react_1["default"].createElement(Title, { style: {
                        fontWeight: 800,
                        margin: 20,
                        fontSize: '1.5rem',
                        color: 'white'
                    } },
                    "Choose how much to bet",
                    ' '),
                react_1["default"].createElement(antd_1.InputNumber, { style: {
                        backgroundColor: 'black',
                        padding: 10,
                        color: 'white',
                        fontSize: 20
                    }, defaultValue: 0, value: bet, onChange: function (newbet) { return setBet(newbet); } }))),
            react_1["default"].createElement(FancyButton_1.FancyButton, { customStyle: { width: 300 }, text: "Back to Menu", onClick: props.onGoBack }))));
}
exports.Dices = Dices;
