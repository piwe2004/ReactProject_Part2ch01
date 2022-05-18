class DrawingBoard {
    MODE = "NONE" // NONE BRUSH ERASER
    IsMouseDown = false; // true
    constructor() {
        this.assingElement();
        this.initContext();
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
    }

    initContext (){
        this.context = this.canvasEl.getContext('2d');
    }

    addEvent(){
        this.brushEl.addEventListener('click', this.onClickBrush.bind(this));
        this.canvasEl.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvasEl.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvasEl.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvasEl.addEventListener('mouseout', this.onMouseOut.bind(this));
        this.brushsliderEl.addEventListener('input', this.onChangeBrushSize.bind(this));
        this.colorPickerEl.addEventListener('input', this.onChangeColor.bind(this));
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
        this.context.strokeStyle = this.colorPickerEl.value;
        this.context.lineWidth = this.brushsliderEl.value;
        // this.context.lineTo(400,400);
        // this.context.stroke();
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
    }

    onMouseUp(){
        if(this.MODE === "NONE") return;
        this.IsMouseDown = false;

    }

    getMousePosition(e){
        const boundaries = this.canvasEl.getBoundingClientRect();
        return{
            x : e.clientX - boundaries.left,
            y : e.clientY - boundaries.top
        }
    }

    onClickBrush(e){
        const IsActive = e.currentTarget.classList.contains('active')
        this.MODE = IsActive ? "NONE" : "BRUSH";
        this.canvasEl.style.cursor = IsActive ? "default" : "crosshair";
        this.brushPanelEl.classList.toggle('hide');
        this.brushEl.classList.toggle('active');

    }
}

new DrawingBoard();