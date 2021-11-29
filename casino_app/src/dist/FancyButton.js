"use strict";
exports.__esModule = true;
exports.FancyButton = void 0;
var react_1 = require("react");
function FancyButton(props) {
    return react_1["default"].createElement("button", { className: "button-82-pushable", role: "button", onClick: props.onClick, style: props.customStyle },
        react_1["default"].createElement("span", { className: "button-82-shadow" }),
        react_1["default"].createElement("span", { className: "button-82-edge" }),
        react_1["default"].createElement("span", { className: "button-82-front text", style: props.customStyle }, props.text));
}
exports.FancyButton = FancyButton;
