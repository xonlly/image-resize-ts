"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inkjet_1 = require("inkjet");
const EXIF_TRANSFORMS = {
    1: { rotate: 0, flip: false },
    2: { rotate: 0, flip: true },
    3: { rotate: Math.PI, flip: false },
    4: { rotate: Math.PI, flip: true },
    5: { rotate: Math.PI * 1.5, flip: true },
    6: { rotate: Math.PI * 0.5, flip: false },
    7: { rotate: Math.PI * 0.5, flip: true },
    8: { rotate: Math.PI * 1.5, flip: false },
};
let inkjetPromised = {
    decode: (buf) => new Promise((resolve, reject) => inkjet_1.default.decode(buf, (err, decoded) => {
        if (err)
            return reject(err);
        return resolve(decoded);
    })),
    encode: (buf, options) => new Promise((resolve, reject) => inkjet_1.default.encode(buf, options, (err, encoded) => {
        if (err)
            return reject(err);
        return resolve(encoded);
    })),
    exif: (buf) => new Promise((resolve, reject) => inkjet_1.default.exif(buf, (err, metadata) => {
        if (err)
            return reject(err);
        return resolve(metadata);
    })),
};
const transformCanvas = (ctx, degrees = 0, flip = false) => {
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.rotate(degrees);
    if (flip) {
        ctx.scale(-1, 1);
    }
    return ctx;
};
const exifTransformCanvas = (ctx, orientation) => {
    const transform = EXIF_TRANSFORMS[orientation];
    if (transform) {
        return transformCanvas(ctx, transform.rotate, transform.flip);
    }
    return ctx;
};
const getCanvasForImage = (image, // TODO: need update for this
    maxWidth) => {
    const canvas = document.createElement('canvas');
    let w = image.width;
    let h = image.height;
    if (maxWidth && w > maxWidth) {
        const ratio = w / h;
        w = maxWidth;
        h = w / ratio;
    }
    canvas.width = w;
    canvas.height = h;
    return canvas;
};
console.log('inkjet', inkjet_1.default, EXIF_TRANSFORMS);
//# sourceMappingURL=index.js.map