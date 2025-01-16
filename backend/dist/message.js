"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageType = void 0;
var messageType;
(function (messageType) {
    messageType["INIT_GAME"] = "init_game";
    messageType["MOVE"] = "move";
    messageType["INVALID_MOVE"] = "invalid_move";
    messageType["COLOR"] = "color";
})(messageType || (exports.messageType = messageType = {}));
