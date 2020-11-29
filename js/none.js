document.onkeydown = function() {
	var e = window.event || arguments[0];
	if (e.keyCode == 123) {
		alert('你知道的太多了！');
		return false;
	}
	if ((e.ctrlKey) && (e.shiftKey) && (e.keyCode == 73)) {
		alert('你知道的太多了！');
		return false;
	}
	if ((e.ctrlKey) && (e.keyCode == 85)) {
		alert('你知道的太多了！');
		return false;
	}
	if ((e.ctrlKey) && (e.keyCode == 83)) {
		alert('你知道的太多了！');
		return false;
	}
}
