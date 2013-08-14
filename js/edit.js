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
	
	var treeArea = document.body;
	
	treeArea.ondragover = allowDrop;
	treeArea.ondragenter = allowDrop;
	treeArea.ondrop = drop;
		
	document.body.appendChild(editArea);
	
	loadEditLeaf();
	
	editInfo();
}


// Load Leaf for Edit
function loadEditLeaf(){
	var editLeaf = new Image();
	editLeaf.id = "editLeaf";
	editLeaf.src = "img/leaf.png";
	editLeaf.draggable = true;
	editLeaf.ondragstart = dragStart;
	editArea.appendChild(editLeaf);
	
	editLeafX = editLeaf.style.top;
	editLeafY = editLeaf.style.left;
}


// Drag and drop the leaf
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
	document.body.appendChild(droppedId);

	document.getElementById("editXPos").innerHTML = "dropped";
}

// Detect Leaf location

// Adding information to the leaf

// Outputting information
function editInfo()
{
	var xPos = document.createElement("p");
	var yPos = document.createElement("p");
	
	xPos.id = "editXPos";
	yPos.id = "editYPos";
	
	editArea.appendChild(xPos);
	editArea.appendChild(yPos);
	
	xPos.innerHTML = "x position: " + editLeafX;
	yPos.innerHTML = "y position: " + editLeafY;
}

// Write out the location and info to XML 