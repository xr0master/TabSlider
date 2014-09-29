/*
 TabSlider v0.3
 (c) 2014 Darjex.com (Sergey Khomushin), http://darjex.com
 License: MIT
*/
var Popup = new function() {
	
	var sliderTimeElement = null;
	var refreshTimeElement = null;
	
	this.init = function(_sliderTime, _refreshTime) {
		sliderTimeElement = _sliderTime;
		refreshTimeElement = _refreshTime;
		
		Popup.restoreValues();
	}
	
	this.saveValues = function() {
		localStorage.setItem("TabSlider_sliderTime", sliderTimeElement.value);
		localStorage.setItem("TabSlider_refreshTime", refreshTimeElement.value);
	}
	
	this.restoreValues = function() {
		sliderTimeElement.value = localStorage.getItem("TabSlider_sliderTime") || 19;
		refreshTimeElement.value = localStorage.getItem("TabSlider_refreshTime") || 300;
	}
	
	this.start = function() {
		Popup.saveValues();
		Popup.sendMessage({'operator': 'start', 'sliderTime': sliderTimeElement.value, 'refreshTime': refreshTimeElement.value});
	}
	
	this.stop = function() {
		Popup.sendMessage({'operator':'stop'});
	}
	
	this.sendMessage = function(message) {
		chrome.extension.sendMessage(message, function(response) {
			window.close();
		});
	}
}

window.onload = function() {
	Popup.init(document.getElementById("slide_time"), document.getElementById("refresh_time"));
	
	document.getElementById("start").addEventListener("click", function(event) {
		Popup.start();
	});
	
	
	document.getElementById("stop").addEventListener("click", function(event) {
		Popup.stop();
	});
}