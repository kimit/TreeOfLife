/*
 * Author: Kimitoshi Senno
 * Date: May 15, 2013
 * For: Tree Of Life application
 *      Application to commemorate dogs by showing their information
 * Revised: September 26, 2013:
 * 			Modified to code to load data from Json instead of XML
 */

var treeScale = 0.5;
var treeWidth = 0;
var treeHeight = 0;

var detailSheetWidth = 200;
var detailSheetHeight = 300;

var blinkingTime = 3000;



//var cv;
//var ctx;
var treeImg;
var leafImg;
var currentDSid = 0;

// Getting browser types
var nvName = navigator.appName;
var nvVer = navigator.appVersion;
var nvAgent = navigator.userAgent;
var ieV = -1;
if( nvName.indexOf("Internet Explorer") > -1 )
	{
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    	if (re.exec(nvAgent) != null)
    	{
      		ieV = parseFloat( RegExp.$1 );
      	}
}

var jsonDoc;
//var xmlDoc; // XML version

function init()
{
	loadJson();
	//loadXML();
	//cv = document.getElementById("canvas");
	//ctx = cv.getContext("2d");
}



function loadJson()
{
	 // load Json file
	 var xhttp;
    if (window.XMLHttpRequest) {
       xhttp = new XMLHttpRequest();
    } else {    // IE 5/6
       xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhttp.open("GET", "dogdata.json");
    xhttp.onreadystatechange = function()
    {
    	if( xhttp.readyState === 4 && 
    		xhttp.status === 200 )
    	{
    		jsonDoc = JSON.parse(xhttp.responseText);
    		//jsonDoc = jQuery.parseJSON(xhttp.responseText);
    		console.log("dog length is " + jsonDoc.dog.length);
    		
    		// Drawing Tree
    		treeImg = new Image();
    		treeImg.src = "img/tree_transparent_half.png";
    		treeImg.id = "tree"
    		treeImg.onload = drawTree;
    	}
    }
    
    xhttp.send();
}

function drawTree()
{
	treeWidth = treeImg.width;
	treeHeight = treeImg.height;
	//ctx.drawImage(treeImg, 0, 0, treeWidth, treeHeight, 0, 0);
	treeImg.style.position = "absolute";
	treeImg.style.top = "0px";
	treeImg.style.left = "0px";
	document.body.appendChild(treeImg);
	
	// Add leaves
	leafImg = new Image();
	leafImg.src = "img/leaf.png";
	leafImg.onload = drawLeaves;
	
	// Add Title
	drawTitle();
	
	// Add Search Box
	drawSearchBox();
}

function drawTitle()
{
	var titleDiv = document.createElement("div");
	var titleP = document.createElement("p");
	titleDiv.id = "titleDiv";
	titleP.id = "titleP";
	titleP.appendChild(document.createTextNode("Tree of Life"));
	titleDiv.appendChild(titleP);
	document.body.appendChild(titleDiv);
	titleDiv.style.position = "absolute";
	titleDiv.style.top = treeHeight - 50 + "px";
	titleDiv.style.width = treeWidth + "px";
}

function drawSearchBox()
{
	var searchDiv = document.createElement("div");
	var searchBox = document.createElement("input");
	var searchIcon = new Image();
	
	searchDiv.id = "searchDiv";
	searchBox.id = "searchBox";
	searchBox.type = "text";
	searchIcon.src = "img/search_icon.png";
	searchDiv.appendChild(searchBox);
	searchDiv.appendChild(searchIcon);
	document.body.appendChild(searchDiv);
	searchDiv.style.position = "absolute";
	searchIcon.onload = function(){
		searchDiv.style.left = (treeWidth - searchDiv.offsetWidth) + "px";
	}
	
	// Place holder for search box
	searchBox.placeholder = "Find your pal";
	searchBox.onfocus = function(){if(this.value == this.placeholder){this.value = ''};}
	searchBox.onblur = function(){if(this.value == ''){this.value = this.placeholder};}
	
	// Search function
	searchIcon.onclick =  function(){searchDog()};
	searchBox.onkeyup = function(e){if(e.keyCode == 13){searchDog()}};
	
}

function drawLeaves()
{
	//var dogs = xmlDoc.getElementsByTagName("dog");
	//console.log("jsonDoc is: " + jsonDoc);
	var dogs = jsonDoc.dog;
	var idInData = 0;
	var leaf;
	for (var i=0; i < dogs.length; i++){
		//idInData = xmlDoc.getElementsByTagName("dog")[i].getAttribute("id");
		idInData = dogs[i]._id;
		leaf = new Leaf(idInData);
	}
}

// Leaf Class
var Leaf = function(idInData){
	this.internalId = idInData;
	
	/* //XML version
	var thisDog = dogSpecificXML(this.internalId);
	var xmlTop = dataFromXML(thisDogData, "top");
	var xmlLeft = dataFromXML(thisDogData, "left");
	var xmlOrientation = dataFromXML(thisDogData, "orientation");
	var xmlFirstName = dataFromXML(thisDogData, "first_name");
	var xmlLastName = dataFromXML(thisDogData, "last_name");
	*/
	
	var thisDogData = dogSpecificJson(this.internalId);
	var xmlTop = thisDogData.top;
	var xmlLeft = thisDogData.left;
	var xmlOrientation = thisDogData.orientation;
	var xmlFirstName = thisDogData.first_name;
	var xmlLastName = thisDogData.last_name;
	
	var leafDiv = document.createElement("div");
	//leafDiv.internalId = this.internalId;
	leafDiv.id = "leaf"+this.internalId;
	leafDiv.style.width = leafImg.width + "px";
	leafDiv.style.height = leafImg.height + "px";
	leafDiv.style.position = "absolute";	
	leafDiv.style.top = xmlTop + "px";
	leafDiv.style.left = xmlLeft + "px";
	bindEvent(leafDiv, 'click', leafClick );
	document.body.appendChild(leafDiv);
	
	var leafImgE = new Image();
	leafImgE.src = "img/leaf.png";
	leafImgE.id = "leafImg";
	leafImgE.internalId = this.internalId;
	leafImgE.setAttribute("width", "100%");
	leafImgE.setAttribute("height", "100%");
	//Flipping leaf image for left oriented leaves
	if(xmlOrientation == "left")
	{
		leafImgE.style.cssText= "-webkit-transform: scale(-1, 1);\
								 -moz-transform: scale(-1, 1);\
								 -o-transform: scale(-1, 1);\
								 -ms-transform: scale(-1, 1);\
								 transform: scale(-1, 1);";
		leafDiv.style.left = parseInt(leafDiv.style.left) - parseInt(leafDiv.style.width) + "px";
	}
	leafDiv.appendChild(leafImgE);
	
	var dogName = document.createElement("p");
	var br = document.createElement("br");
	
	dogName.id = "dogName";
	dogName.internalId = this.internalId;
	leafDiv.appendChild(dogName);
	dogName.appendChild(document.createTextNode(xmlFirstName));
	dogName.appendChild(br);
	dogName.appendChild(document.createTextNode(xmlLastName));
	dogName.style.width = leafDiv.style.width;	
	console.log(leafDiv);
}

function leafClick(e)
{
	var detailSheet = document.getElementById("detailSheet");
	var targetIntlId = e.target.internalId;
	
	console.log("click target internalId: " + targetIntlId);
	
	// If detailSheet exists, remove it
	if(detailSheet !== null)
	{
		// Unless the same leaf is not clicked, remove detailSheet 
		if( currentDSId != targetIntlId )
		{
			detailSheet.parentNode.removeChild(detailSheet);
		}	
	}
	
	// Draw detailsheet
	if(! document.getElementById("detailSheet"))
	{
		var oDetailSheet = new DetailSheet(targetIntlId);
	}
	
	// Keep id in global variable to compare with id that is clicked next time
	currentDSId = targetIntlId;
}

// DetailSheet Class
var DetailSheet = function(internalId)
{
	this.internalId = internalId;
	this.detailSheet = document.createElement("div");
	this.detailSheet.id = "detailSheet";
	this.detailSheet.style.width = detailSheetWidth + "px";
	this.detailSheet.style.height = detailSheetHeight + "px";
		
	this.detailSheet.style.position = "absolute";
	this.detailSheet.style.left = (treeWidth - parseInt(this.detailSheet.style.width))/2 + "px";
	this.detailSheet.style.top = 200 + "px";
		
	var closeIcon = new Image();
	closeIcon.src = "img/icon_close.png";
	this.detailSheet.appendChild(closeIcon);
		
	closeIcon.onload = function()
	{
		closeIcon.style.position = "absolute";
		closeIcon.style.left = parseInt(detailSheet.style.width) - closeIcon.width/2 + "px";
		closeIcon.style.top = - closeIcon.height/2 + "px";
	}
	closeIcon.addEventListener('click', closeClick, false);
		
	document.body.appendChild(this.detailSheet);

	//dataContents(this.dogData);	
	dataContents(this.internalId);	
}

//function dataContents(dogData)
function dataContents(internalId)
{
	var detailSheet = document.getElementById("detailSheet");
	
	/* // XML Version
	var thisDogData = dogSpecificXML(internalId);
	var dogName = dataFromXML(thisDogData, "first_name");
	var owner = dataFromXML(thisDogData, "owner");
	var location = dataFromXML(thisDogData, "location");
	* */
	
	var thisDogData = dogSpecificJson(internalId);
	var dogName = thisDogData.first_name;
	var owner = thisDogData.owner;
	var location = thisDogData.location;
	
	var dogImg = new Image();
	dogImg.src = "img/dogs/" + thisDogData.picture;

    var nameText = document.createElement("p");
    nameText.id = "nameText";
	var ownerText = document.createElement("p");
	ownerText.id = "ownerText";
	var locationText = document.createElement("p");
	locationText.id = "locationText";

	dogImg.onload = function(){
		dogImg.style.top = parseInt(detailSheet.style.height) - dogImg.height + "px" ;
		dogImg.style.position = "absolute";
		detailSheet.appendChild(dogImg);
		
		detailSheet.appendChild(nameText);
		nameText.appendChild(document.createTextNode(dogName));
		detailSheet.appendChild(ownerText);
		ownerText.appendChild(document.createTextNode("lived with " + owner));
		detailSheet.appendChild(locationText);
		locationText.appendChild(document.createTextNode("in " + location));	
	}
}

function closeClick(e)
{
	var detailSheet = document.getElementById("detailSheet");
	detailSheet.parentNode.removeChild(detailSheet);
}

//******* Search related functions ******************
function searchDog(){
	var searchBox = document.getElementById("searchBox");
	var s = searchBox.value;
	//var dogs = xmlDoc.getElementsByTagName("dog");
	var dogs = jsonDoc.dog;
	var result = '';
	var firstNameToSearch;
	var lastNameToSearch
	var targetLeaf;
	var aTargetLeaf = [];

	if(s)
	{
		var filter = new RegExp("^" + s + "$", "i"); 
		for (var i=1; i <= dogs.length; i++)
		{	
			/* // XML Version
			var thisDogData = dogSpecificXML(i);
			firstNameToSearch = dataFromXML(thisDogData, "first_name");
			lastNameToSearch = dataFromXML(thisDogData, "last_name");
			*/
			
			var thisDogData = dogSpecificJson(i);
			
			firstNameToSearch = thisDogData.first_name;
			lastNameToSearch = thisDogData.last_name;
			
			if( firstNameToSearch.search(filter) != -1 ||
				lastNameToSearch.search(filter) != -1 )
			{
				//result = dogs[i].getAttribute("id");
				result = i;
				targetLeaf = document.getElementById("leaf"+result);
				
				// Blinking the leaf of the found dog
				var w = leafImg.width;
				var h = leafImg.height;
				blink(targetLeaf, parseInt(w), parseInt(h), 1.5);
				
				aTargetLeaf.push(targetLeaf);
				console.log(aTargetLeaf);				
			}
		}
		setTimeout(function(){stopBlinking(aTargetLeaf, w, h);}, blinkingTime);
	}
	// Show alert if no match is found
	if(result == '')
	{
		// Prevent alert on hitting enter key on alert
		// 1st condition for Chrome, 2nd for FF
		if( searchBox.value && 
			searchBox.value != searchBox.placeholder )
		{
			//alert("The name is not found. Please try again.");
			showCustomAlert("Not found", "The name was not found. Please try again.", 90, 100);
			searchBox.value = searchBox.placeholder;
		}
	}
}

function stopBlinking(aLeaves, w, h)
{
	for (var i=0; i < aLeaves.length; i++)
	{
		$(aLeaves[i]).stop();
		$(aLeaves[i]).children('img').attr('src', leafImg.getAttribute('src'));
		$(aLeaves[i]).css({opacity:1, width:w, height:h}); 
		console.log('target leaf: ' + aLeaves[i].id);
	}
}

function showCustomAlert(title, msg, h, w)
{
	var myAlert = document.createElement("div");
	var myTitle = "Alert";
	var myHeight = 200;
	var myWidth = 200;
	myAlert.id = "myAlert";
	var message = document.createElement("p");
	message.id = "message";
	message.appendChild(document.createTextNode(msg));
	myAlert.appendChild(message);
	document.body.appendChild(myAlert);
	myTitle = title;
	myHeight = h;
	myWidth = w;
	$(myAlert).dialog({
				height: myHeight,
				width: myWidth,
				title: myTitle,
				close:function(){$(this).remove();},
				resizable:false,
				position:{
					my: "center",
					at: "center",
					of: "#tree"
				}
				});
}

function blink(selector, originalWidth, originalHeight, scale)
{
		$(selector).children('img').attr('src', "img/leaf_found.png");
		//$(selector).children('p').css({fontSize:'150%'});
		
		/*
		$(selector).stop().animate({width: originalWidth*scale + "px", height: originalHeight*scale + "px"}, 'slow', function(){
			$(this).stop().animate({width: originalWidth + "px", height:originalHeight + "px"}, 'slow', function(){
				blink(this, originalWidth, originalHeight, scale);
			});
		});
		*/
		
		/*
		$(selector).children('p').stop().animate({fontSize: "200%"}, 'slow', function(){
			$(this).stop().animate({fontSize: "100%"}, 'fast');
		});
		*/
		
		$(selector).fadeOut('slow', function(){
		    	$(this).fadeIn('slow', function(){
		    		blink(this, originalWidth, originalHeight, scale);
		    	});
		});
		
}


//********** Utility functions *********************************
// Workaround for Firefox, getting Nodelist from xml by id attribute
function getDogDataViaXpath(internalId){
	var xPath = "//dog[@id='" + internalId + "']";
	var xPathResult = xmlDoc.evaluate( xPath, xmlDoc, null, 7, null );
	return xPathResult.snapshotItem(0);
}

function dogSpecificJson(internalId)
{
	var oThisDog;
	for (var t=0; t < jsonDoc.dog.length; t++){
		if (jsonDoc.dog[t]._id == internalId)
		{
			oThisDog = jsonDoc.dog[t];
		}
	} 
	
	return oThisDog
}


// Extracting Node list for a specific dog id
function dogSpecificXML(internalId)
{
	var xmlData;
	
	if( ieV > -1 ) // IE
	{
		if(ieV < 10) // Lower than IE10
  		{
			xmlData = xmlDoc.selectSingleNode("//dog[@id='" + internalId + "']");
		}
		else
		{
			xmlData = xmlDoc.getElementsByTagName("dog")[internalId-1];
			// xmlData = xmlDoc.getElementsByTagName('dog');
		}	
	}
	else if ( nvVer.indexOf("Safari") > -1 || nvVer.indexOf("Chrome") > -1 )
	{
		 xmlData = xmlDoc.getElementById(internalId);
	} 
	else if ( nvAgent.indexOf("Firefox") > -1)
	{
		xmlData = getDogDataViaXpath(internalId);
	}
	
	console.log(xmlData);
	
	return xmlData;
}

// Binding event (ie9 does not support addEventListener
function bindEvent(el, eventName, eventHandler) {
	  if (el.addEventListener){
	    el.addEventListener(eventName, eventHandler, false); 
	  } else if (el.attachEvent){
	    el.attachEvent('on'+eventName, eventHandler);
	  }
}

/**** Not in Use *********
// This function is not in use after Json replaces XML
function loadXML()
{
	 // load xml file
	 var xhttp;
    if (window.XMLHttpRequest) {
       xhttp = new XMLHttpRequest();
    } else {    // IE 5/6
       xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhttp.open("GET", "dogdata.xml", false);
    xhttp.send();
    xmlDoc = xhttp.responseXML;
}

// From given Nodelist, extracting specific datum
function dataFromXML(xmlData, dataName)
{
	var dataToReturn;
	dataName = dataName.toLowerCase();
	var dataInXML = ["first_name", 
					 "last_name", 
					 "owner", 
					 "location", 
					 "picture", 
					 "left", 
					 "top", 
					 "orientation"]

	// Setting data for each dog id
	if( ieV > -1 ) // IE
	{
		if(ieV < 10) // Lower than IE10
  		{
			//dataToReturn = xmlDoc.selectSingleNode("//dog[@id='"+this.internalId+"']/top").text;
			dataToReturn = xmlData.childNodes[dataInXML.indexOf(dataName)].text;
		}
		else
		{
			dataToReturn = xmlData.getElementsByTagName(dataName)[0].textContent;
		}
	}
	else 
	{
		 dataToReturn = xmlData.getElementsByTagName(dataName)[0].textContent;
	}
	
	return dataToReturn;
}

 */