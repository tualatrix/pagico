function UpdateSettings(FormType, ForceReload)
{
	xajax_SavePreferences(FormType, xajax.getFormValues('PreferenceForm'), ForceReload);
}

function ToggleTagExplore(Checked)
{
	if(Checked)
	{
		$('PreferenceForm').HiddenTags_Enabled.value = '1';
		Effect.BlindDown('Preference_TagExplore', {duration:0.2});
		
		setTimeout("new Effect.ScrollTo('Preference_HiddenTags_Help', {duration:1});", 200);
	}
	else
	{
		$('PreferenceForm').HiddenTags_Enabled.value = '';
		Effect.BlindUp('Preference_TagExplore', {duration:0.2});
	}
	UpdateSettings('DB');
}

function SetupProxy()
{
	window.open('/html/SetProxy.php', "Pagico", "width=250, height=240, toobar=no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no");	
}

function activateInboxSync() {
	$('preference_InboxSyncBtn').disabled = true;
	
	xajax_activateInboxSync();
	
}