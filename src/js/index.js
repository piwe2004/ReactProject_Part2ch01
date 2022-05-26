class DrawingBoard {
    MODE = "NONE" // NONE BRUSH ERASER
    IsMouseDown = false; // true
    eraserColor = "#FFFFFF";
    backgroundColor = "#FFFFFF";
    IsNavigatorVisible = false;
    undoArray = [];
    containerEl;
    canvasEl;
    toolbarEl;
    brushEl;
    colorPickerEl;
    brushPanelEl;
    brushsliderEl;
    brushSizePreviewEl;
    eraserEl;
    navigatorEl;
    navigatorImage;
    canvasImage;
    undoEl;
    clearEl;
    downloadLink;
    constructor() {
        this.assingElement();
        this.initContext();
        this.initCanvasBackgroundColor();
        this.addEvent();
    }

    assingElement(){
        this.containerEl = document.getElementById('container');
        this.canvasEl = this.containerEl.querySelector('#canvas');
        this.toolbarEl = this.containerEl.querySelector('#toolbar');
        this.brushEl = this.toolbarEl.querySelector('#brush');
        this.colorPickerEl = this.toolbarEl.querySelector('#colorPicker');
        this.brushPanelEl = this.containerEl.querySelector('#brushPanel');
        this.brushsliderEl = this.brushPanelEl.querySelector('#brushSize');
        this.brushSizePreviewEl = this.brushPanelEl.querySelector('#brushSizePreview');
        this.eraserEl = this.toolbarEl.querySelector('#eraser');
        this.navigatorEl = this.toolbarEl.querySelector('#navigator');
        this.navigatorImage = this.containerEl.querySelector('#imgNav');
        this.canvasImage = this.navigatorImage.querySelector('#canvasImg');
        this.undoEl = this.toolbarEl.querySelector('#undo');
        this.clearEl = this.toolbarEl.querySelector('#clear');
        this.downloadLink = this.toolbarEl.querySelector('#download');
    }

    initContext (){
        this.context = this.canvasEl.getContext('2d');
    }

    initCanvasBackgroundColor(){
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0,0, this.canvasEl.width, this.canvasEl.height);
    }

    addEvent(){
        this.brushEl.addEventListener('click', this.onClickBrush.bind(this));
        this.canvasEl.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvasEl.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvasEl.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvasEl.addEventListener('mouseout', this.onMouseOut.bind(this));
        this.brushsliderEl.addEventListener('input', this.onChangeBrushSize.bind(this));
        this.colorPickerEl.addEventListener('input', this.onChangeColor.bind(this));
        this.eraserEl.addEventListener('click', this.onClickEraser.bind(this));
        this.navigatorEl.addEventListener('click', this.onClickNavigator.bind(this));
        this.undoEl.addEventListener('click', this.onClickUndo.bind(this));
        this.clearEl.addEventListener('click', this.onClickClear.bind(this));
        this.downloadLink.addEventListener('click', this.onClickDownload.bind(this));
    }

    onClickDownload(){
        this.downloadLink.href = this.canvasEl.toDataURL('image/jpeg', 1);
        this.downloadLink.download = 'exmaple.jpeg';
    }

    onClickClear(){
        this.saveState();
        this.context.clearRect(0,0, this.canvasEl.width, this.canvasEl.height);
        this.updateNavigator();
        this.initCanvasBackgroundColor();
    }

    onClickUndo (){
        if(this.undoArray.length === 0){
            alert('더이상 실행취소 불가능합니다.')
            return;
        }
        let previousDataUrl = this.undoArray.pop();
        let previousImage = new Image();
        previousImage.onload = () => {
            this.context.clearRect(0,0, this.canvasEl.width, this.canvasEl.height);
            this.context.drawImage(
                previousImage,
                0, 0, this.canvasEl.width, this.canvasEl.height,
                0, 0, this.canvasEl.width, this.canvasEl.height
            );
        }
        previousImage.src = previousDataUrl;
    }

    saveState(){
        if(this.undoArray.length > 4){
            this.undoArray.shift();
        }
        this.undoArray.push(this.canvasEl.toDataURL());
        console.log(this.undoArray);
    }

    onClickNavigator(e){
        this.IsNavigatorVisible = !e.currentTarget.classList.contains('active');
        e.currentTarget.classList.toggle('active');
        this.navigatorImage.classList.toggle('hide');
        this.updateNavigator();
    }

    updateNavigator(){
        if(!this.IsNavigatorVisible) return;
        this.canvasImage.src = this.canvasEl.toDataURL();
    }

    onClickEraser(e){
        const IsActive = e.currentTarget.classList.contains('active');
        this.MODE = IsActive ? "NONE" : "ERASER";
        this.canvasEl.style.cursor = IsActive ? "default" : "crosshair";
        if(this.MODE === 'NONE'){
            this.brushPanelEl.classList.add('hide');
        }
        //this.brushPanelEl.classList.toggle('hide');
        e.currentTarget.classList.toggle('active');
        this.brushEl.classList.remove('active');

    }

    onChangeColor(e){
        this.brushSizePreviewEl.style.backgroundColor = e.target.value;
    }

    onChangeBrushSize(e){
        this.brushSizePreviewEl.style.width = `${e.target.value}px`;
        this.brushSizePreviewEl.style.height =`${e.target.value}px`;
    }

    onMouseDown(e){
        if(this.MODE === "NONE") return;
        this.IsMouseDown = true;
        const currentPosition = this.getMousePosition(e);
        this.context.beginPath();
        this.context.moveTo(currentPosition.x, currentPosition.y);
        this.context.lineCap = 'round';
        if(this.MODE === "BRUSH"){
            this.context.strokeStyle = this.colorPickerEl.value;
        }else if(this.MODE === "ERASER"){
            this.context.strokeStyle = this.eraserColor;
        }
        this.context.lineWidth = this.brushsliderEl.value;
        this.saveState();
    }

    onMouseMove(e){
        if (!this.IsMouseDown) return;
        const currentPosition = this.getMousePosition(e);
        this.context.lineTo(currentPosition.x, currentPosition.y);
        this.context.stroke();
    }

    onMouseOut(){
        if(this.MODE === "NONE") return;
        this.IsMouseDown = false;
        this.updateNavigator();
    }

    onMouseUp(){
        if(this.MODE === "NONE") return;
        this.IsMouseDown = false;
        this.updateNavigator();
    }

    getMousePosition(e){
        const boundaries = this.canvasEl.getBoundingClientRect();
        return{
            x : e.clientX - boundaries.left,
            y : e.clientY - boundaries.top
        }
    }

    onClickBrush(e){
        const IsActive = e.currentTarget.classList.contains('active');
        this.MODE = IsActive ? "NONE" : "BRUSH";
        this.canvasEl.style.cursor = IsActive ? "default" : "crosshair";
        // this.brushPanelEl.classList.toggle('hide');
        if(this.MODE === 'NONE'){
            this.brushPanelEl.classList.add('hide');
        }
        e.currentTarget.classList.toggle('active');
        this.eraserEl.classList.remove('active');
    }
}

new DrawingBoard();