/*
 TabSlider v0.3
 (c) 2014 Darjex.com (Sergey Khomushin), http://darjex.com
 License: MIT
*/
document.onmousemove = function(event) {
	if (Math.abs(event.webkitMovementX) > 5 || Math.abs(event.webkitMovementY) > 5) {
		chrome.extension.sendMessage({'operator': 'mousemove'});
	}
}