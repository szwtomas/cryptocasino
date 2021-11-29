"use strict";
exports.__esModule = true;
exports.RouletteWheel = void 0;
var react_1 = require("react");
require("./App.css");
var react_custom_roulette_1 = require("react-custom-roulette");
var FancyButton_1 = require("./FancyButton");
exports.RouletteWheel = function () {
    var _a = react_1.useState(false), mustSpin = _a[0], setMustSpin = _a[1];
    var _b = react_1.useState(0), prizeNumber = _b[0], setPrizeNumber = _b[1];
    var data = Array.from(Array(34).keys()).map(function (n) { return ({ option: n.toString() }); });
    var backgroundColors = ['red', 'black'];
    var textColors = ['white'];
    var outerBorderColor = 'black';
    var outerBorderWidth = 10;
    var innerBorderColor = 'black';
    var innerBorderWidth = 5;
    var innerRadius = 10;
    var radiusLineColor = 'gray';
    var radiusLineWidth = 2;
    var fontSize = 17;
    var textDistance = 70;
    var handleSpinClick = function () {
        var newPrizeNumber = Math.floor(Math.random() * data.length);
        setPrizeNumber(newPrizeNumber);
        setMustSpin(true);
    };
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement(react_custom_roulette_1.Wheel, { mustStartSpinning: mustSpin, prizeNumber: prizeNumber, data: data, backgroundColors: backgroundColors, textColors: textColors, fontSize: fontSize, outerBorderColor: outerBorderColor, outerBorderWidth: outerBorderWidth, innerRadius: innerRadius, innerBorderColor: innerBorderColor, innerBorderWidth: innerBorderWidth, radiusLineColor: radiusLineColor, radiusLineWidth: radiusLineWidth, perpendicularText: true, textDistance: textDistance, onStopSpinning: function () {
                setMustSpin(false);
            } }),
        react_1["default"].createElement(FancyButton_1.FancyButton, { text: "SPIN", onClick: handleSpinClick })));
};
