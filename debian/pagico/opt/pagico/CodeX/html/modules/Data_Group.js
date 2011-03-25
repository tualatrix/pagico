function ResetGroups()
{
	if($('x_PageSets').innerHTML.length > 100)
	{
		$('x_Groups_EmptyIndicator').style.display = 'none';
	}
	else
	{
		$('x_Groups_EmptyIndicator').style.display = 'block';
	}
}


function AddRule(PageSetID)
{
	var myDate = new Date();
	
	var RuleID = myDate.getFullYear() +''+ myDate.getMonth() +''+ myDate.getDay() +''+ myDate.getHours() +''+ myDate.getMinutes() +''+ myDate.getSeconds() +'-'+myDate.getMilliseconds();

	var newRule = document.createElement("span");
	newRule.className = 'RuleItem';
	newRule.innerHTML = "<select onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', this.value)\" name='Keyword[]'><option value='Tags'>"+Localized_Tags+"</option><option value='Title'>"+Localized_Title+"</option><option value='Created'>"+Localized_Created+"</option><option value='Modified'>"+Localized_Modified+"</option><option value='Type'>Type</option><option value='Info'>Contact Info</option></select> <select style='width:150px' name='Equation[]' onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', 'Created', this.value);\" name='Equation[]'><option value='<>'>"+Localized_Contains+"</option><option value='><'>"+Localized_NotContain+"</option><option value='=='>"+Localized_Is+"</option><option value='!='>"+Localized_IsNot+"</option></select> <input type='text' name='Value[]' value='' style='width:200px' /> <a href='javascript:void(0)' onclick=\"AddRule('"+PageSetID+"')\" class='PageSetLink_Rule'>+</a>&nbsp;<a href='javascript:void(0)' class='PageSetLink_Rule' onclick=\"RemoveRule('"+PageSetID+"', '"+RuleID+"')\">-</a>";
	newRule.id = 'PageSet_Edit_'+PageSetID+'_Rule_'+RuleID;
	
	document.getElementById('PageSet_Edit_'+PageSetID+'_Rules').appendChild(newRule);
}

function SwitchRule(PageSetID, RuleID, RuleType, RuleValue)
{

	switch(RuleType)
	{
		case "Created":
			switch(RuleValue)
			{
				case ">=":
					document.getElementById("PageSet_Edit_"+PageSetID+"_Rule_"+RuleID).innerHTML = "<select onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', this.value)\" name='Keyword[]'><option value='Tags'>"+Localized_Tags+"</option><option value='Title'>"+Localized_Title+"</option><option value='Created' selected>"+Localized_Created+"</option><option value='Modified'>"+Localized_Modified+"</option><option value='Type'>Type</option><option value='Info'>Contact Info</option></select> <select style='width:150px' name='Equation[]' onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', 'Created', this.value);\"><option value='<='>"+Localized_Before+"</option><option value='>=' selected>"+Localized_After+"</option><option value='>=%7DAYZ%'>"+Localized_Past7Days+"</option><option value='>=%THISMONTH%'>"+Localized_InThisMonth+"</option></select> <input type='text' name='Value[]' value='' style='width:200px' /> <a href='javascript:void(0)' onclick=\"AddRule('"+PageSetID+"')\" class='PageSetLink_Rule'>+</a>&nbsp;<a href='javascript:void(0)' class='PageSetLink_Rule' onclick=\"RemoveRule('"+PageSetID+"', '"+RuleID+"')\">-</a>";
					break;
				case ">=%7DAYZ%":
					document.getElementById("PageSet_Edit_"+PageSetID+"_Rule_"+RuleID).innerHTML = "<select onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', this.value)\" name='Keyword[]'><option value='Tags'>"+Localized_Tags+"</option><option value='Title'>"+Localized_Title+"</option><option value='Created' selected>"+Localized_Created+"</option><option value='Modified'>"+Localized_Modified+"</option><option value='Type'>Type</option><option value='Info'>Contact Info</option></select> <select style='width:150px' name='Equation[]' onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', 'Created', this.value);\"><option value='<='>"+Localized_Before+"</option><option value='>=' selected>"+Localized_After+"</option><option value='>=%7DAYZ%' selected>"+Localized_Past7Days+"</option><option value='>=%THISMONTH%'>"+Localized_InThisMonth+"</option></select> <input type='text' name='Value[]' value='N/A' style='width:200px' readonly /> <a href='javascript:void(0)' onclick=\"AddRule('"+PageSetID+"')\" class='PageSetLink_Rule'>+</a>&nbsp;<a href='javascript:void(0)' class='PageSetLink_Rule' onclick=\"RemoveRule('"+PageSetID+"', '"+RuleID+"')\">-</a>";
			
					break;
				case ">=%THISMONTH%":
					document.getElementById("PageSet_Edit_"+PageSetID+"_Rule_"+RuleID).innerHTML = "<select onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', this.value)\" name='Keyword[]'><option value='Tags'>"+Localized_Tags+"</option><option value='Title'>"+Localized_Title+"</option><option value='Created' selected>"+Localized_Created+"</option><option value='Modified'>"+Localized_Modified+"</option><option value='Type'>Type</option><option value='Info'>Contact Info</option></select> <select style='width:150px' name='Equation[]' onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', 'Created', this.value);\"><option value='<='>"+Localized_Before+"</option><option value='>=' selected>"+Localized_After+"</option><option value='>=%7DAYZ%'>"+Localized_Past7Days+"</option><option value='>=%THISMONTH%' selected>"+Localized_InThisMonth+"</option></select> <input type='text' name='Value[]' value='N/A' style='width:200px' readonly /> <a href='javascript:void(0)' onclick=\"AddRule('"+PageSetID+"')\" class='PageSetLink_Rule'>+</a>&nbsp;<a href='javascript:void(0)' class='PageSetLink_Rule' onclick=\"RemoveRule('"+PageSetID+"', '"+RuleID+"')\">-</a>";
					break;
				
				case "<=":
				default:
					document.getElementById("PageSet_Edit_"+PageSetID+"_Rule_"+RuleID).innerHTML = "<select onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', this.value)\" name='Keyword[]'><option value='Tags'>"+Localized_Tags+"</option><option value='Title'>"+Localized_Title+"</option><option value='Created' selected>"+Localized_Created+"</option><option value='Modified'>"+Localized_Modified+"</option><option value='Type'>Type</option><option value='Info'>Contact Info</option></select> <select style='width:150px' name='Equation[]' onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', 'Created', this.value);\"><option value='<=' selected>"+Localized_Before+"</option><option value='>='>"+Localized_After+"</option><option value='>=%7DAYZ%'>"+Localized_Past7Days+"</option><option value='>=%THISMONTH%'>"+Localized_InThisMonth+"</option></select> <input type='text' name='Value[]' value='' style='width:200px' /> <a href='javascript:void(0)' onclick=\"AddRule('"+PageSetID+"')\" class='PageSetLink_Rule'>+</a>&nbsp;<a href='javascript:void(0)' class='PageSetLink_Rule' onclick=\"RemoveRule('"+PageSetID+"', '"+RuleID+"')\">-</a>";
			}
			break;
			
		case "Modified":
			
			switch(RuleValue)
			{
				case ">=":
					document.getElementById("PageSet_Edit_"+PageSetID+"_Rule_"+RuleID).innerHTML = "<select onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', this.value)\" name='Keyword[]'><option value='Tags'>"+Localized_Tags+"</option><option value='Title'>"+Localized_Title+"</option><option value='Created'>"+Localized_Created+"</option><option value='Modified' selected>"+Localized_Modified+"</option><option value='Type'>Type</option><option value='Info'>Contact Info</option></select> <select style='width:150px' name='Equation[]' onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', 'Modified', this.value);\"><option value='<='>"+Localized_Before+"</option><option value='>=' selected>"+Localized_After+"</option><option value='>=%7DAYZ%'>"+Localized_Past7Days+"</option><option value='>=%THISMONTH%'>"+Localized_InThisMonth+"</option></select> <input type='text' name='Value[]' value='' style='width:200px' /> <a href='javascript:void(0)' onclick=\"AddRule('"+PageSetID+"')\" class='PageSetLink_Rule'>+</a>&nbsp;<a href='javascript:void(0)' class='PageSetLink_Rule' onclick=\"RemoveRule('"+PageSetID+"', '"+RuleID+"')\">-</a>";
					break;
				case ">=%7DAYZ%":
					document.getElementById("PageSet_Edit_"+PageSetID+"_Rule_"+RuleID).innerHTML = "<select onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', this.value)\" name='Keyword[]'><option value='Tags'>"+Localized_Tags+"</option><option value='Title'>"+Localized_Title+"</option><option value='Created'>"+Localized_Created+"</option><option value='Modified' selected>"+Localized_Modified+"</option><option value='Type'>Type</option><option value='Info'>Contact Info</option></select> <select style='width:150px' name='Equation[]' onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', 'Modified', this.value);\"><option value='<='>"+Localized_Before+"</option><option value='>=' selected>"+Localized_After+"</option><option value='>=%7DAYZ%' selected>"+Localized_Past7Days+"</option><option value='>=%THISMONTH%'>"+Localized_InThisMonth+"</option></select> <input type='text' name='Value[]' value='N/A' style='width:200px' readonly /> <a href='javascript:void(0)' onclick=\"AddRule('"+PageSetID+"')\" class='PageSetLink_Rule'>+</a>&nbsp;<a href='javascript:void(0)' class='PageSetLink_Rule' onclick=\"RemoveRule('"+PageSetID+"', '"+RuleID+"')\">-</a>";
				
					break;
				case ">=%THISMONTH%":
					document.getElementById("PageSet_Edit_"+PageSetID+"_Rule_"+RuleID).innerHTML = "<select onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', this.value)\" name='Keyword[]'><option value='Tags'>"+Localized_Tags+"</option><option value='Title'>"+Localized_Title+"</option><option value='Created'>"+Localized_Created+"</option><option value='Modified' selected>"+Localized_Modified+"</option><option value='Type'>Type</option><option value='Info'>Contact Info</option></select> <select style='width:150px' name='Equation[]' onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', 'Modified', this.value);\"><option value='<='>"+Localized_Before+"</option><option value='>=' selected>"+Localized_After+"</option><option value='>=%7DAYZ%'>"+Localized_Past7Days+"</option><option value='>=%THISMONTH%' selected>"+Localized_InThisMonth+"</option></select> <input type='text' name='Value[]' value='N/A' style='width:200px' readonly /> <a href='javascript:void(0)' onclick=\"AddRule('"+PageSetID+"')\" class='PageSetLink_Rule'>+</a>&nbsp;<a href='javascript:void(0)' class='PageSetLink_Rule' onclick=\"RemoveRule('"+PageSetID+"', '"+RuleID+"')\">-</a>";
					break;
					
				case "<=":
				default:
					document.getElementById("PageSet_Edit_"+PageSetID+"_Rule_"+RuleID).innerHTML = "<select onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', this.value)\" name='Keyword[]'><option value='Tags'>"+Localized_Tags+"</option><option value='Title'>"+Localized_Title+"</option><option value='Created'>"+Localized_Created+"</option><option value='Modified' selected>"+Localized_Modified+"</option><option value='Type'>Type</option><option value='Info'>Contact Info</option></select> <select style='width:150px' name='Equation[]' onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', 'Modified', this.value);\"><option value='<=' selected>"+Localized_Before+"</option><option value='>='>"+Localized_After+"</option><option value='>=%7DAYZ%'>"+Localized_Past7Days+"</option><option value='>=%THISMONTH%'>"+Localized_InThisMonth+"</option></select> <input type='text' name='Value[]' value='' style='width:200px' /> <a href='javascript:void(0)' onclick=\"AddRule('"+PageSetID+"')\" class='PageSetLink_Rule'>+</a>&nbsp;<a href='javascript:void(0)' class='PageSetLink_Rule' onclick=\"RemoveRule('"+PageSetID+"', '"+RuleID+"')\">-</a>";
			}

			break;
			
		case "Tags":
			document.getElementById("PageSet_Edit_"+PageSetID+"_Rule_"+RuleID).innerHTML = "<select onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', this.value)\" name='Keyword[]'><option value='Tags' selected>"+Localized_Tags+"</option><option value='Title'>"+Localized_Title+"</option><option value='Created'>"+Localized_Created+"</option><option value='Modified'>"+Localized_Modified+"</option><option value='Type'>Type</option><option value='Info'>Contact Info</option></select> <select style='width:150px' name='Equation[]'><option value='<>'>"+Localized_Contains+"</option><option value='><'>"+Localized_NotContain+"</option><option value='=='>"+Localized_Is+"</option><option value='!='>"+Localized_IsNot+"</option></select> <input type='text' name='Value[]' value='' style='width:200px' /> <a href='javascript:void(0)' onclick=\"AddRule('"+PageSetID+"')\" class='PageSetLink_Rule'>+</a>&nbsp;<a href='javascript:void(0)' class='PageSetLink_Rule' onclick=\"RemoveRule('"+PageSetID+"', '"+RuleID+"')\">-</a>";
			break;
			
		case "Title":
			document.getElementById("PageSet_Edit_"+PageSetID+"_Rule_"+RuleID).innerHTML = "<select onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', this.value)\" name='Keyword[]'><option value='Tags'>"+Localized_Tags+"</option><option value='Title' selected>"+Localized_Title+"</option><option value='Created'>"+Localized_Created+"</option><option value='Modified'>"+Localized_Modified+"</option><option value='Type'>Type</option><option value='Info'>Contact Info</option></select> <select style='width:150px' name='Equation[]'><option value='<>'>"+Localized_Contains+"</option><option value='><'>"+Localized_NotContain+"</option><option value='=='>"+Localized_Is+"</option><option value='!='>"+Localized_IsNot+"</option></select> <input type='text' name='Value[]' value='' style='width:200px' /> <a href='javascript:void(0)' onclick=\"AddRule('"+PageSetID+"')\" class='PageSetLink_Rule'>+</a>&nbsp;<a href='javascript:void(0)' class='PageSetLink_Rule' onclick=\"RemoveRule('"+PageSetID+"', '"+RuleID+"')\">-</a>";
			break;
			
		case "Type":
			document.getElementById("PageSet_Edit_"+PageSetID+"_Rule_"+RuleID).innerHTML = "<select onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', this.value)\" name='Keyword[]'><option value='Tags'>"+Localized_Tags+"</option><option value='Title'>"+Localized_Title+"</option><option value='Created'>"+Localized_Created+"</option><option value='Modified'>"+Localized_Modified+"</option><option value='Type' selected>Type</option><option value='Info'>Contact Info</option></select> <select style='width:150px' name='Equation[]'<option value='=='>"+Localized_Is+"</option><option value='!='>"+Localized_IsNot+"</option></select> <select name='Value[]'><option value='Topic'>Project</option><option value='Profile'>Contact Profile</option></select> <a href='javascript:void(0)' onclick=\"AddRule('"+PageSetID+"')\" class='PageSetLink_Rule'>+</a>&nbsp;<a href='javascript:void(0)' class='PageSetLink_Rule' onclick=\"RemoveRule('"+PageSetID+"', '"+RuleID+"')\">-</a>";
			break;
		
		case "Info":
			document.getElementById("PageSet_Edit_"+PageSetID+"_Rule_"+RuleID).innerHTML = "<select onchange=\"SwitchRule('"+PageSetID+"', '"+RuleID+"', this.value)\" name='Keyword[]'><option value='Tags'>"+Localized_Tags+"</option><option value='Title'>"+Localized_Title+"</option><option value='Created'>"+Localized_Created+"</option><option value='Modified'>"+Localized_Modified+"</option><option value='Type'>Type</option><option value='Info' selected>Contact Info</option></select> <select style='width:150px' name='Equation[]'><option value='<>'>"+Localized_Contains+"</option><option value='><'>"+Localized_NotContain+"</option><option value='=='>"+Localized_Is+"</option><option value='!='>"+Localized_IsNot+"</option></select> <input type='text' name='Value[]' value='' style='width:200px' /> <a href='javascript:void(0)' onclick=\"AddRule('"+PageSetID+"')\" class='PageSetLink_Rule'>+</a>&nbsp;<a href='javascript:void(0)' class='PageSetLink_Rule' onclick=\"RemoveRule('"+PageSetID+"', '"+RuleID+"')\">-</a>";
			break;
	}
}

function RemoveRule(PageSetID, RuleID)
{
	//alert(RuleID);
	//document.getElementById('PageSet_Edit_'+PageSetID+'_Rule_'+RuleID).style.
	//alert(document.getElementById('PageSet_Edit_'+PageSetID+'_Rules').childNodes.length);
	if(Browser=="Explorer")
	{
		if(document.getElementById('PageSet_Edit_'+PageSetID+'_Rules').childNodes.length <= 1) return;
	}

	if(Browser=="Safari")
	{
		if(document.getElementById('PageSet_Edit_'+PageSetID+'_Rules').childNodes.length-3 <= 1) return;
	}

	
	document.getElementById('PageSet_Edit_'+PageSetID+'_Rules').removeChild(document.getElementById('PageSet_Edit_'+PageSetID+'_Rule_'+RuleID));
}

function TrashSet(PageSetID)
{
	//setTimeout("Effect.BlindUp('PageSet_Item_"+PageSetID+"', {duration:0.2});", 500);
	if(confirm(DeleteConfirmText))	xajax_TrashSet(PageSetID);
}