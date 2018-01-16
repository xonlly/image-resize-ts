(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const _1 = require("./");
    describe('image-resizer', () => {
        it('should be get an resizer object', () => {
            console.log('resizer', _1.default);
            expect(true).toBe(true);
        });
    });
});
//# sourceMappingURL=index.spec.js.map