function restoreTrashed(UID) {
	Effect.Fade('dataView_Item_'+UID, {duration:0.3});
	
	xajax_restoreTrashed(UID);

	setTimeout("$('dataView_Item_"+UID+"').remove();", 300);
	setTimeout("dataView_ResetMenus();", 500);
}