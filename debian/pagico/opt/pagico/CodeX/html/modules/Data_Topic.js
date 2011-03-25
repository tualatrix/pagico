var SaveInterval;
var ActivateCode;

function ShowProgressBar(ID, Switch)
{
//deprecated function
}

function HideProgressBar(ID)
{
	if(document.getElementById(ID+"_Progress"))
		document.getElementById(ID+"_Progress").style.display='none';
}

function HideProgress()
{
	document.getElementById('Page_Progress').style.display='none';
	document.getElementById('Bottom_Progress').style.display='none';
}

function Indicate(Text)
{
	//if(IndicateTimer)	clearTimeout(IndicateTimer);
	document.getElementById('x_Indicator').innerHTML=Text;
	
	if(document.getElementById('x_Indicator').style.display=='none')
	{
		Effect.Appear('x_Indicator', {duration:0.5});
	}
	IndicateTimer=setTimeout("Effect.Fade('x_Indicator', {duration:0.6});", 3000);
}


function DisplayContent(ID)
{
	//Effect.toggle(ID, 'Appear', {duration:0.3, queue:{scope:'myscope', position:'end'}});
	
	if(document.getElementById(ID).style.display!="none")
	{
		document.getElementById(ID).style.display="none";
		ShowSideNotes();
		
		ShowClips++;
		MovePanel(ID);
		
		if(ID=="x_Notes_Patch")
		{
			RegisterDroppables('Notes');
		}
		else
		{
			RegisterDroppables('Body');
		}
	}
	else
	{
		document.getElementById(ID).style.display="block";

		if(--ShowClips==0)
		{
			if(document.getElementById('SideNotes').style.display!='none')	Effect.Fade('SideNotes');
		}
	}
	
}

function AddEmotion(EmotionCode)
{
	document.getElementById('Body').value=document.getElementById('Body').value+EmotionCode;
}

function ShowEmotions()
{
	if(document.getElementById('ExtraEmotions').style.display=='none')
	{
		document.getElementById('ExtraEmotions').style.display='inline-block';
	}
	else
	{
		document.getElementById('ExtraEmotions').style.display='none';
	}
}

function OpenPart(ID)
{	
	document.getElementById(ID).style.display="block";
	document.getElementById(ID+"_btn").style.color='#888';
	
	if(!Hold)
	{
		//alert(ID);
		Element.scrollTo(ID);
		//window.location.href="#"+ID+"_Mark";
	}
}

function ClosePart(ID)
{
	document.getElementById(ID).style.display="none";
	document.getElementById(ID+"_btn").style.color='#111';
	document.getElementById(ID+"_btn").disabled=false;
}



function GalleryItem_DisplayControls(ID)
{
	if(document.getElementById(ID+"_Box").style.display!="none")
	{
		document.getElementById(ID+"_Box").style.display="none";
		document.getElementById(ID+"_Description").style.display="block";
	}
	else
	{
		document.getElementById(ID+"_Box").style.display="block";
		document.getElementById(ID+"_Description").style.display="none";
		document.getElementById("Input_Image_Desc_"+ID).focus();
	}
}

function DisplayHelp(ID, Quick)
{
	if(!Quick)
	{
		Effect.toggle(ID+'_Help','BLIND', {duration:0.1});
	}
	else
	{
		if(document.getElementById(ID+"_Help").style.display!="none")
		{
			document.getElementById(ID+"_Help").style.display="none";
		}
		else
		{
			document.getElementById(ID+"_Help").style.display="inline-block";
		}
	}
}

function HideProgress()
{
	document.getElementById('Page_Progress').style.display='none';
}

function SwitchPage(ID)
{
	Effect.Appear('Page_Switching_Indicator', {duration:0.3});
	xajax_SwitchThis(ID);
}


function hotKeys (event) {

  // Get details of the event dependent upon browser
  event = (event) ? event : ((window.event) ? event : null);
  
  // We have found the event.
  if (event) {   
    
    // Hotkeys require that either the control key or the alt key is being held down
    if (event.ctrlKey || event.altKey || event.metaKey) {
    
      // Pick up the Unicode value of the character of the depressed key.
      var charCode = (event.charCode) ? event.charCode : ((event.which) ? event.which : event.keyCode);
      
      // Convert Unicode character to its lowercase ASCII equivalent
      var myChar = String.fromCharCode (charCode).toLowerCase();
      
      // Convert it back into uppercase if the shift key is being held down
      if (event.shiftKey) {myChar = myChar.toUpperCase();}
          
      // Now scan through the user-defined array to see if character has been defined.
      for (var i = 0; i < keyActions.length; i++) {
         
        // See if the next array element contains the Hotkey character
        if (keyActions[i].character == myChar) { 
      
          // Yes - pick up the action from the table
          var action;
            
          // If the action is a hyperlink, create JavaScript instruction in an anonymous function
          if (keyActions[i].actionType.toLowerCase() == "link") {
            action = new Function ('location.href  ="' + keyActions[i].param + '"');
          }
            
          // If the action is JavaScript, embed it in an anonymous function
          else if (keyActions[i].actionType.toLowerCase()  == "code") {
            action = new Function (keyActions[i].param);
          }
            
          // Error - unrecognised action.
          else {
            alert ('Hotkey Function Error: Action should be "link" or "code"');
            break;
          }
           
          // At last perform the required action from within an anonymous function.
          action ();
         
          // Hotkey actioned - exit from the for loop.
          break;
        }
      }
    }
  }
}


function getMimeType()
{
	var  mimeType = "application/x-mplayer2"; //default
	var agt=navigator.userAgent.toLowerCase();
	var is_mac = (agt.indexOf("mac")!=-1); 
	with (navigator)
	{
		if (mimeTypes && !(agt.indexOf("windows")!=-1 && agt.indexOf("windows 3.1")==-1))
		{
	 		//non-IE, no Windows
			var plugin = mimeTypes["audio/mpeg"].enabledPlugin;
			if (plugin) mimeType = "audio/mpeg";	 //mac/Safari
/*			else
		{
				plugin = mimeTypes["audio/mpeg-url"].enabledPlugin;
			if (plugin) mimeType = "audio/mpeg-url" // non-IE 2nd favorite (Linux/FF)
		}
*/
	 }//end no-Windows 
	}//end with (navigator)
	return mimeType;
}//end function getMimeType

function setEmbed(ID, root){
    var element = document.getElementById(ID);
	element.innerHTML ='<embed src="'+root+'" autostart="0" loop="0" class="EmbedPlayer" type="'+getMimeType()+'"></embed>';
}// end function setEmbed

function ShowEmbed(ID, root)
{
	var element = document.getElementById(ID);
	if(!element.innerHTML)	setEmbed(ID, root);
}

function EditGroupTitle(GroupID, SaveOrNot, NewTitle)
{
	
	if(document.getElementById('GroupBox_'+GroupID).style.display=='none')
	{
		document.getElementById('GroupTitle_'+GroupID).style.display = 'none';
		document.getElementById('GroupBox_'+GroupID).style.display = 'block';
		
		setTimeout("document.getElementById('GroupTitleEdit_"+GroupID+"').focus();", 200);
	}
	else
	{
		document.getElementById('GroupBox_'+GroupID).style.display = 'none';
		document.getElementById('GroupTitle_'+GroupID).style.display = 'block';
		
		if(SaveOrNot == 1)
		{
			if(!NewTitle)	NewTitle = "Untitled List";

			document.getElementById('GroupTitle_'+GroupID).innerHTML = NewTitle;

			$('GroupTitleEdit_'+GroupID).value = NewTitle;

			xajax_ModifyListGroupTitle(GroupID, NewTitle);

		}
		else
		{
			$('Group_Edit_'+GroupID).reset();
		}
	}
}

function TrashListingGroup(GroupID)
{
	if(confirm("Are you sure to delete this list?\nThis will delete all its items."))
	{
		//Effect.Fade("Group_"+GroupID, {duration:0.3});
		ShowProgressBar("Lists");
		xajax_TrashListing(Status_CurrentID, GroupID);
	}
}

function TrashListItem(ID)
{
	if(confirm(DeleteConfirmText))
	{
		//Effect.BlindUp("Task_"+ID+"_MI", {duration:0.2});
		$('Task_MI_'+ID).remove();
		
		xajax_TrashListing(ID);
	}
	return;
}


function ToggleListEdit(ID, Mode, autoFocus)
{
	var listDOM = document.getElementById('Task_MI_'+ID);
	
	var rows = listDOM.getElementsByTagName('tr');
	
	var rowItem;
	for(i=0;i<rows.length;i++)
	{
		rowItem = rows[i];
		if(rowItem.getAttribute("rowtype") == Mode)
			rowItem.style.display = '';
		else
			rowItem.style.display = 'none';
	}
	
	if(!autoFocus)	autoFocus = 'List_ItemName_Input_'+ID;
	
	if(Mode == "edit")
		setTimeout("document.getElementById('"+autoFocus+"').focus();", 200);
	
}

function ShareMe()
{
	obj=document.getElementById('SubscriberIcon');
	
	if(obj.className=='btnShare')
	{
		
		obj.className = 'btnShare_Active';
		//document.getElementById('SharePage').className = 'SharedPage';
		document.getElementById('ShareStatus').style.display = 'none';
		
		/*
		document.getElementById('ShareStatus').innerHTML = "<img src='/img/App_GUI/Misc/indicator_3.gif' width='16' height='16' border='0' style='float:right' />";
		xajax_SharePage(Status_CurrentID);
		*/
		
		Effect.BlindDown('SharePage_Detail', {duration:0.2});
		if(document.getElementById('Share_Invite_Status').style.display!='none')
			setTimeout("xajax_GetShareStatus('"+Status_CurrentID+"');", 500);
	}
	else
	{
		obj.className = 'btnShare';
		//document.getElementById('SharePage').className = '';

		document.getElementById('ShareStatus').style.display = 'block';
		
		Effect.BlindUp('SharePage_Detail', {duration:0.2});
		//xajax_SharePage(Status_CurrentID);
	}
}

function ToggleTag(Tag, obj)
{
	if(obj.className == 'Topic_TagSelection')
	{
		obj.className = 'Topic_Selected_TagSelection';
		document.getElementById('Tag_Box_Input').value = document.getElementById('Tag_Box_Input').value+','+Tag+',';
		document.getElementById('Tag_Box_Input').value = document.getElementById('Tag_Box_Input').value.replace(",,", ",");
	}
	else
	{
		obj.className = 'Topic_TagSelection';
		document.getElementById('Tag_Box_Input').value = document.getElementById('Tag_Box_Input').value.replace(Tag+",", "");
	}
}

function ConfirmShare(obj)
{
	document.getElementById('ShareStatus').innerHTML = "<img src='/img/App_GUI/Misc/indicator_2.gif' width='16' height='16' />";
	document.getElementById('ShareStatus').style.visibility = 'visible';
	obj.disabled=true;obj.value='Processing...';
	ShareMe();
	
	if(document.getElementById('Share_Inform').style.display != "none")
	{
		//share publicly
		xajax_SharePage(Status_CurrentID, document.getElementById('ShareTheme').value, 'PUBLIC', document.getElementById('Inform_Box').value);
	}
	else
	{
		//share privately
		xajax_SharePage(Status_CurrentID, document.getElementById('ShareTheme').value, 'SELECT', document.getElementById('Invitation_Box').value);
	}

}

function SwitchSharePreview(value)
{
	document.getElementById('Share_Preview').src = '/extras/WebExport/'+value+'/screenshot.jpg';
}

function SwitchShareBox(value)
{
	if(value=="Invite")
	{
		document.getElementById('Share_Inform').style.display = 'none';
		document.getElementById('Share_Invite').style.display = 'block';
	}
	else
	{
		document.getElementById('Share_Invite').style.display = 'none';
		document.getElementById('Share_Inform').style.display = 'block';
	}
}

function GetStatistics()
{
	document.getElementById('ShareStatus').innerHTML = "<img src='/img/App_GUI/Misc/indicator_2.gif' width='16' height='16' />";
	xajax_GetStatistics(Status_CurrentID);
}


function AddContact(SaveOrNot)
{
	if(document.getElementById('AddContact').style.display=='none')
	{
		document.getElementById('AddContact_Name').value = '';
		//setTimeout("document.getElementById('AddContact_Name').focus();", 400);
		setTimeout("new Effect.ScrollTo('PageControls', {duration:1});", 200);
	}
		
	Effect.toggle('AddContact', 'BLIND', {duration:0.1});
	
	if(SaveOrNot==1)
	{
		setTimeout("xajax_AddRelatedContact(Status_CurrentID, document.getElementById('AddContact_Name').value);", 110);
	}
	if(SaveOrNot==2)
	{
		setTimeout("xajax_AddRelatedContact(Status_CurrentID, document.getElementById('AddContact_List').value, 1);", 110);
	}
}

function AddTopicLink(SaveOrNot)
{
	
	if(document.getElementById('AddTopicLink').style.display=='none')
	{
		document.getElementById('AddTopicLink_Name').value = '';
		//setTimeout("document.getElementById('AddTopicLink_Name').focus();", 400);
		setTimeout("new Effect.ScrollTo('PageControls', {duration:1});", 200);
	}
	
	Effect.toggle('AddTopicLink', 'BLIND', {duration:0.1});
	
	if(SaveOrNot==1)
	{
		setTimeout("xajax_AddTopicLink(Status_CurrentID, document.getElementById('AddTopicLink_Name').value);", 110);
	}
	if(SaveOrNot==2)
	{
		setTimeout("xajax_AddTopicLink(Status_CurrentID, document.getElementById('AddTopicLink_List').value, 1);", 110);
	}
}


function TrashRelatedContact(ContactID)
{
	Effect.Fade('Contact_'+ContactID, {duration:0.3});
	xajax_TrashRelatedContact(Status_CurrentID, ContactID);
}

function TrashPage_Topic()
{
	if(!confirm(Localized_TrashPage_Prompt))	return;
	xajax_TrashPage(TopicID);
	
	setTimeout("Goto(2);", 300);

}

function CleanPage()
{
	if(confirm(CleanConfirmText))
	{
		//document.getElementById('TabIndicator').style.display='block';
		xajax_CleanPage(Status_CurrentID);
	}
	return;
}

function topic_editTitle(mode, saveOrNot) {
	
	if(mode == "edit") {
		
		$('x_TopicTitle_Display').style.display = 'none';
		$('x_TopicTitle_Edit').style.display = 'block';
		
		$("Input_Title").focus();
		
	}
	else {

		if(saveOrNot == true) {
			
			xajax_Topic_ModifyTitle(Status_CurrentID, $('Input_Title').value);
			
			$('x_PageTitle').innerHTML = $('Input_Title').value;
			
			if($('QA_Item_'+Status_CurrentID))
				$('QA_Item_'+Status_CurrentID).innerHTML = $('Input_Title').value;
			
		}
		else {
			$('Input_Title').value = $('x_PageTitle').innerHTML;
		}

		$('x_TopicTitle_Edit').style.display = 'none';
		$('x_TopicTitle_Display').style.display = 'block';
		
	}
}
/*
function EditTitle(CurrentTitle)
{
	if(CurrentTitle) {
		//CurrentTitle = unescape(CurrentTitle);
		//alert(CurrentTitle);
	}

	if(!document.getElementById('Input_Title'))
	{
		var CurrentTitle_p = (CurrentTitle);
		//alert(CurrentTitle_p);
		$("x_PageTitle").innerHTML="<input type='text' id='Input_Title' onfocus='this.select()' onblur='EditTitle()' value=\""+unescape(CurrentTitle)+"\" onkeyup=\"if(event.keyCode==13) this.blur(); if(event.keyCode==27) EditTitle('"+escape(CurrentTitle_p)+"');\" />&nbsp;<cite><a href='javascript:void(0)' onclick=\"EditTitle('"+escape(CurrentTitle_p)+"');\">"+Localized_Cancel+"</a></cite>";
		$("Input_Title").focus();
	}
	else
	{
		if(!CurrentTitle)
		{
			xajax_Topic_ModifyTitle(Status_CurrentID, $('Input_Title').value);
			
			if($('QA_Item_'+Status_CurrentID))
				$('QA_Item_'+Status_CurrentID).innerHTML = $('Input_Title').value;
		}
		else
		{
			//alert(CurrentTitle);
			$('x_PageTitle').innerHTML = "<a href=\"javascript:EditTitle('"+addslashes(CurrentTitle)+"')\" class='TitleLink'>"+CurrentTitle+"</a>";
		}	
	}
}
*/

function OpenLink(LinkAddress)
{
	window.open(LinkAddress, "Pagico", "width=800, height=500, toobar=no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no");
}

function Init_Topic()
{
	SaveInterval = null;
	ActivateCode = null;
	EditMode = 0;
}