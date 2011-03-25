//var collectionListView = new listView('Collection_listView');

function Collection_Save(groupID) {
			
	if(document.getElementById('PageSet_Edit_'+groupID+'_Static').style.display!='none')
	{
		//static
		xajax_Collection_Save(groupID, 'Static', document.getElementById('PageSet_'+groupID+'_PageSetName').value, document.getElementById('PageSet_'+groupID+'_PageSetDesc').value, JSON.stringify(xajax.getFormValues('Collection_ItemList')));

	}
	else
	{
		//smart
		xajax_Collection_Save(groupID, 'Smart', document.getElementById('PageSet_'+groupID+'_PageSetName').value, document.getElementById('PageSet_'+groupID+'_PageSetDesc').value, JSON.stringify(xajax.getFormValues('PageSet_Form_'+groupID)));
	}
	
	Effect.BlindUp('PageSet_Edit_'+groupID, {duration:0.1});
	document.getElementById('PageSet_Edit_'+groupID+'_Prompt').style.display = 'block';
	
}

function Collection_ToggleEdit(groupID)
{
	if(document.getElementById('PageSet_Edit_'+groupID+'_Prompt').style.display == 'none')
	{
		Effect.BlindUp('PageSet_Edit_'+groupID, {duration:0.2});
		//$('PageSet_Edit_'+groupID).style.display = "none";
		$('PageSet_Edit_'+groupID+'_Prompt').style.display = 'block';
		$('PageSet_Header_'+groupID).style.display = 'block';
	}
	else
	{
		//Sortable.create('PageSet_'+groupID+'_Pages', {dropOnEmpty:true,scroll:'PageSet_'+groupID+'_Pages',containment:['PageSet_'+groupID+'_Pages', 'PageSet_'+groupID+'_Available_Pages'],tag:'span',constraint:false, onChange:function(){return;}});
		//Sortable.create('PageSet_'+groupID+'_Available_Pages', {dropOnEmpty:true,scroll:'PageSet_'+groupID+'_Pages',containment:['PageSet_'+groupID+'_Pages'],tag:'span',constraint:false, onChange:function(){return;}});
		
		$('PageSet_Header_'+groupID).style.display = 'none';
		Effect.BlindDown('PageSet_Edit_'+groupID, {duration:0.2});
		//$('PageSet_Edit_'+groupID).style.display = "block";
		$('PageSet_Edit_'+groupID+'_Prompt').style.display = 'none';
		$('PageSet_Form_'+groupID).reset();
		
		setTimeout("$('PageSet_"+groupID+"_PageSetName').focus();", 250);
		
	}
}
