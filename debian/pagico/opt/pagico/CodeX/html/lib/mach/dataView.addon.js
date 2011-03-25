var mouseoutTimeout, dataView_CurrentID;
var dataView_CurrentEditingItem = "";

function dataView_ToggleEdit(UID, SaveOrNot, autoFocus) {
	
	if($('dataView_ReadOnly')) {
		//alert("This item is read only.");
		return false;
	}
	
	var SegmentObj = document.getElementById('dataView_Item_'+UID+'_Edit');
	if(!SegmentObj)	return false;
	
	if(SaveOrNot == 1 && SegmentObj.style.display == 'none')	return;
	
	if(SegmentObj.style.display=='none')
	{
		//display edit layout
		
		if($('dataView_Item_'+UID).hasClassName("dataView_Segment_Collapsed"))
			dataView_foldObject(UID);
		
		$('dataView_Item_'+UID).addClassName("dataView_Segment_hover");
		
		EditMode ++;
		dataView_CurrentEditingItem = UID;
		
		resetPopupSelection();
		
		SegmentObj.style.display = '';
		
		if(document.getElementById('dataView_Item_'+UID+'_Display'))
			document.getElementById('dataView_Item_'+UID+'_Display').style.display = 'none';

		
		if(document.getElementById('dataView_Item_'+UID+'_EditIcon'))
			document.getElementById('dataView_Item_'+UID+'_EditIcon').style.visibility = 'hidden';
			
			
		if(document.getElementById('dataView_Item_'+UID+'_EditIcon_Upper'))
			document.getElementById('dataView_Item_'+UID+'_EditIcon_Upper').style.visibility = 'hidden';
			
		if(!autoFocus)	autoFocus = 'Segment_'+UID+'_Title';
		
		if(document.getElementById(autoFocus))
			setTimeout("document.getElementById('"+autoFocus+"').focus();", 200);
			
		if(document.getElementById('SaveIndicator_'+UID))
		{
			SaveInterval = setInterval("BackgroundSave('"+UID+"');", 1000*120);
			//auto-save every 120 sec.
		}
		
		
		if(document.getElementById('Segment_'+UID+'_Edit_Single_InputBox'))
			setTimeout("document.getElementById('Segment_"+UID+"_Edit_Single_InputBox').focus();", 200);
		
		
		//add datepickers
		
		if($('List_ItemStartDate_'+UID+'_CreateNew_Input')) {
			
			datePickerController.destroyDatePicker('List_ItemStartDate_'+UID+'_CreateNew_Input');
			eval("var opts = {formElements: { 'List_ItemStartDate_"+UID+"_CreateNew_Input' : '"+DateFmt+"' }, noFadeEffect:true };datePickerController.createDatePicker(opts);");

			datePickerController.destroyDatePicker('List_ItemDueDate_'+UID+'_CreateNew_Input');
			eval("var opts = {formElements: { 'List_ItemDueDate_"+UID+"_CreateNew_Input' : '"+DateFmt+"' }, noFadeEffect:true };datePickerController.createDatePicker(opts);");
			
		}
		
		if($('Segment_'+UID+'_Timestamp')) {
			
			datePickerController.destroyDatePicker('Segment_'+UID+'_Timestamp');
			eval("var opts = {formElements: { 'Segment_"+UID+"_Timestamp' : '"+DateFmt+"' }, noFadeEffect:true };datePickerController.createDatePicker(opts);");
			
		}
			
		if(document.getElementById('Segment_'+UID+'_Text'))
		{
			cleanupCode = cleanupCode + "dataView_ToggleEdit('"+UID+"', 1);";

			//tinyMCE.execCommand("mceAddControl", false, xajax.$('Segment_'+UID+'_Text'));
			tinyMCE.execCommand("mceAddControl", false, 'Segment_'+UID+'_Text');
			tinyMCE.execCommand('mceFocus', false, 'Segment_'+UID+'_Text_MCE');
			
		}
		
	}
	else
	{
		
		$('dataView_Item_'+UID).removeClassName("dataView_Segment_hover");
		
		EditMode --;
		if(EditMode < 0)	EditMode = 0;
		
		
		
		//alert('showing');
		if(document.getElementById('dataView_Item_'+UID+'_EditIcon'))
			document.getElementById('dataView_Item_'+UID+'_EditIcon').style.visibility = '';
		
		if(document.getElementById('dataView_Item_'+UID+'_EditIcon_Upper'))
			document.getElementById('dataView_Item_'+UID+'_EditIcon_Upper').style.visibility = '';
		
		if(document.getElementById('Segment_'+UID+'_Text'))
		{
			//var content=tinyMCE.activeEditor.getContent({format : 'text'});
			var content = tinyMCE.get('Segment_'+UID+'_Text').getContent();
			
			tinyMCE.execCommand("mceRemoveControl", false, 'Segment_'+UID+'_Text');
			//tinyMCE.execCommand("mceRemoveControl", false, xajax.$('Segment_'+UID+'_Text'));
		}
		
		//hide edit layout
		//if(document.getElementById('Segment_'+UID+'_Text'))	TinyMCE.triggerSave(false, false);
		
		if(document.getElementById('SaveIndicator_'+UID))	clearInterval(SaveInterval);
		
		SegmentObj.style.display = 'none';

		if(document.getElementById('dataView_Item_'+UID+'_Display'))
			document.getElementById('dataView_Item_'+UID+'_Display').style.display = 'block';

		if(SaveOrNot==1)
		{
			if(document.getElementById('Segment_'+UID+'_Text'))
			{
				//var content = tinyMCE.getContent('Segment_'+UID+'_Text').replace(/\+/g, "&#43");
				//content = content.replace(/\\/g, "&#92");
				//content = escape(content);
				

				//tinyMCE.execCommand('mceFocus', false, 'Segment_'+UID+'_Text');
				//tinyMCE.execCommand('mceRemoveControl', false, 'Segment_'+UID+'_Text');
				
				document.getElementById('Segment_'+UID+'_Text').value = content;
			}

			if(document.getElementById('dataView_Item_'+UID+'_Display'))
			{
				document.getElementById('dataView_Item_'+UID+'_Display').innerHTML = "<img src='/img/App_GUI/Misc/indicator_4.gif' width='16' height='16' style='margin:5px 0 0 30px' /><br />&nbsp;";
			}
			else
			{
				document.getElementById('dataView_Item_'+UID+'_EditIcon').style.visibility = 'visible';
				document.getElementById('dataView_Item_'+UID+'_EditIcon').innerHTML = 'Adding...';
			}

			xajax_dataView_Save(xajax.getFormValues('dataView_Item_'+UID+'_Edit'));
			
			/*
			if(document.getElementById('Changed_'+ID))
				document.getElementById('Changed_'+ID).value = 0;
			*/
		}
		else
		{
			if(!document.getElementById('SaveIndicator_'+UID))
				SegmentObj.reset();
				
			if(document.getElementById('Segment_'+UID+'_Text'))
			{
				tinyMCE.execCommand('mceRemoveControl', false, 'Segment_'+UID+'_Text');
			}
		}
		
		
		if(document.getElementById('Segment_'+UID+'_Edit_Multiple'))
		{
			document.getElementById('Segment_'+UID+'_Edit_Multiple').style.display = 'none';
			document.getElementById('Segment_'+UID+'_Edit_Single').style.display = '';
		}

	}
}

function dataView_ToggleListTitleEdit(UID, SaveOrNot, newValue) {
	
}

function dataView_foldObject(UID) {
	$('dataView_Item_'+UID).toggleClassName("dataView_Segment_Collapsed");
	
	xajax_dataView_foldObject(UID, $('dataView_Item_'+UID).hasClassName("dataView_Segment_Collapsed"));
}

function dataView_toggleLock(itemUID, object) {
	
	$(object).toggleClassName('EditIcon_Locked').toggleClassName('EditIcon_Unlocked');
	
	if($(object).hasClassName("EditIcon_Locked"))
		xajax_dataView_toggleItemLock(itemUID, "lock");
	else
		xajax_dataView_toggleItemLock(itemUID, "unlock");
}

function dataView_toggleFold(action) {
	
	if($('mergeTaskBtn').hasClassName("ToolBtn_Disabled"))	return false;
	
	toggleLoadingPanel();
	
	if(!Status_CurrentID)
		xajax_dataView_foldAll("Inbox", action);
	else
		xajax_dataView_foldAll(Status_CurrentID, action);
		
}

function dataView_ToggleListItemEdit(UID, mode, autoFocus) {
	
	if($('dataView_ReadOnly')) {
		//alert("This item is read only.");
		return false;
	}
	
	if(mode == "edit") {
		
		EditMode++;
		dataView_CurrentEditingItem = UID;
		
		resetPopupSelection();
		
		if(listItemOpened != "") {
			document.getElementById('List_ItemName_Input_'+listItemOpened).focus();
			return;
		}
		else {
			listItemOpened = UID;
		}
		
		datePickerController.destroyDatePicker('List_StartDate_Input_'+UID);
		eval("var opts = {formElements: { 'List_StartDate_Input_"+UID+"' : '"+DateFmt+"' }, noFadeEffect:true };datePickerController.createDatePicker(opts);");
		
		datePickerController.destroyDatePicker('List_ItemDueDate_Input_'+UID);
		eval("var opts = {formElements: { 'List_ItemDueDate_Input_"+UID+"' : '"+DateFmt+"' }, noFadeEffect:true };datePickerController.createDatePicker(opts);");
		
	}
	else {
		EditMode--;
		listItemOpened = "";
	}
	
	
	var listDOM = document.getElementById('Task_MI_'+UID);
	
	var rows = listDOM.getElementsByTagName('tr');
	
	var rowItem;
	for(i=0;i<rows.length;i++)
	{
		rowItem = rows[i];
		if(rowItem.getAttribute("rowtype") == mode)
			rowItem.style.display = '';
		else
			rowItem.style.display = 'none';
	}
	
	if(!autoFocus)	autoFocus = 'List_ItemName_Input_'+UID;
	
	if(mode == "edit")
		setTimeout("document.getElementById('"+autoFocus+"').focus();", 200);
}

function dataView_ListItem_Save(listUID) {
	
	EditMode--;
	
	$('List_Edit_'+listUID+'_Title_Value').value = $('List_ItemName_Input_'+listUID).value;
	$('List_Edit_'+listUID+'_Desc_Value').value = $('List_ItemDesc_Input_'+listUID).value;
	$('List_Edit_'+listUID+'_StartDate_Value').value = $('List_StartDate_Input_'+listUID).value;
	$('List_Edit_'+listUID+'_DueDate_Value').value = $('List_ItemDueDate_Input_'+listUID).value;
	
	listItemOpened = "";
	
	xajax_dataView_ListItem_Save(xajax.getFormValues('List_Edit_'+listUID));
}

function dataView_HoverItem(UID, originalClass) {
	
	if(event.button == 1)	return;
	//document.getElementById('SegmentControl_'+UID).style.display='block';
	document.getElementById('dataView_Item_'+UID).style.zIndex = 50;
	
}

function dataView_LeaveItem(UID, originalClass) {
	
	//document.getElementById('SegmentControl_'+UID).style.display='none';
	document.getElementById('dataView_Item_'+UID).style.zIndex = 0;
	
}

function dataView_ToggleMenu(ID, ForceOff) {
	
	if($('dataView_ReadOnly')) {
		//alert("This item is read only.");
		return false;
	}
	
	
	if(ID == 1)	ID = "Top";
	if(ID == 2)	ID = "Bottom";
	
	if(!$('Topic_Controller_'+ID))	return;
	
	if(document.getElementById('Topic_Controller_'+ID).style.display=='none' && !ForceOff)
	{
		document.getElementById('TopicControllers_More_'+ID).style.display = 'block';
		document.getElementById('Topic_Controller_'+ID).style.display='block';
		
		document.getElementById('DropZoneTip_'+ID).style.display = 'block';
		
		document.getElementById('AddContent_Button_'+ID).className = 'Topic_AddContent_Button Topic_AddContent_Button_hover';
	}
	else
	{
		document.getElementById('DropZoneTip_'+ID).style.display = 'none';
		Effect.Fade('Topic_Controller_'+ID, {duration:0.3, queue:{scope:'topiccontroller', position:'end'}});
		setTimeout("document.getElementById('NewFile_Controllers_"+ID+"').style.display = 'none';", 300);
		setTimeout("document.getElementById('AddContent_Button_"+ID+"').className = 'Topic_AddContent_Button';", 300);
	}
	
	if(ID=="Bottom")
	{
		//if(parent.getElementById('MainWindow'))	parent.getElementById('MainWindow').scrollTop+=9999;
		window.scrollBy(0, 9999);
	}
}

function dataView_AddNewItem(objType, AppendOrNot) {
	
	if($('dataView_ReadOnly')) {
		//alert("This item is read only.");
		return false;
	}
	
	dataView_ToggleMenu(AppendOrNot);
	
	var Switcher = '1';
	if(AppendOrNot=='Top')	Switcher = '0';
	
	switch(objType)
	{
		case "Text":
		case "List":
		case "Task":
			xajax_dataView_AddNewItem(dataView_CurrentID, objType, Switcher);
			break;
		
		default:
			xajax_dataView_AddNewFile(dataView_CurrentID, objType, Switcher);
			break;
	}
}

function dataView_ListItem_Trash(listUID) {
	
	if($('dataView_ReadOnly')) {
		//alert("This item is read only.");
		return false;
	}
	
	if(confirm(DeleteConfirmText + "\n" + permanentAction)) {
		$('Task_MI_'+listUID).innerHTML = "";
		//$('Task_MI_'+listUID).remove();

		xajax_dataView_ListItem_Trash(listUID);
	}
	return;
}

function dataView_ListTitle_Edit(listUID, SaveOrNot, newTitle) {
	
	if($('dataView_ReadOnly')) {
		//alert("This item is read only.");
		return false;
	}
	
	if(document.getElementById('dataView_ListTitle_'+listUID+'_Edit').style.display=='none')
	{
		$('dataView_ListTitle_'+listUID).style.display = 'none';
		$('dataView_ListTitle_'+listUID+'_Edit').style.display = 'block';
		
		setTimeout("$('dataView_ListTitle_"+listUID+"_Edit_Input').focus();", 200);
	}
	else
	{
		$('dataView_ListTitle_'+listUID+'_Edit').style.display = 'none';
		$('dataView_ListTitle_'+listUID).style.display = 'block';
		
		if(SaveOrNot == 1)
		{
			if(!newTitle)	newTitle = "Untitled List";

			$('dataView_ListTitle_'+listUID).innerHTML = newTitle;

			$('dataView_ListTitle_'+listUID+'_Edit_Input').value = newTitle;

			xajax_dataView_ListTitle_Save(listUID, newTitle);

		}
		else
		{
			$('dataView_ListTitle_'+listUID+'_Edit_Input').value = $('dataView_ListTitle_'+listUID).innerHTML;
		}
	}
	
}

function dataView_ResetMenus() {
	if($('NewFile_Controllers_Top').style.display != 'none')
		Effect.BlindUp('NewFile_Controllers_Top', {duration:0.3});
		
	if($('NewFile_Controllers_Bottom').style.display != 'none')
		Effect.BlindUp('NewFile_Controllers_Bottom', {duration:0.3});
	
	if($('SegmentsContainer_Inner').innerHTML.length < 150)
		$('dataView_EmptyIndicator').style.display = 'block';
	else
		$('dataView_EmptyIndicator').style.display = 'none';
}

var listItemOpened = "";

function dataView_Activate() {
	
	var CurrentID;
	var containments = new Array();

	listItemOpened = "";
	
	ListsOnTopic = ListsOnTopic.unique();
	
	for(i = 0; i< ListsOnTopic.length; i++) {
		containments.push("SegmentContainer_"+ListsOnTopic[i]);
	}
		
	for(i = 0; i< ListsOnTopic.length; i++)
	{
		CurrentID = ListsOnTopic[i];
		if(document.getElementById('SegmentContainer_'+CurrentID))
		{
			Sortable.create('SegmentContainer_'+CurrentID, {tag:'table', dropOnEmpty:true, ghosting:false, handle:'DragHandle', scroll:'x_Content', containment: containments, onUpdate:function(sortable){xajax_dataView_ListItem_ReOrder(Sortable.serialize(sortable))}});
		}
	}	
	
	Sortable.create('SegmentsContainer_Inner',{tag:'div', zindex:'30', scroll:window, ghosting:false, scroll:'x_Content', handle:'Segment_Move', onUpdate:function(sortable){xajax_dataView_Item_ReOrder(dataView_CurrentID, Sortable.serialize(sortable))}});
}

function dataView_ShowControls(UID)
{
	$(UID+"_Control").style.visibility="visible";
}

function dataView_HideControls(UID)
{
	$(UID+"_Control").style.visibility="hidden";
}


function dataView_Item_SwitchColor(UID, ColorID, SegmentClass)
{
	if($('dataView_ReadOnly')) {
		//alert("This item is read only.");
		return false;
	}
	
	var ColorSelection = new Array();
	ColorSelection[0] = 'None';
	ColorSelection[1] = 'Grey';
	ColorSelection[2] = 'Graphite';
	ColorSelection[3] = 'Blue';
	ColorSelection[4] = 'Green';
	ColorSelection[5] = 'Orange';
	ColorSelection[6] = 'Purple';
	ColorSelection[7] = 'Red';
	
	if(!SegmentClass)	SegmentClass='Segment_Text';
	
	var objectCollaposedClass = '';
	
	if($('dataView_Item_'+UID).hasClassName("dataView_Segment_Collapsed")) {
		objectCollaposedClass = ' dataView_Segment_Collapsed';
	}
	
	for(i=0;i<=7;i++)
	{
		if(!$('dataView_Item_'+UID+'_ColorSelection_'+i))	continue;
		
		if(ColorID==i)
		{
			$('dataView_Item_'+UID+'_ColorSelection_'+i).innerHTML = '&#215;';

			$('dataView_Item_'+UID).className = 'dataView_Segment '+SegmentClass+' Segment_'+ColorSelection[i] + objectCollaposedClass;
			
			TempClass = SegmentClass+' Segment_'+ColorSelection[i];

			xajax_dataView_Item_SetColor(UID, i);
		}
		else
		{
			$('dataView_Item_'+UID+'_ColorSelection_'+i).innerHTML = '';
		}
	}
}

function dataView_archiveItem(UID, archiveOrNot) {

	if($('dataView_ReadOnly')) {
		//alert("This item is read only.");
		return false;
	}

	var updateOrNot = true;
	var obj = $('dataView_Item_'+UID);
	
	if($('Status_dataView_ShowArchived').checked == true) {
		//don't do anything, but update the text link
		updateOrNot = true;
		
		if(archiveOrNot == 0) {

			obj.removeClassName('archivedItem');
			//remove the archivedItem class
		}
		else {
			//obj.className = obj.className + ' archivedItem';
			obj.addClassName('archivedItem');
		}
		
	}
	else {
		
		//if(archiveOrNot == 1) {
			
			//hide and remove the current item.
			
			Effect.Fade("dataView_Item_"+UID, {duration:0.3});
			setTimeout("$('dataView_Item_"+UID+"').remove();dataView_ResetMenus();", 300);
			
			updateOrNot = false;
		//}
	}
	

	xajax_dataView_archiveItem(UID, archiveOrNot, updateOrNot);
}

function dataView_switchArchiveDisplay(showArchiveOrNot) {
	if(!Status_CurrentID)
		xajax_dataView_refresh("Inbox", showArchiveOrNot);
	else
		xajax_dataView_refresh(Status_CurrentID, showArchiveOrNot);
}

function dataView_toggleReadOnly(readOnlyOrNot) {
	xajax_dataView_toggleReadOnly(Status_CurrentID, readOnlyOrNot);
}

function showRecursiveTaskMenu(taskUID, event) {
	//xajax call to prepare the menu
	xajax_dataView_showRecursiveTaskMenu(taskUID);
	//show the general-purposed menu
	showGeneralPopupMenu(event);
}

var dataViewFlowchart;

function ShowFlowchart()
{
	
	if(!$('dataview_Flowchart').innerHTML) {
		
		dataViewFlowchart = new chartView('dataview_Flowchart', 'dataViewFlowchart');
		dataViewFlowchart.criteria = Status_CurrentID;
		dataViewFlowchart.switchView(0);
		
	}
	
	if($('dataview_Flowchart').style.display == 'none')
	{
		$('FlowChartButton').className = "ActivatedFlowChartBtn";

		Effect.BlindDown('dataview_Flowchart', {duration:0.3});
	}
	else
	{
		$('FlowChartButton').className = "FlowChartBtn";
		Effect.BlindUp('dataview_Flowchart', {duration:0.3});
	}
}

function dataView_Flowchart_Refresh(ForceUpdate)
{
	if(!ForceUpdate && $('dataview_Flowchart').style.display == 'none')	return;
	//skip when the flowchart is not displayed.
	xajax_dataView_getFlowchart(Status_CurrentID);
}

function dataView_Flowchart_Init()
{
	var WindowsWidth;
	if(Browser == "Explorer")
		WindowWidth = document.documentElement.clientWidth;
	else
		WindowWidth = window.innerWidth;
	
	var FlowchartWidth = WindowWidth - 210 - 202;
	
	$('FlowChart_RightPanel_Today').style.width = FlowchartWidth + 'px';
	
	var leftBound = 0 - (1720 - FlowchartWidth);
	var rightBound = 1720 - FlowchartWidth;
	
	new Draggable('FlowChart_Canvas_Topic',{
	    snap: function(x,y,draggable) {
	      function constrain(n, lower, upper) {
	        if (n > upper) return upper;
	        else if (n < lower) return lower;
	        else return n;
	      }

	      element_dimensions = Element.getDimensions(draggable.element);
	      parent_dimensions = Element.getDimensions(draggable.element.parentNode);
	      return[
	        constrain(x, leftBound, 0),
	        constrain(y, 0, 0)];
	    },
	    revert:false,
		endeffect:function(){}
	  });
	
	dataView_Flowchart_Move("center", 1);
}

function dataView_Flowchart_Move(Offset, fast)
{
	var WindowWidth;
	if(Browser == "Explorer")
		WindowWidth = document.documentElement.clientWidth;
	else
		WindowWidth = window.innerWidth;
		
	var FlowchartWidth = WindowWidth - 210 - 202;
	
	
	if(Offset == "center")
	{
		Offset = 0 - ((1720 - FlowchartWidth) / 2);
	}
	else if(Offset == "left")
	{
		Offset = 0;
	}
	else if(Offset == "right")
	{
		Offset = 0 - (1720 - FlowchartWidth);
	}
	
	if(fast == 1)
		$('FlowChart_Canvas_Topic').style.left = Offset + "px";
	else
		new Effect.Morph('FlowChart_Canvas_Topic', {style:'left:'+Offset+'px'});
		
}

var DragScrollable = Class.create();
DragScrollable.prototype = {
  initialize: function(element) {
    this.element = $(element);
    this.active = false;
    this.scrolling = false;

    this.element.style.cursor = 'pointer';

    this.eventMouseDown = this.startScroll.bindAsEventListener(this);
    this.eventMouseUp   = this.endScroll.bindAsEventListener(this);
    this.eventMouseMove = this.scroll.bindAsEventListener(this);

    Event.observe(this.element, 'mousedown', this.eventMouseDown);
  },
  destroy: function() {
    Event.stopObserving(this.element, 'mousedown', this.eventMouseDown);
    Event.stopObserving(document, 'mouseup', this.eventMouseUp);
    Event.stopObserving(document, 'mousemove', this.eventMouseMove);
  },
  startScroll: function(event) {
    this.startX = Event.pointerX(event);
    this.startY = Event.pointerY(event);
    if (Event.isLeftClick(event) &&
        (this.startX < this.element.offsetLeft + this.element.clientWidth) &&
        (this.startY < this.element.offsetTop + this.element.clientHeight)) {
      this.element.style.cursor = 'move';
      Event.observe(document, 'mouseup', this.eventMouseUp);
      Event.observe(document, 'mousemove', this.eventMouseMove);
      this.active = true;
      Event.stop(event);
    }
  },
  endScroll: function(event) {
    this.element.style.cursor = 'pointer';
    this.active = false;
    Event.stopObserving(document, 'mouseup', this.eventMouseUp);
    Event.stopObserving(document, 'mousemove', this.eventMouseMove);
    Event.stop(event);
  },
  scroll: function(event) {
    if (this.active) {
      this.element.scrollTop += (this.startY - Event.pointerY(event));
      this.element.scrollLeft += (this.startX - Event.pointerX(event));
      this.startX = Event.pointerX(event);
      this.startY = Event.pointerY(event);
    }
    Event.stop(event);
  }
}