export {};

declare global {
    interface Number {
        isValidLatitude(): boolean;
        isValidLongitude(): boolean;
    }
}

Number.prototype.isValidLatitude = function(): boolean {
    return !(this > 90 || this < -90);
};

Number.prototype.isValidLongitude = function(): boolean {
    return !(this > 180 || this < -180);
};
