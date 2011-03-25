var Contact_OriginalName = "";
var Freeze, SaveTimeout;

function Contact_editName(saveOrNot) {
	
	if($('x_ContactName_Display').style.display != 'none') {
		
		$('contactFirstName').value = $('firstName').innerHTML;
		$('contactLastName').value = $('lastName').innerHTML;
		
		$('x_ContactName_Display').style.display = 'none';
		$('x_ContactName_Edit').style.display = 'block';
		
		setTimeout("if($('contactFirstName')) $('contactFirstName').focus();", 300);
		
		
	}
	else {
		
		if(saveOrNot == false) {
			$('contactNameFrm').reset();
		}
		else {
			xajax_Contact_Name_Save(Status_CurrentID, xajax.getFormValues('contactNameFrm'));
		}	

		$('x_ContactName_Edit').style.display = 'none';
		$('x_ContactName_Display').style.display = 'block';
	}
}

/*
function Contact_Name_Edit(SaveSettings)
{
	if(Freeze)	return;
	Freeze = 1;
	
	var contactName = document.getElementById('x_ContactName');

	if(!document.getElementById('Contact_NewName'))
	{
		//start to edit?
		Freeze=1;
		Contact_OriginalName = contactName.innerHTML;

		contactName.innerHTML = "<input onblur=\"Contact_Name_Edit(2)\" onkeyup=\"if(event.keyCode==13) this.blur(); if(event.keyCode==27) Contact_Name_Edit(1);\" type='text' id='Contact_NewName' value=\""+Contact_OriginalName+"\" class='NameEdit' onfocus='this.select()' />";
		
		setTimeout("document.getElementById('Contact_NewName').focus();", 50);
	}
	else
	{
		//return
		if(SaveSettings==2)
		{
			var newName = document.getElementById('Contact_NewName').value;

			contactName.innerHTML = newName;
			
			xajax_Contact_Name_Save(Status_CurrentID, newName);
			Changed=1;
			
			if($('QA_Item_'+Status_CurrentID))
				$('QA_Item_'+Status_CurrentID).innerHTML = newName;
			
		}
		else if(SaveSettings==1)
		{
			contactName.innerHTML = Contact_OriginalName;
		}
		
		Contact_OriginalName = "";
		//save or restore?
	}
	setTimeout("Freeze=0;", 200);
}
*/


function Contact_CheckForKeywords(ItemID, Input)
{
	//document.getElementById(ItemID+"_Hint").innerHTML = "looking for relavent records...";
	
	xajax_Contact_CheckForKeywords(ItemID, Input);
}

function Contact_CheckInput(Value, event)
{
	if(event.shiftKey==1&&event.keyCode==186)
	{
		//check for keywords
		return true;
	}
	
	if(Value.substr(Value.length-1, 1)==":"||Value.substr(Value.length-1, 1)=="：")
		return true;
	else
		return false;
}

function Contact_Entry_Trash(EntryID)
{
	$('Contact_Detail_Entry_'+EntryID).remove();
	xajax_Contact_Entry_Trash(Status_CurrentID, EntryID);
}

function Contact_Entry_Edit(ID)
{
	if(document.getElementById(ID+"_Display").style.display=='none')
	{
		document.getElementById(ID+"_Edit").style.display = 'none';
		document.getElementById(ID+"_Display").style.display = 'block';
	}
	else
	{
		document.getElementById(ID+"_Display").style.display = 'none';
		document.getElementById(ID+"_Edit").style.display = 'block';
		
		setTimeout("document.getElementById('"+ID+"_Input').focus();", 250);
	}
}

function Contact_Entry_Save(ID)
{
	if(SaveTimeout)	clearTimeout(SaveTimeout);
	
	//alert($(ID+'_Edit').innerHTML);
	
	Changed=1;
	if($(ID+"_Input"))
		$(ID+"_Input").readonly = true;
	
	xajax_Contact_saveEntry(xajax.getFormValues(ID+"_Edit"));
}
