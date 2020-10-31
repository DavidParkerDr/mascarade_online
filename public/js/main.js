function onLoad() {
    var mainCanvas, mainContext, game;
    function initialiseCanvasContext() {
        if (document.getElementById) {
            mainCanvas = document.getElementById('mainCanvas');
            if (!mainCanvas) {
                alert('Unable to get mainCanvas');
                return;
            }
        } else {
            alert('No getElementById function');
            return;
        }
        if (mainCanvas.getContext) {
            mainContext = mainCanvas.getContext('2d');
            if (!mainContext) {
                alert('Unable to get mainContext');
                return;
            }
        } else {
            alert('No getContext function');
            return;
        }
        mainCanvas.width = window.innerWidth;
        mainCanvas.height = window.innerHeight;
        game = new Game(mainCanvas, mainContext);
    }

    
    initialiseCanvasContext();
    
}

window.addEventListener('load', onLoad, false);