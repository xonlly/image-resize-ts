var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "inkjet"], function (require, exports, inkjet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    const createImage = (binary) => new Promise(resolve => {
        const blob = new Blob([binary]);
        const image = new Image();
        image.src = URL.createObjectURL(blob);
        image.onload = () => resolve(image);
    });
    const rotateAndResize = (inkjetImage, exifOrientationId, maxWidth = 800) => __awaiter(this, void 0, void 0, function* () {
        if (!EXIF_TRANSFORMS[exifOrientationId])
            return inkjetImage;
        const canvas = getCanvasForImage(inkjetImage, maxWidth);
        const image = yield createImage(inkjetImage.data);
        const w = canvas.width;
        const h = canvas.height;
        if (exifOrientationId > 4) {
            const temp = canvas.width;
            canvas.width = canvas.height;
            canvas.height = temp;
        }
        const ctx = exifTransformCanvas(canvas.getContext('2d'), exifOrientationId);
        ctx.drawImage(image, 0, 0, inkjetImage.width, inkjetImage.height, -w / 2, -h / 2, w, h);
        if (typeof canvas.toBlob !== 'undefined') {
            return new Promise(resolve => canvas.toBlob(resolve));
        }
        else if (typeof canvas.msToBlob !== 'undefined') {
            return canvas.msToBlob();
        }
        return inkjetImage.data;
    });
    const Resizer = (binary, quality = 100, maxWidth = 800) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, width, height } = yield inkjetPromised.decode(binary);
            const imageEncoded = yield inkjetPromised.encode(data, {
                quality,
                width,
                height,
            });
            const metadata = yield inkjetPromised.exif(binary);
            let orientation = 1;
            if (metadata.Orientation)
                orientation = metadata.Orientation.value;
            const image = yield rotateAndResize(imageEncoded, orientation, maxWidth);
            return image;
        }
        catch (e) {
            return binary;
        }
    });
    exports.default = Resizer;
});
//# sourceMappingURL=index.js.map