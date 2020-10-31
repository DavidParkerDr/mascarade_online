class Matrix {
    constructor(pRow0Column0,
        pRow0Column1,
        pRow0Column2,
        pRow1Column0,
        pRow1Column1,
        pRow1Column2,
        pRow2Column0,
        pRow2Column1,
        pRow2Column2) {
        this.mElements = [];
        this.setElement(0, 0, pRow0Column0);
        this.setElement(0, 1, pRow0Column1);
        this.setElement(0, 2, pRow0Column2);
        this.setElement(1, 0, pRow1Column0);
        this.setElement(1, 1, pRow1Column1);
        this.setElement(1, 2, pRow1Column2);
        this.setElement(2, 0, pRow2Column0);
        this.setElement(2, 1, pRow2Column1);
        this.setElement(2, 2, pRow2Column2);
    }
    static get NUM_ROWS() {
        return 3;
    }
    static get NUM_COLUMNS() {
        return 3;
    }

    numElements() {
        return this.mElements.length;
    }
    numRows() {
        return Matrix.NUM_ROWS;
    }
    numColumns() {
        return Matrix.NUM_COLUMNS;
    }

    getElement(pRow, pColumn) {
        var elementIndex = pRow * Matrix.NUM_COLUMNS + pColumn;
        return this.mElements[elementIndex];
    }
    setElement(pRow, pColumn, pValue) {
        var elementIndex = pRow * Matrix.NUM_COLUMNS + pColumn;
        this.mElements[elementIndex] = pValue;
    }

    copy() {
        return new Matrix(this.getElement(0, 0),
            this.getElement(0, 1),
            this.getElement(0, 2),
            this.getElement(1, 0),
            this.getElement(1, 1),
            this.getElement(1, 2),
            this.getElement(2, 0),
            this.getElement(2, 1),
            this.getElement(2, 2));
    }

    multiply(pMatrix) {
        var row0, row1, row2, column0, column1, column2, matrix;
        multiplyCount+= 1;
        row0 = new Vector(this.getElement(0, 0),
            this.getElement(0, 1),
            this.getElement(0, 2));
        row1 = new Vector(this.getElement(1, 0),
            this.getElement(1, 1),
            this.getElement(1, 2));
        row2 = new Vector(this.getElement(2, 0),
            this.getElement(2, 1),
            this.getElement(2, 2));

        column0 = new Vector(pMatrix.getElement(0, 0),
            pMatrix.getElement(1, 0),
            pMatrix.getElement(2, 0));
        column1 = new Vector(pMatrix.getElement(0, 1),
            pMatrix.getElement(1, 1),
            pMatrix.getElement(2, 1));
        column2 = new Vector(pMatrix.getElement(0, 2),
            pMatrix.getElement(1, 2),
            pMatrix.getElement(2, 2));

        matrix = Matrix.createIdentity();

        matrix.setElement(0, 0, row0.dotProduct(column0));
        matrix.setElement(0, 1, row0.dotProduct(column1));
        matrix.setElement(0, 2, row0.dotProduct(column2));

        matrix.setElement(1, 0, row1.dotProduct(column0));
        matrix.setElement(1, 1, row1.dotProduct(column1));
        matrix.setElement(1, 2, row1.dotProduct(column2));

        matrix.setElement(2, 0, row2.dotProduct(column0));
        matrix.setElement(2, 1, row2.dotProduct(column1));
        matrix.setElement(2, 2, row2.dotProduct(column2));
        return matrix;
    }
    transpose() {
        var matrix, row, column;
        matrix = Matrix.createIdentity();
        for(row = 0; row < this.numRows(); row +=1) {
            for(column = 0; column < this.numColumns(); column +=1) {
                matrix.setElement(row, column, this.getElement(column, row));
            }
        }
        return matrix;
    }
    calculateMinor(pRow, pColumn) {
        var firstRow, lastRow, firstColumn, lastColumn, topLeft, bottomRight, bottomLeft, topRight, minor;
        firstRow = 0;
        if (firstRow == pRow) {
            firstRow += 1;
        }
        lastRow = firstRow + 1;
        if (lastRow == pRow) {
            lastRow += 1;
        }
        firstColumn = 0;
        if (firstColumn == pColumn) {
            firstColumn += 1;
        }
        lastColumn = firstColumn + 1;
        if (lastColumn == pColumn) {
            lastColumn += 1;
        }
        topLeft = this.getElement(firstRow, firstColumn);
        bottomRight = this.getElement(lastRow, lastColumn);
        bottomLeft = this.getElement(lastRow, firstColumn);
        topRight = this.getElement(firstRow, lastColumn);
        minor = topLeft * bottomRight - bottomLeft * topRight;
        return minor;
    }
    matrixOfMinors() {
        var matrix, row, column;
        matrix = Matrix.createIdentity();
        for(row = 0; row < this.numRows(); row +=1) {
            for(column = 0; column < this.numColumns(); column +=1) {
                matrix.setElement(row, column, this.calculateMinor(row, column));
            }
        }
        return matrix;
    }
    cofactor() {
        var minorsMatrix;
        minorsMatrix = this.matrixOfMinors();
        minorsMatrix.setElement(0,1, -minorsMatrix.getElement(0,1));
        minorsMatrix.setElement(1,0, -minorsMatrix.getElement(1,0));
        minorsMatrix.setElement(0,2, -minorsMatrix.getElement(0,2));
        minorsMatrix.setElement(2,1, -minorsMatrix.getElement(2,1));
        return minorsMatrix;
    }
    adjunct() {
        var coFactorMatrix, transposeCoFactorMatrix;
        coFactorMatrix = this.cofactor();
        transposeCoFactorMatrix = coFactorMatrix.transpose();
        return transposeCoFactorMatrix;
    }
    determinant() {
        var minorsMatrix, termA, termB, termC, determinantValue;
        minorsMatrix = this.matrixOfMinors();
        termA = this.getElement(0,0) * minorsMatrix.getElement(0,0);
        termB = this.getElement(0,1) * minorsMatrix.getElement(0,1);
        termC = this.getElement(0,2) * minorsMatrix.getElement(0,2);
        determinantValue = termA - termB + termC;
        return determinantValue;
    }
    inverse() {
        var adjunctMatrix, inverseMatrix, determinantValue, oneOverDeterminant, row, column;
        determinantValue = this.determinant();
        if(determinantValue == 0) {
            alert("no inverse possible");
            return Matrix.createIdentity();
        }
        oneOverDeterminant = 1 / determinantValue;
        adjunctMatrix = this.adjunct();
        inverseMatrix = adjunctMatrix.copy();
        for(row = 0; row < this.numRows(); row +=1) {
            for(column = 0; column < this.numColumns(); column +=1) {
                inverseMatrix.setElement(row, column, adjunctMatrix.getElement(row, column) * oneOverDeterminant);
            }
        }
        return inverseMatrix;
    }
    multiplyVector(pVector) {
        var row0, row1, row2, vector;
        row0 = new Vector(this.getElement(0, 0),
            this.getElement(0, 1),
            this.getElement(0, 2));
        row1 = new Vector(this.getElement(1, 0),
            this.getElement(1, 1),
            this.getElement(1, 2));
        row2 = new Vector(this.getElement(2, 0),
            this.getElement(2, 1),
            this.getElement(2, 2));

        vector = new Vector(0, 0, 1);

        vector.setX(row0.dotProduct(pVector));
        vector.setY(row1.dotProduct(pVector));
        vector.setZ(row2.dotProduct(pVector));

        return vector;
    }
    setTransform(pContext) {
        pContext.setTransform(this.getElement(0, 0),
            this.getElement(1, 0),
            this.getElement(0, 1),
            this.getElement(1, 1),
            this.getElement(0, 2),
            this.getElement(1, 2));
    }
    transform(pContext) {
        pContext.transform(this.getElement(0, 0),
            this.getElement(1, 0),
            this.getElement(0, 1),
            this.getElement(1, 1),
            this.getElement(0, 2),
            this.getElement(1, 2));
    }
    alert() {
        alert(this.getElement(0, 0) + ' ' +
            this.getElement(0, 1) + ' ' +
            this.getElement(0, 2) + '\n' +
            this.getElement(1, 0) + ' ' +
            this.getElement(1, 1) + ' ' +
            this.getElement(1, 2) + '\n' +
            this.getElement(2, 0) + ' ' +
            this.getElement(2, 1) + ' ' +
            this.getElement(2, 2) + '\n');
    }
    log(pLabel) {
        console.log(pLabel + '(' + this.getElement(0, 0) + ' ' +
        this.getElement(0, 1) + ' ' +
        this.getElement(0, 2) + '\n' +
        this.getElement(1, 0) + ' ' +
        this.getElement(1, 1) + ' ' +
        this.getElement(1, 2) + '\n' +
        this.getElement(2, 0) + ' ' +
        this.getElement(2, 1) + ' ' +
        this.getElement(2, 2) + '\n' + ')');
    }
    thisIsDavidsMatrix() {
        return true;
    }
    static createIdentity() {
        var identityMatrix = new Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1);
        return identityMatrix;
    }
    static createTranslation(pTranslationVector) {
        var translateMatrix = Matrix.createIdentity();
        translateMatrix.setElement(0, 2, pTranslationVector.getX());
        translateMatrix.setElement(1, 2, pTranslationVector.getY());
        return translateMatrix;
    }
    static createScale(pScaleVector) {
        var scaleMatrix = Matrix.createIdentity();
        scaleMatrix.setElement(0, 0, pScaleVector.getX());
        scaleMatrix.setElement(1, 1, pScaleVector.getY());
        return scaleMatrix;
    }
    static createRotation(pRadians) {
        var rotationMatrix = Matrix.createIdentity();
        rotationMatrix.setElement(0, 0, Math.cos(pRadians));
        rotationMatrix.setElement(0, 1, -Math.sin(pRadians));
        rotationMatrix.setElement(1, 0, Math.sin(pRadians));
        rotationMatrix.setElement(1, 1, Math.cos(pRadians));
        return rotationMatrix;
    }
}
if (typeof exports !== 'undefined') {
    exports.Matrix = Matrix;
}
else {
    window.Matrix = Matrix;
}