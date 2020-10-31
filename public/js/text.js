class Text {
    constructor(pString, pFontSize, pFont) {
        this.setString(pString);
        this.setFontSize(pFontSize);
        this.setFont(pFont);
    }
    setString(pString) {
        this.mString = pString;
    };
    getString() {
        return this.mString;
    };
    setFontSize(pFontSize) {
        this.mFontSize = pFontSize;
    };
    getFontSize() {
        return this.mFontSize;
    };
    setFont(pFont) {
        this.mFont = pFont;
    };
    getFont() {
        return this.mFont;
    };
    getDimensions(pContext) {
        var previousFont, width, dimensions;
        previousFont = pContext.font;
        pContext.font = this.mFontSize + 'px ' + this.mFont;
        width = pContext.measureText(this.mString).width;
        dimensions = new Vector(width, this.mFontSize, 1);
        pContext.font = previousFont;
        return dimensions;
    };
    draw(pContext) {
        pContext.font = this.mFontSize + 'px ' + this.mFont;
        pContext.textAlign = 'center';
        pContext.textBaseline = 'middle';
        pContext.fillText(this.mString, 0, 0);
    };
}
if (typeof exports !== 'undefined') {
    exports.Text = Text;
}
else {
    window.Text = Text;
}