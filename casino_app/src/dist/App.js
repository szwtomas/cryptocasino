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
var react_1 = require("react");
require("./App.css");
var react_2 = require("react");
var ethers_1 = require("ethers");
var antd_1 = require("antd");
var FancyButton_1 = require("./FancyButton");
var CryptoCasino_json_1 = require("./artifacts/contracts/CryptoCasino.sol/CryptoCasino.json");
var RouletteWheel_1 = require("./RouletteWheel");
var Dices_1 = require("./Dices");
var casinoContractAddress = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";
var crapsContractAddress = "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9";
var Header = antd_1.Layout.Header, Footer = antd_1.Layout.Footer, Content = antd_1.Layout.Content, Sider = antd_1.Layout.Sider;
var Title = antd_1.Typography.Title;
function App() {
    var _a = react_2.useState(0), buyAmount = _a[0], setBuyAmount = _a[1];
    var _b = react_2.useState(0), sellAmount = _b[0], setSellAmount = _b[1];
    var _c = react_2.useState(0), currentChipAmount = _c[0], setCurrentChipAmount = _c[1];
    var _d = react_2.useState("menu"), gameState = _d[0], setGameState = _d[1];
    react_2.useEffect(function () {
        getBalance();
    }, []);
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
    function getBalance() {
        return __awaiter(this, void 0, void 0, function () {
            var provider, signer, contract, currentBalance, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof window.ethereum !== 'undefined')) return [3 /*break*/, 5];
                        provider = new ethers_1.ethers.providers.Web3Provider(window.ethereum);
                        signer = provider.getSigner();
                        contract = new ethers_1.ethers.Contract(casinoContractAddress, CryptoCasino_json_1["default"].abi, signer);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, contract.balance()];
                    case 2:
                        currentBalance = _a.sent();
                        setCurrentChipAmount(Number(currentBalance._hex));
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.log("Error: ", err_1);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        alert("this is a dapp, so please install metamask chrome extensions to continue");
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function buyChips(amount) {
        return __awaiter(this, void 0, void 0, function () {
            var provider, signer, contract, cantidad, transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof window.ethereum !== 'undefined')) return [3 /*break*/, 5];
                        return [4 /*yield*/, requestAccount()];
                    case 1:
                        _a.sent();
                        provider = new ethers_1.ethers.providers.Web3Provider(window.ethereum);
                        console.log({ provider: provider });
                        signer = provider.getSigner();
                        contract = new ethers_1.ethers.Contract(casinoContractAddress, CryptoCasino_json_1["default"].abi, signer);
                        console.log(contract);
                        cantidad = amount / 100;
                        return [4 /*yield*/, contract.buy({ value: ethers_1.ethers.utils.parseEther("" + cantidad) })];
                    case 2:
                        transaction = _a.sent();
                        return [4 /*yield*/, transaction.wait()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, getBalance()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function sellChips(amount) {
        return __awaiter(this, void 0, void 0, function () {
            var provider, signer, contract, transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof window.ethereum !== 'undefined')) return [3 /*break*/, 5];
                        return [4 /*yield*/, requestAccount()];
                    case 1:
                        _a.sent();
                        provider = new ethers_1.ethers.providers.Web3Provider(window.ethereum);
                        console.log({ provider: provider });
                        signer = provider.getSigner();
                        contract = new ethers_1.ethers.Contract(casinoContractAddress, CryptoCasino_json_1["default"].abi, signer);
                        return [4 /*yield*/, contract.sell(amount)];
                    case 2:
                        transaction = _a.sent();
                        return [4 /*yield*/, transaction.wait()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, getBalance()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    return (react_1["default"].createElement(antd_1.Layout, { style: {
            background: "linear-gradient(#a5100f, #4a0a09)",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        } },
        react_1["default"].createElement("div", { style: {
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                overflow: "auto",
                width: 1440,
                minHeight: 900,
                borderRadius: 10,
                backgroundRepeat: "no-repeat",
                border: "10px ridge #3003036e",
                backgroundImage: "url(" + process.env.PUBLIC_URL + "/4dJZSy.jpeg" + ")"
            } },
            react_1["default"].createElement("div", { style: {
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: 20
                } },
                react_1["default"].createElement(Title, { style: { fontWeight: 800, margin: 20, fontSize: "1.5rem", color: "white" } }, "Available Chips: " + currentChipAmount + " \uD83C\uDF15",
                    "  "),
                react_1["default"].createElement("div", { style: { display: "flex", alignItems: "center" } },
                    react_1["default"].createElement(FancyButton_1.FancyButton, { customStyle: { fontSize: "1rem", fontWeight: 600 }, text: 'buy: ', onClick: function () { return buyChips(buyAmount); } }),
                    react_1["default"].createElement(antd_1.InputNumber, { style: { backgroundColor: "black", padding: 10, color: "white", fontSize: 20 }, defaultValue: 0, value: buyAmount, onChange: function (newBuyAmount) { return setBuyAmount(newBuyAmount); } }),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement(FancyButton_1.FancyButton, { customStyle: { fontSize: "1rem", fontWeight: 600 }, text: 'sell: ', onClick: function () { return sellChips(sellAmount); } }),
                        react_1["default"].createElement(antd_1.InputNumber, { style: { backgroundColor: "black", padding: 10, color: "white", fontSize: 20 }, defaultValue: 0, value: sellAmount, onChange: function (newSellAmount) { return setSellAmount(newSellAmount); } })))),
            gameState == "menu" &&
                react_1["default"].createElement("div", { style: {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        height: "100%"
                    } },
                    react_1["default"].createElement(Title, { style: { fontWeight: 900, fontSize: 60, color: "white" } }, "Crypto Casino Online "),
                    react_1["default"].createElement(FancyButton_1.FancyButton, { customStyle: { width: 400 }, text: "Play Dices \uD83C\uDFB2", onClick: function () { return setGameState("dices"); } }),
                    react_1["default"].createElement(FancyButton_1.FancyButton, { customStyle: { width: 400 }, text: "Play Slots \uD83C\uDFB0", onClick: function () { return setGameState("slots"); } }),
                    react_1["default"].createElement(FancyButton_1.FancyButton, { customStyle: { width: 400 }, text: "Play Roulette \uD83C\uDFA1", onClick: function () { return setGameState("roulette"); } })),
            gameState == 'dices' && react_1["default"].createElement(Dices_1.Dices, { updateBalance: getBalance, onGoBack: function () { return setGameState('menu'); } }),
            gameState == 'roulette' &&
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement(RouletteWheel_1.RouletteWheel, null),
                    react_1["default"].createElement(FancyButton_1.FancyButton, { customStyle: { width: 300 }, text: "Join Game", onClick: function () { return null; } }),
                    react_1["default"].createElement(FancyButton_1.FancyButton, { customStyle: { width: 300 }, text: "Back to Menu", onClick: function () { return setGameState("menu"); } })))));
}
exports["default"] = App;
