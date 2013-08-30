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

var flipLeaf;
var leafWidth = 0;
 
// Edit Area
function initEdit()
{
	var editArea = document.createElement("div");
	editArea.id = "editArea";
	editArea.style.width = Edit_Area_Width + "px";
	editArea.style.height = "400px";
	editArea.style.position = "absolute";
	editArea.style.top = 0;
	editArea.style.left = treeArea + "px";
	
	var editTitle = document.createElement("h3");
	editTitle.innerHTML = "Add Dog Information";
	editArea.appendChild(editTitle);
/*	treeArea.ondragover = allowDrop;
	treeArea.ondragenter = allowDrop;
	treeArea.ondrop = drop;
*/
		
	document.body.appendChild(editArea);
	
	loadEditLeaf();
	
	editInfo();
	
	actualPosField = document.getElementById("editJson");
	jsonPosField = document.getElementById("jsonPos");
	
	initDragDrop();
	
	flipLeaf = document.getElementById("flipLeaf");
}


// Load Leaf for Edit
function loadEditLeaf(){
	var editLeaf = new Image();
	editLeaf.id = "editLeaf";
	editLeaf.src = "img/leaf_found.png";
	editLeaf.setAttribute("class", "drag");
	editLeaf.draggable = true;
	//editLeaf.ondragstart = dragStart;
	editArea.appendChild(editLeaf);
	
	editLeafX = editLeaf.style.top;
	editLeafY = editLeaf.style.left;
	
	editLeaf.onload = function(){leafWidth = editLeaf.width};
	
	
	// Checkbox to flip the leaf
	var flipLeaf = document.createElement("input");
	flipLeaf.type = "checkbox";
	flipLeaf.id = "flipLeaf";
	var flipLeafLabel = document.createElement("label");
	flipLeafLabel.innerHTML ="Flip the leaf vertically"; 
	flipLeafLabel.setAttribute("for", flipLeaf.id);
	editArea.appendChild(flipLeaf);
	editArea.appendChild(flipLeafLabel);
	
	flipLeaf.onchange = function(){
		var leafImg = document.getElementById("editLeaf");
		
		if(flipLeaf.checked === true)
		{
			leafImg.style.cssText= "-webkit-transform: scale(-1, 1);\
									 -moz-transform: scale(-1, 1);\
									 -o-transform: scale(-1, 1);\
									 -ms-transform: scale(-1, 1);\
									 transform: scale(-1, 1);";
			//leafDiv.style.left = parseInt(leafDiv.style.left) - parseInt(leafDiv.style.width) + "px";
		}
		else
		{
			leafImg.style.cssText= "-webkit-transform: scale(1, 1);\
									 -moz-transform: scale(1, 1);\
									 -o-transform: scale(1, 1);\
									 -ms-transform: scale(1, 1);\
									 transform: scale(1, 1);";
		}
	}
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
    
    actualPosField.innerHTML = target.className == 'drag' 
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
    
    if(flipLeaf.checked === true)
    {
    	xForJson += leafWidth;
    }
    
    
    yForJson = _offsetY + e.clientY - _startY;
    
    actualPosField.innerHTML = "Actual Position: " + _dragElement.style.left + ', ' + 
        _dragElement.style.top;   
        
    jsonPosField.value = xForJson + ',' + yForJson;
    
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
        
        actualPosField.innerHTML = 'mouse up';
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
	var lJsonPos = document.createElement("label");
	var lFirstName = document.createElement("label");
	var lLastName = document.createElement("label");
	var lOwner = document.createElement("label");
	var lLocation = document.createElement("label");
	
	lJsonPos.innerHTML = "Position on Tree:";
	lFirstName.innerHTML = "First Name:";
	lLastName.innerHTML = "Last Name:";
	lOwner.innerHTML = "Owner:";
	lLocation.innerHTML = "Location:";
	
	var jsonPos = document.createElement("input");
	var fFirstName = document.createElement("input");
	var fLastName = document.createElement("input");
	var fOwner = document.createElement("input");
	var fLocation = document.createElement("input");
	var bWrite = document.createElement("input");
	var fJson = document.createElement("p");
	
	jsonPos.id = "jsonPos";
	fFirstName.id = "editFirstName";
	fLastName.id = "editLastName";
	fOwner.id = "editOwner";
	fLocation.id = "editLocation";
	bWrite.id = "editWrite";
	fJson.id = "editJson";
	
	jsonPos.type = "text";
	fFirstName.type = "text";
	fLastName.type = "text";
	fOwner.type = "text";
	fLocation.type = "text";
	bWrite.type = "submit";
	
	lJsonPos.setAttribute("for", jsonPos.id);
	lFirstName.setAttribute("for", fFirstName.id);
	lLastName.setAttribute("for", fLastName.id);
	lOwner.setAttribute("for", fOwner.id);
	lLocation.setAttribute("for", fLocation.id);
	
	var jsonDiv = document.createElement("div");
	var fNameDiv = document.createElement("div");
	var lNameDiv = document.createElement("div");
	var ownerDiv = document.createElement("div");
	var locationDiv = document.createElement("div");
	
	jsonDiv.appendChild(lJsonPos);
	jsonDiv.appendChild(jsonPos);
	infoForm.appendChild(jsonDiv);
	fNameDiv.appendChild(lFirstName);
	fNameDiv.appendChild(fFirstName);
	infoForm.appendChild(fNameDiv);
	lNameDiv.appendChild(lLastName);
	lNameDiv.appendChild(fLastName);
	infoForm.appendChild(lNameDiv);
	ownerDiv.appendChild(lOwner);
	ownerDiv.appendChild(fOwner);
	infoForm.appendChild(ownerDiv);
	locationDiv.appendChild(lLocation);
	locationDiv.appendChild(fLocation);
	infoForm.appendChild(locationDiv);
	infoForm.appendChild(bWrite);
	editArea.appendChild(infoForm);
	
	editArea.appendChild(fJson);

	jsonPos.value = "Drag the leaf above";
	bWrite.value = "Write JSON";
	
	bWrite.onmouseup = writeJSON;
}

// Write out the location and info to XML

function writeJSON()
{
	var leafPos = $("#jsonPos").val();
	var leafX = leafPos.split(',')[0];
	var leafY = leafPos.split(',')[1];
	var sOrientation = "right";
	
	if(flipLeaf.checked === true){
		sOrientation = "left";
	}
	
	var jsonWrite = '{' +
        '"_id": "1",' + 
        '"first_name": "' + $("#editFirstName").val() + '",' +
        '"last_name": "' + $("#editLastName").val() + '",' +
        '"owner": "' + $("#editOwner").val() + '",' +
        '"location": "' + $("#editLocation").val() + '",' +
        '"picture": "boxer1.jpg",' +
        '"left": "' + leafX + '",' +
        '"top": "' + leafY + '",' +
        '"orientation": "' + sOrientation +'"' +
      '}';
	
	actualPosField.innerHTML = "Copy JSON from the Alert dialog.";
	
	alert(jsonWrite);
	
} 