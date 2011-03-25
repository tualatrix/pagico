function showGeneralPopupMenu() {
	
	//alert(event.clientX + " / " + event.clientY);
	
	posX = event.clientX;
	posY = event.clientY;
	
	if(Browser == "Explorer")
	{
		var WindowWidth = document.documentElement.clientWidth;
		var WindowHeight = document.documentElement.clientHeight;
	}
	else
	{
		var WindowWidth = window.innerWidth;
		var WindowHeight = window.innerHeight;
	}
	
	if(posX > 0 && posY > 0) {
		//reposition the menu accordingly...
		
		if(posX + 95 > WindowWidth) posX = WindowWidth - 95;
		
		$('General_Popup_Menu').style.top = (posY - 13) + 'px';
		$('General_Popup_Menu').style.left = (posX - 70) + 'px';
	}
	
	//xajax_loadPopupSelection_Menu(textSelection);
	
	Effect.Appear('General_Popup_Menu', {duration:0.2});
	
	setTimeout("adjustPopupMenuPosition('General_Popup_Menu');", 300);
	
}