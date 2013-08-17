/*
  * Author: Kimitoshi Senno
  * Creation Date: August 12, 2013
  * Modification Date: 
  * Purpose: Javascript file for the edit function for TreeOfLife web application
  */
 
// Constants
var Edit_Area_Width = 250; 

// Global variables
var editLeafX;
var editLeafY;
var treeArea = 750;

var _startX = 0;            // mouse starting positions
var _startY = 0;
var _offsetX = 0;           // current element offset
var _offsetY = 0;
var _dragElement;           // needs to be passed from OnMouseDown to OnMouseMove
var _oldZIndex = 0;         // we temporarily increase the z-index during drag
var actualPosField;   			// makes life easier
var jsonPosField;
var xForJson = 0;
var yForJson = 0;
 
// Edit Area
function initEdit()
{
	var editArea = document.createElement("div");
	editArea.id = "editArea";
	editArea.style.width = Edit_Area_Width + "px";
	editArea.style.height = "400px";
	editArea.style.position = "absolute";
	editArea.style.top = 0;
	editArea.style.left = 750 + "px";
	

/*	treeArea.ondragover = allowDrop;
	treeArea.ondragenter = allowDrop;
	treeArea.ondrop = drop;
*/
		
	document.body.appendChild(editArea);
	
	loadEditLeaf();
	
	editInfo();
	
	actualPosField = document.getElementById("actualPos");
	jsonPosField = document.getElementById("jsonPos");
	
	initDragDrop();
}


// Load Leaf for Edit
function loadEditLeaf(){
	var editLeaf = new Image();
	editLeaf.id = "editLeaf";
	editLeaf.src = "img/leaf.png";
	editLeaf.setAttribute("class", "drag");
	editLeaf.draggable = true;
	//editLeaf.ondragstart = dragStart;
	editArea.appendChild(editLeaf);
	
	editLeafX = editLeaf.style.top;
	editLeafY = editLeaf.style.left;
}


// Drag and drop the leaf

/*
function dragStart(evt)
{
	evt.dataTransfer.setData("Text", evt.target.id);
}

function allowDrop(evt)
{
	evt.preventDefault();
}

function drop(evt)
{
	evt.preventDefault();
	var droppedId = document.getElementById(evt.dataTransfer.getData("Text"));
	
	droppedId.style.top = "100px";
	droppedId.style.left = "200px";
	this.appendChild(droppedId);

	document.getElementById("actualPos").innerHTML = "dropped";
}
*/

// Codes were taken from 
// http://luke.breuer.com/tutorial/javascript-drag-and-drop-tutorial.aspx
function initDragDrop()
{
	document.onmousedown = myOnMouseDown;
	document.onmouseup = myOnMouseUp;
}

function myOnMouseDown(e)
{
	 // IE is retarded and doesn't pass the event object
    if (e == null) 
        e = window.event; 
    
    // IE uses srcElement, others use target
    var target = e.target != null ? e.target : e.srcElement;
    
    actualPosField.value = target.className == 'drag' 
        ? 'draggable element clicked' 
        : 'NON-draggable element clicked';
	
    // for IE, left click == 1
    // for Firefox, left click == 0
    if ((e.button == 1 && window.event != null || 
        e.button == 0) && 
        target.className == 'drag')
    {
        // grab the mouse position
        _startX = e.clientX;
        _startY = e.clientY;
        
        // grab the clicked element's position
        _offsetX = ExtractNumber(target.style.left);
        _offsetY = ExtractNumber(target.style.top);
        
        // bring the clicked element to the front while it is being dragged
        _oldZIndex = target.style.zIndex;
        target.style.zIndex = 10000;
        
        // we need to access the element in OnMouseMove
        _dragElement = target;

        // tell our code to start moving the element with the mouse
        document.onmousemove = myOnMouseMove;
        
        // cancel out any text selections
        document.body.focus();

        // prevent text selection in IE
        document.onselectstart = function () { return false; };
        // prevent IE from trying to drag an image
        target.ondragstart = function() { return false; };
        
        // prevent text selection (except IE)
        return false;
    }
}

function myOnMouseMove(e)
{
    if (e == null) 
        var e = window.event; 

    // this is the actual "drag code"
    _dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
    _dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';
    
    xForJson = _offsetX + e.clientX - _startX + treeArea;
    yForJson = _offsetY + e.clientY - _startY;
    
    actualPosField.value = _dragElement.style.left + ', ' + 
        _dragElement.style.top;   
        
    jsonPosField.value = xForJson + ', ' + yForJson;
    
}

function myOnMouseUp(e)
{
    if (_dragElement != null)
    {
        //_dragElement.style.zIndex = _oldZIndex;

        // we're done with these events until the next OnMouseDown
        document.onmousemove = null;
        document.onselectstart = null;
        _dragElement.ondragstart = null;

        // this is how we know we're not dragging      
        _dragElement = null;
        
        actualPosField.value = 'mouse up';
    }
}

function ExtractNumber(value)
{
    var n = parseInt(value);
	
    return n == null || isNaN(n) ? 0 : n;
}

// Outputting information
function editInfo()
{
	var infoForm = document.createElement("form");
	var lActualPos = document.createElement("label");
	var lJsonPos = document.createElement("label");
	var lFirstName = document.createElement("label");
	var lLastName = document.createElement("label");
	var lOwner = document.createElement("label");
	var lLocation = document.createElement("label");
	
	lActualPos.innerHTML = "Actual Position:";
	lJsonPos.innerHTML = "Postion in Tree:";
	lFirstName.innerHTML = "First_Name:";
	lLastName.innerHTML = "Last_Name:";
	lOwner.innerHTML = "Owner:";
	lLocation.innerHTML = "Location:";
	
	var actualPos = document.createElement("input");
	var jsonPos = document.createElement("input");
	var fFirstName = document.createElement("input");
	var fLastName = document.createElement("input");
	var fOwner = document.createElement("input");
	var fLocation = document.createElement("input");
	var bWrite = document.createElement("input");
	var fJson = document.createElement("input");
	
	actualPos.id = "actualPos";
	jsonPos.id = "jsonPos";
	fFirstName.id = "editFirstName";
	fLastName.id = "editLastName";
	fOwner.id = "editOwner";
	fLocation.id = "editLocation";
	bWrite.id = "editWrite";
	fJson.id = "editJson";
	
	actualPos.type = "text";
	jsonPos.type = "text";
	fFirstName.type = "text";
	fLastName.type = "text";
	fOwner.type = "text";
	fLocation.type = "text";
	bWrite.type = "submit";
	fJson.type = "textarea";
	
	lActualPos.setAttribute("for", actualPos.id);
	lJsonPos.setAttribute("for", jsonPos.id);
	lFirstName.setAttribute("for", fFirstName.id);
	lLastName.setAttribute("for", fLastName.id);
	lOwner.setAttribute("for", fOwner.id);
	lLocation.setAttribute("for", fLocation.id);
	
	infoForm.appendChild(lActualPos);
	infoForm.appendChild(actualPos);
	infoForm.appendChild(lJsonPos);
	infoForm.appendChild(jsonPos);
	infoForm.appendChild(lFirstName);
	infoForm.appendChild(fFirstName);
	infoForm.appendChild(lLastName);
	infoForm.appendChild(fLastName);
	infoForm.appendChild(lOwner);
	infoForm.appendChild(fOwner);
	infoForm.appendChild(lLocation);
	infoForm.appendChild(fLocation);
	infoForm.appendChild(bWrite);
	editArea.appendChild(infoForm);
	
	editArea.appendChild(fJson);

	actualPos.value = "Drag the leaf above";
	jsonPos.value = "Drag the leaf above";
	bWrite.value = "Write JSON";
	
	bWrite.onclick = writeJSON;

}

// Write out the location and info to XML

function writeJSON()
{
	var fWrite = document.getElementById("editJson");
	
	// Need AJAX capability!
	fWrite.value = "hahah";
	
} 