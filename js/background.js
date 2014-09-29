/*
 TabSlider v0.3
 (c) 2014 Darjex.com (Sergey Khomushin), http://darjex.com
 License: MIT
*/
var TabSlider = new function() {
	
	var sliderTimeID = null;
	var refreshTimeID = null;
	var currentRequest = null;
	var autoActivated = false;
	
	this.init = function() {
		chrome.tabs.onActivated.addListener(function(tab) {
			if (currentRequest && !autoActivated) {
				TabSlider.start();
			}
			autoActivated = false;
		});
		
		chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
			sendResponse();
			
			switch(request.operator) {
				case 'start':
					currentRequest = request;
					TabSlider.start();
					break;
				case 'stop':
					TabSlider.clear();
					break;
				case 'mousemove':
					if (currentRequest) {
						TabSlider.start();
					}
					break;
			}
			
		});
		
	}
	
	this.start = function() {
		TabSlider.runSlider(currentRequest.sliderTime);
		TabSlider.reloadTab(currentRequest.refreshTime);
	}
	
	this.clear = function() {
		window.clearInterval(sliderTimeID);
		window.clearInterval(refreshTimeID);
		currentRequest = null;
		TabSlider.changeIconText("");
	}
	
	this.nextSlide = function() {
		chrome.tabs.query({"currentWindow": true}, function(tabs) {
			for (var i = 0; i < tabs.length; ++i) {
				if (tabs[i].active && tabs[i].selected) {
					var nextIndex = tabs[i].index + 1;
					if (nextIndex >= tabs.length) {
						nextIndex = 0;
					}
					chrome.tabs.update(tabs[nextIndex].id, {'selected': true});
				}
			}
		});
	}
	
	this.changeIconText = function(text) {
		chrome.browserAction.setBadgeText({'text': (text).toString()});
	}
	
	this.runSlider = function(time) {
		window.clearInterval(sliderTimeID);
		
		var counter = time;
		TabSlider.changeIconText(counter);
		
		sliderTimeID = window.setInterval(function() {
			--counter;
			if (counter < 1) {
				counter = time;
				autoActivated = true;
				TabSlider.nextSlide();
			}
			TabSlider.changeIconText(counter);
		}, 1000);
	}
	
	this.reloadTab = function(time) {
		window.clearInterval(refreshTimeID);
		
		refreshTimeID = window.setInterval(function() {
			chrome.tabs.query({"currentWindow": true}, function(tabs) {
				tabs.forEach(function(tab) {
					chrome.tabs.reload(tab.id);
				});
			});
		}, time*1000);
	}
}

TabSlider.init();