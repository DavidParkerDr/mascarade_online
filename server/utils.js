class Utils {
    static randomColour() {
        var red = Math.floor((Math.random() * 255) + 0);
        
        var redHex = red.toString(16);
        if(red < 16) {
            redHex = '0' + redHex;
        }
        var green = Math.floor((Math.random() * 255) + 0);
        var greenHex = green.toString(16);
        if(green < 16) {
            greenHex = '0' + greenHex;
        }
        var blue = Math.floor((Math.random() * 255) + 0);
        var blueHex = blue.toString(16);
        if(blue < 16) {
            blueHex = '0' + blueHex;
        }
        var colourHex = '#' + redHex + greenHex + blueHex;
        return colourHex;
    }
}
if (typeof exports !== 'undefined') {
    exports.Utils = Utils;
}
else {
    window.Utils = Utils;
}