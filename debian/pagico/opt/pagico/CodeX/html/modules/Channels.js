var channelListView;

function Channels_getList(sortBy) {
	
	if(!sortBy) sortBy = "";
	
}

function channels_HoverItem(UID) {
	
	if(event.button == 1)	return;
	document.getElementById('Channel_'+UID+'_Control').style.display='block';
	document.getElementById('Channel_'+UID).style.zIndex = 50;
	
	
}

function channels_LeaveItem(UID) {
	
	document.getElementById('Channel_'+UID+'_Control').style.display='none';
	document.getElementById('Channel_'+UID).style.zIndex = 0;
	
}

function Channels_NewAction(actionType) {
	if($('Channels_DefaultActions').style.display != 'none') {
		$('Channels_DefaultActions').style.display = 'none';
		$('Channels_'+actionType).style.display = 'block';
		
	}
	else {
		$('Channels_DefaultActions').style.display = 'block';
		$('Channels_'+actionType).style.display = 'none';
	}
}

function Channels_JoinChannel(invitationCode) {
	
	toggleLoadingPanel();
	
	var form = $('Channels_Join');
	// cycle between calling form.disable() and form.enable()
	form['disable']();
	//form.disabled = !form.disabled;
	
	//$('Channels_Join').disabled = true;

	$('Channels_Join_InvitationCode').disabled = true;
	
	xajax_Channels_joinByInvitation(invitationCode);
	
	setTimeout("Channels_resetAction();", 1000);
	
}

function Channels_actionFinished(channelUID) {
	
	/*
	if($('Channels_Join').style.display != 'none') {
		var form = $('Channels_Join');
	}
	else if($('Channels_Add').style.display != 'none') {
		var form = $('Channels_Add');
	}
	
	//form.reset();
	//form.style.display = 'none';
	
	$('Channels_DefaultActions').style.display = 'block';
	*/
	
	syncQueue_Add(channelUID);
	
	setTimeout("Goto(7);", 200);
}

function Channels_resetAction() {
	
	if($('Channels_Join').style.display != 'none') {
		var form = $('Channels_Join');
	}
	else if($('Channels_Add').style.display != 'none') {
		var form = $('Channels_Add');
	}
	
	if(form) {
		form['enable']();
	}
	
	toggleLoadingPanel(1);
	//dismiss any loading panels.
	
}

function Channel_ToggleEdit(saveOrNot) {
	
	if($('ChannelItem_Display').style.display != 'none') {
		$('ChannelItem_Display').style.display = 'none';
		Effect.BlindDown('ChannelItem_Edit', {duration:0.1});
		//$('ChannelItem_Edit').style.display = 'block';
	}
	else {
		//closing
		
		if(saveOrNot == 1) {
			
			xajax_Channels_SaveChannelSettings(xajax.getFormValues('Channels_Settings'));
			//submit the changes
			
		}
		
		Effect.BlindUp('ChannelItem_Edit', {duration:0.1});
		//$('ChannelItem_Edit').style.display = 'none';
		setTimeout("$('ChannelItem_Display').style.display = 'block';", 100);
	}
	
}


function Channel_leaveChannel(channelUID) {
	
	var confirmPrompt = DeleteConfirmText + "\n" + permanentAction;
	if(confirm(confirmPrompt)) {
		
		toggleLoadingPanel();
		xajax_Channels_LeaveChannel(channelUID);
		
	}
	
}