"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var inkjet_1 = require("inkjet");
var EXIF_TRANSFORMS = {
    1: { rotate: 0, flip: false },
    2: { rotate: 0, flip: true },
    3: { rotate: Math.PI, flip: false },
    4: { rotate: Math.PI, flip: true },
    5: { rotate: Math.PI * 1.5, flip: true },
    6: { rotate: Math.PI * 0.5, flip: false },
    7: { rotate: Math.PI * 0.5, flip: true },
    8: { rotate: Math.PI * 1.5, flip: false },
};
var inkjet = {
    decode: function (buf) {
        return new Promise(function (resolve, reject) {
            return inkjet_1.default.decode(buf, function (err, decoded) {
                if (err)
                    return reject(err);
                return resolve(decoded);
            });
        });
    },
    encode: function (buf, options) {
        return new Promise(function (resolve, reject) {
            return inkjet_1.default.encode(buf, options, function (err, encoded) {
                if (err)
                    return reject(err);
                return resolve(encoded);
            });
        });
    },
    exif: function (buf) {
        return new Promise(function (resolve, reject) {
            return inkjet_1.default.exif(buf, function (err, metadata) {
                if (err)
                    return reject(err);
                return resolve(metadata);
            });
        });
    },
};
var transformCanvas = function (ctx, degrees, flip) {
    if (degrees === void 0) { degrees = 0; }
    if (flip === void 0) { flip = false; }
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.rotate(degrees);
    if (flip) {
        ctx.scale(-1, 1);
    }
    return ctx;
};
var exifTransformCanvas = function (ctx, orientation) {
    var transform = EXIF_TRANSFORMS[orientation];
    if (transform) {
        return transformCanvas(ctx, transform.rotate, transform.flip);
    }
    return ctx;
};
var getCanvasForImage = function (image, maxWidth) {
    var canvas = document.createElement('canvas');
    var w = image.width;
    var h = image.height;
    if (maxWidth && w > maxWidth) {
        var ratio = w / h;
        w = maxWidth;
        h = w / ratio;
    }
    canvas.width = w;
    canvas.height = h;
    return canvas;
};
var createImage = function (binary) {
    return new Promise(function (resolve) {
        var blob = new Blob([binary]);
        var image = new Image();
        image.src = URL.createObjectURL(blob);
        image.onload = function () { return resolve(image); };
    });
};
var rotateAndResize = function (inkjetImage, exifOrientationId, maxWidth) {
    if (maxWidth === void 0) { maxWidth = 800; }
    return __awaiter(_this, void 0, void 0, function () {
        var canvas, image, w, h, temp, ctx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!EXIF_TRANSFORMS[exifOrientationId])
                        return [2 /*return*/, inkjetImage];
                    canvas = getCanvasForImage(inkjetImage, maxWidth);
                    return [4 /*yield*/, createImage(inkjetImage.data)];
                case 1:
                    image = _a.sent();
                    w = canvas.width;
                    h = canvas.height;
                    if (exifOrientationId > 4) {
                        temp = canvas.width;
                        canvas.width = canvas.height;
                        canvas.height = temp;
                    }
                    ctx = exifTransformCanvas(canvas.getContext('2d'), exifOrientationId);
                    ctx.drawImage(image, 0, 0, inkjetImage.width, inkjetImage.height, -w / 2, -h / 2, w, h);
                    if (typeof canvas.toBlob !== 'undefined') {
                        return [2 /*return*/, new Promise(function (resolve) { return canvas.toBlob(resolve); })];
                    }
                    else if (typeof canvas.msToBlob !== 'undefined') {
                        return [2 /*return*/, canvas.msToBlob()];
                    }
                    return [2 /*return*/, inkjetImage.data];
            }
        });
    });
};
var Resizer = function (binary, quality, maxWidth) {
    if (quality === void 0) { quality = 100; }
    if (maxWidth === void 0) { maxWidth = 800; }
    return __awaiter(_this, void 0, void 0, function () {
        var _a, Any, String_1, String_2, imageEncoded, metadata, orientation_1, image, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, inkjet.decode(binary)];
                case 1:
                    _a = _b.sent(), Any = _a.data, String_1 = _a.width, String_1 = _a.height;
                    return [4 /*yield*/, inkjet.encode(data, {
                            quality: quality,
                            width: width,
                            height: height,
                        })];
                case 2:
                    imageEncoded = _b.sent();
                    return [4 /*yield*/, inkjet.exif(binary)];
                case 3:
                    metadata = _b.sent();
                    orientation_1 = 1;
                    if (metadata.Orientation)
                        orientation_1 = metadata.Orientation.value;
                    return [4 /*yield*/, rotateAndResize(imageEncoded, orientation_1, maxWidth)];
                case 4:
                    image = _b.sent();
                    return [2 /*return*/, image];
                case 5:
                    e_1 = _b.sent();
                    return [2 /*return*/, binary];
                case 6: return [2 /*return*/];
            }
        });
    });
};
exports.default = Resizer;
