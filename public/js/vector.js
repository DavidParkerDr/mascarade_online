class Vector {
    constructor(pX, pY, pZ) {
        this.setX(pX);
        this.setY(pY);
        this.setZ(pZ);
    }
    getX() {
        return this.mX;
    }
    getY() {
        return this.mY;
    }
    getZ() {
        return this.mZ;
    }
    setX(pX) {
        this.mX = pX;
    }
    setY(pY) {
        this.mY = pY;
    }
    setZ(pZ) {
        this.mZ = pZ;
    }
    copy() {
        return new Vector(this.mX, this.mY, this.mZ);
    }
    equals(pVector) {
        if (this.mX === pVector.getX() &&
                this.mY === pVector.getY() &&
                this.mZ === pVector.getZ()) {
            return true;
        }
        return false;
    }
    add(pVector) {
        var x, y, z;
        x = this.mX + pVector.getX();
        y = this.mY + pVector.getY();
        z = this.mZ;
        return new Vector(x, y, z);
    }
    subtract(pVector) {
        var x, y, z;
        x = this.mX - pVector.getX();
        y = this.mY - pVector.getY();
        z = this.mZ;
        return new Vector(x, y, z);
    }
    multiply(pScalar) {
        var x, y, z;
        x = this.mX * pScalar;
        y = this.mY * pScalar;
        z = this.mZ;
        return new Vector(x, y, z);
    }
    divide(pScalar) {
        var x, y, z;
        x = this.mX / pScalar;
        y = this.mY / pScalar;
        z = this.mZ;
        return new Vector(x, y, z);
    }
    magnitude() {
        return Math.sqrt(this.mX * this.mX + this.mY * this.mY);
    }
    normalise() {
        var normalisedVector;
        normalisedVector = this.divide(this.magnitude());
        return normalisedVector;
    }
    rotate(pRadians) {
        var x, y, z;
        x = -Math.sin(pRadians) * this.mY + Math.cos(pRadians) * this.mX;
        y = Math.sin(pRadians) * this.mX + Math.cos(pRadians) * this.mY;
        z = this.mZ;
        return new Vector(x, y, z);
    }
    limitTo(pMax) {
        var limitedVector;
        if (this.magnitude() > pMax) {
            limitedVector = this.normalise();
            limitedVector = limitedVector.multiply(pMax);
        } else {
            limitedVector = this.copy();
        }
        return limitedVector;
    }
    interpolate(pVector, pInterpolation) {
        var difference, interpolatedVector;
        difference = pVector.subtract(this);
        difference = difference.multiply(pInterpolation);
        interpolatedVector = this.add(difference);
        return interpolatedVector;
    }
    dotProduct(pVector) {
        return this.mX * pVector.getX() +
            this.mY * pVector.getY() +
            this.mZ * pVector.getZ();
    }
    angleBetween(pVector) {
        var dot, denominator, cosAngle, angle;
        dot = this.dotProduct(pVector);
        denominator = this.magnitude() * pVector.magnitude();
        cosAngle = dot / denominator;
        angle = Math.acos(cosAngle);
        return angle;
    }

    alert() {
        alert(this.getX() + '\n' +
            this.getY() + '\n' +
            this.getZ());
    }
    log(pLabel) {
        console.log(pLabel + '(' + this.getX() + ', ' +
            this.getY() + ', ' +
            this.getZ() + ')');
    }
    thisIsDavidsVector() {
        return true;
    }
}

if (typeof exports !== 'undefined') {
    exports.Vector = Vector;
}
else {
    window.Vector = Vector;
}