function populateFrame(elements){
	var fighter1 = document.getElementById("battleFighter1");
	var fighter2 = document.getElementById("battleFighter2");			
	var el1 = document.createElement("img");
	var el2 = document.createElement("img");
	el1 = elements[0];
	el2 = elements[1];	
	el1.id = "choice1";
	el2.id = "choice2";
	el1.width = 73;		
	el1.height = 73;	
	el2.width = 73;		
	el2.height = 73;				
	fighter1.appendChild(el1);
	fighter2.appendChild(el2);
}		
function fight(){
	var selectFrame = document.getElementById("battleSelect");
	var viewFrame = document.getElementById("battleFight");
	var userFighters = YAHOO.util.Dom.getElementsByClassName('selected', 'img');
	selectFrame.style.display="none";			
	viewFrame.style.display="block";			
	populateFrame(userFighters);
}

var Dom = YAHOO.util.Dom,
	Button = YAHOO.widget.Button,
	Event = YAHOO.util.Event;
	

var onImgClick = function (event, matchedEl, container) {
	var elements = YAHOO.util.Dom.getElementsByClassName('selected', 'img');	
	if (Dom.hasClass(matchedEl, "selected") || elements.length >=2) {
		Dom.removeClass(matchedEl, "selected");		
	}
	else {
		Dom.addClass(matchedEl, "selected");
	}
	elements = YAHOO.util.Dom.getElementsByClassName('selected', 'img');
	if(elements.length == 2)
		document.getElementById("battleBt").removeAttribute("disabled");
	else
		document.getElementById("battleBt").disabled="true";	
};		

Event.delegate("battleContacts", "click", onImgClick, "img");	

function openBattleView(voted,other){
	var viewFrame = document.getElementById("battleFight");
	var battleView = document.getElementById("battleView");
	var fighterImage = document.getElementById("fighterImage");
	var chartImage = document.getElementById("chart");	
	var uri = "http://chart.apis.google.com/chart?chxr=0,0,100&chxt=y&chs=160x220&cht=bvg&chco=4D89F9,C6D9FD&chd=t:0|100&chdl="+other.getAttribute("screenName")+"|"+voted.getAttribute("screenName");
	chartImage.src=uri;
	viewFrame.style.display = "none";
	battleView.style.display = "block";	
        voted.setAttribute("onClick", "location.href='http://www.twitter.com/"+ voted.getAttribute("screenName") + "'");
	fighterImage.appendChild(voted);
}

function fnCallbackF1() { 
	var el1 = document.getElementById("choice1");
	var el2 = document.getElementById("choice2");	 
	openBattleView(el1,el2);
}
function fnCallbackF2() { 
	var el2 = document.getElementById("choice2");
	var el1 = document.getElementById("choice1");	
	openBattleView(el2,el1);
}
