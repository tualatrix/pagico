//document.oncontextmenu=nomenu;
window.onerror=ignoreError;

function ignoreError()
{
	return true;
}

function disableSelection(target){
if (typeof target.onselectstart!="undefined") //IE route
	target.onselectstart=function(){return false};
else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
	target.style.MozUserSelect="none";
else //All other route (ie: Opera)
	target.onmousedown=function(){return false}
target.style.cursor = "default";
}

String.prototype.trim = function() { return this.replace(/^\s+|\s+$/, ''); };
/*
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};

BrowserDetect.init();

var Platform=BrowserDetect.OS;
var Browser=BrowserDetect.browser;
*/
var Platform = "Mac";
var Browser = "Safari";

var dashboardChartView;
var SideBarModules = new Array();
SideBarModules[0] = "QuickNotes_SideBar";
SideBarModules[1] = "SideBarGroup_Tasks";
SideBarModules[2] = "QuickAccess_SideBar";

function UpdateSideBar(idOverride)
{	
	if(Status_CurrentID)
	{
		
		if($('QuickAccess_Item_'+Status_CurrentID))
		{
			$('QA_Item_'+Status_CurrentID).className = "SideBarItem SideItemSelected_Label";
			$('QuickAccess_Item_'+Status_CurrentID).className = "QuickAccess_Item SideItemSelected";
		}
		
		xajax_SideBar_GetTasks(Status_CurrentID);
		return;
	}
	
	if(idOverride)
		xajax_SideBar_GetTasks(idOverride);
	else
		xajax_SideBar_GetTasks();
	
}

function switchTo(UID, finalAttempt, Password, options) {

	var objectType = UID.substring(0,1);
	if(!options)	options = "";
	//alert(options);
	
	if(inInbox(UID)) {
		Goto(1, 0, '', '', '', options);
	}
	else {
		
		if(objectType == "T") {
			//Goto(MainTabID, SubTabID, Parameter, Password, NaviPath, options)
			//Goto(2, -1, UID, Password, "", options);
			
			SwitchTopic(UID, Password, "", options);
		}
		else if(objectType == "C") {
			//Goto(3, -1, UID, Password, "", options);
			SwitchContact(UID, Password, "", options);
		}
		else {
			
			//unknown type
			if(!finalAttempt)
				xajax_SwitchTo(UID);
			else
				alert("Unknown object type: " + UID);
		}
	}
	
}

function SwitchTopic(TopicID, Password, NaviPath, options)
{
	if(!NaviPath)	NaviPath = "";
	
	Goto(2, -1, TopicID, Password, NaviPath, options);
	Status_CurrentID = TopicID;
	
	UpdateSideBar();
	
	toggleContainerTools(true);
}

function SwitchContact(ContactID, Password, NaviPath, options)
{
	Goto(3, -1, ContactID, Password, NaviPath, options);

	Status_CurrentID = ContactID;
	
	UpdateSideBar();
	
	toggleContainerTools(true);
	//setTimeout("xajax_DisplaySpecialPanel('"+ContactID+"');", 500);
}

function SwitchTag(Tag)
{
	Goto(2, 0, Tag);
}
  
function nomenu()   
{   
	return false;
}

function relocateClipping(clippingID) {
	if(!clippingID)	clippingID = "Clipping_1";
	
	var clippingItem = $(clippingID);
	if(!clippingItem)	return;
	
	var WindowHeight, WindowWidth;
	if(Browser == "Explorer")
	{
		WindowWidth = document.documentElement.clientWidth;
		WindowHeight = document.documentElement.clientHeight;
	}
	else
	{
		WindowWidth = window.innerWidth;
		WindowHeight = window.innerHeight;
	}
	var newStyle = "";
	//x axis

	var poLeft = clippingItem.style.left.substring(0, clippingItem.style.left.length - 2) - 0;
	var poTop = clippingItem.style.top.substring(0, clippingItem.style.top.length - 2) - 0;

	if(poLeft < 0) {
		newStyle = newStyle + "left: 10px;";
	}
	else if(poLeft + clippingItem.getWidth() >= WindowWidth){
		newStyle = newStyle + "left: "+(WindowWidth - clippingItem.getWidth() - 10) + "px;";
	}
	
	//y axis
	var bottomY = poTop + clippingItem.getHeight();
	var delta = bottomY - WindowHeight;
	if(delta > 0) {
		newStyle = newStyle + 'top: '+(WindowHeight - clippingItem.getHeight() - 10)+'px;';
	}
	
	if(newStyle)	new Effect.Morph(clippingID, {style: newStyle, duration:0.2});
	
}

var ClippingInterval;
var CurrentClipping;
function ClipIt(Value, Type, CursorX, CursorY, DefaultValue)
{
	//alert(CursorY);
	var WindowHeight, WindowWidth;
	if(Browser == "Explorer")
	{
		WindowWidth = document.documentElement.clientWidth;
		WindowHeight = document.documentElement.clientHeight;
	}
	else
	{
		WindowWidth = window.innerWidth;
		WindowHeight = window.innerHeight;
	}
		
		
	if(!document.getElementById('Clipping_1'))
	{
		var newdiv = document.createElement('div');
		newdiv.setAttribute('id', 'Clipping_1');
		
		newdiv.className = 'ClippingItem';
		newdiv.style.visibility = 'hidden';
		
		document.body.appendChild(newdiv);
		
		disableSelection(document.getElementById('Clipping_1'));

	}
	
	
	if(!DefaultValue)	DefaultValue = "";
	
	if($('Clipping_1').style.display != 'none')
	{
		
		if(Value + "," + Type+","+DefaultValue == CurrentClipping)
		{
			Effect.Fade('Clipping_1', {duration:0.2});
			CurrentClipping = "";
			return;
		}
		else
		{
			$('Clipping_1').style.display = 'none';
		}
	}

	if(CursorY + 250 > WindowHeight)
	{
		CursorY = WindowHeight - 250;
		CursorX = CursorX + 10;
	}
	else
	{
		CursorX = CursorX - 100;
		//try to center the panel
	}
	
	if(CursorX + 315 > WindowWidth)	CursorX = WindowWidth - 315;
		
	
	$('Clipping_1').style.left = CursorX + 'px';
	$('Clipping_1').style.top = CursorY + 12 + 'px';
	
	CurrentClipping = Value + "," + Type+","+DefaultValue;
	//alert(CurrentClipping);
	xajax_LoadClipping(Value, Type, DefaultValue);
	
	//setTimeout("new Draggable('Clipping_1', {handle: 'ClippingItem_Header'});", 1000);
	
	$('Clipping_1').style.visibility = 'visible';
	//$('Clipping_1').style.display = 'block';
	//setTimeout("Effect.BlindDown('Clipping_1', {duration:0.2});", 100);
}

function ClippingItem_SelectColor(colorID) {
	
	for(i = 0; i<= 7; i++) {
		
		if(i != colorID) {
			document.getElementById('ClippingItem_1_ColorSelection_'+i).innerHTML = "";
		}
		else {
			document.getElementById('ClippingItem_1_ColorSelection_'+i).innerHTML = "&#215;";
		}
		
	}
	
	document.getElementById('ClippingItem_ColorSelection').value = colorID;
}

function AdvPicker2_Pick(TargetID)
{
	//load the lists for the selected target, if it's a topic
	if(TargetID.substring(0, 1) == "T")
		xajax_AdvPicker2_Process(TargetID, document.getElementById('AdvPicker2_SourceID').value);
	else if(TargetID.substring(0, 1) == "C")
		xajax_AdvPicker2_ToList(TargetID, document.getElementById('AdvPicker2_SourceID').value);
		
	
	//or, if it's a contact profile, add the task and jump to the final screen.
	
}

function AdvPicker2_NextSlide()
{
	$('Clipping_1_Canvas').morph('left:-292px', {duration:0.5});
}

function UpdateAdvPicker(status)
{
	var AdvPickerSelected = document.getElementById('AdvPickerSelected');
	
	if(status)
		AdvPickerSelected.innerHTML ++;
	else
		AdvPickerSelected.innerHTML --;
		
	var confirmButton = document.getElementById('Clipping_1_ConfirmButton');
	if(AdvPickerSelected.innerHTML <= 0) {
		//0 selected
		AdvPickerSelected.innerHTML = 0;
		confirmButton.disabled = true;
	}
	else {
		confirmButton.disabled = false;
	}
}

function AdvPickerFilter(criteria, targetElement)
{
	
	if(!targetElement)	targetElement = 'Clipping_AdvPicker_Container';
	
	var itemContainer = document.getElementById(targetElement);
	var item, itemUID;
	if(!itemContainer)	return false;
	
	var items = itemContainer.getElementsByTagName("SPAN");
	
	for(i=0;i<items.length;i++)
	{
		item = items[i];
		if(item.className != "Clipping_AdvPicker_Item" && item.className != "Clipping_AdvPicker_Item_disabled")	continue;
		
		if(item.title.toUpperCase().indexOf(criteria.toUpperCase()) >= 0) {
			item.style.display = "block";
		}
		else {
			itemUID = item.id.substring(item.id.indexOf('_') + 1);
			
			if(!document.getElementById(itemUID).checked) {
				//document.getElementById(itemUID).checked = false;
				
				//UpdateAdvPicker(false);
				//minus one in the status bar
				
				
				item.style.display = "none";
			}
			
		}
	}
	
}

function DisposeClipping()
{
	if(!$('Clipping_Timer')||$('Clipping_1').style.display == 'none')
	{
		clearInterval(ClippingInterval);
		return;
	}
	
	var Current = $('Clipping_Timer').innerHTML;
	if(Current <= 1)
	{
		Effect.Fade("Clipping_1", {duration:0.2});
		clearInterval(ClippingInterval);
		return;
	}
	
	$('Clipping_Timer').innerHTML = Current - 1;
}

function MarkTask(TaskID)
{
	//visually handles the action
	//TODO - marking tasks that are being shown in the sidebar will not work in the first place!!
	var markDone = 1;

	if($('Task_'+TaskID+'_SB'))
	{
		//if the task is listed in the sidebar, always mark it as done.
		//$('Task_'+TaskID+'_SB_CheckBox').className = 'Task_Checkbox_SB Status_Box SelectedStatus';
		$('Task_'+TaskID+'_SB').select('.chartView_colorBox')[0].addClassName('chartView_colorBox_checked');
		
		Effect.BlindUp('Task_'+TaskID+'_SB', {duration:0.3});
	}
	
	if($('Task_MI_'+TaskID))
	{
		//if the task is currently in view
		var checkboxItem = $('Task_MI_'+TaskID).select('.chartView_colorBox')[0];
		
		if(!checkboxItem.hasClassName('chartView_colorBox_checked'))
		{
			markDone = 1;

			//$('Task_'+TaskID+'_MI_CheckBox').className = 'Status_Box SelectedStatus';
			//$('Task_'+TaskID+'_MI_CheckBox').addClassName('SelectedStatus');
			checkboxItem.addClassName('chartView_colorBox_checked');
			
			if($('Task_'+TaskID+'_MI_DueDate')) {
				
				$('List_Display_'+TaskID).addClassName("FinishedTask");
				
				
				if($('Task_'+TaskID+'_MI_DueDate').innerHTML.length > 1) {
					
					//is a task?
					
					if($('Task_'+TaskID+'_MI_Title'))
						$('Task_'+TaskID+'_MI_Title').className = 'ListItem_Caption Todo_Date_Done';
					
					$('Task_'+TaskID+'_MI_DueDate').className = 'Todo_Date_Done';
					$('Task_'+TaskID+'_MI_StartDate').className = 'TopicListTable_DateCol Todo_Date_Done';
					
				}
			}

		}
		else
		{
			markDone = 0;
			
			//$('Task_'+TaskID+'_MI_CheckBox').removeClassName('SelectedStatus');
			checkboxItem.removeClassName('chartView_colorBox_checked');
			
			if($('Task_'+TaskID+'_MI_DueDate')) {
				
				$('List_Display_'+TaskID).className = "";
				
				//if($('Task_'+TaskID+'_MI_DueDate').innerHTML != "") {
					
					//is a task?
					
					if($('Task_'+TaskID+'_MI_Title'))
						$('Task_'+TaskID+'_MI_Title').className = 'ListItem_Caption';
					
					$('Task_'+TaskID+'_MI_DueDate').className = 'Todo_Date';
					$('Task_'+TaskID+'_MI_StartDate').className = 'TopicListTable_DateCol';
					
				//}
			}
			
		}
	}
	
	if($('Task_'+TaskID+'_PT'))
	{
		var checkboxItem = $('Task_'+TaskID+'_PT').select(".chartView_colorBox")[0];
		//if the task is a profile task
		if(!checkboxItem.hasClassName('chartView_colorBox_checked'))
		{
			markDone = 1;
			checkboxItem.addClassName('chartView_colorBox_checked');
			$('Task_'+TaskID+'_PT_DueDate').className = 'ProfileTask_DueDate Todo_Date_Done';
		}
		else
		{
			markDone = 0;
			
			checkboxItem.removeClassName('chartView_colorBox_checked');
			$('Task_'+TaskID+'_PT_DueDate').className = 'ProfileTask_DueDate Todo_Date';
		}
	}
	
	if($('Task_'+TaskID+'_DB'))
	{
		var checkboxItem = $('Task_'+TaskID+'_DB').select(".chartView_colorBox")[0];
		
		//if the task is listed in the dashboard
 		if(!checkboxItem.hasClassName('chartView_colorBox_checked'))
		{
			markDone = 1;

			checkboxItem.addClassName('chartView_colorBox_checked');
		}
		else
		{
			markDone = 0;
			
			checkboxItem.removeClassName('chartView_colorBox_checked');
		}
	}
	
	if($('dataView_Item_AuthorTag_'+TaskID))	$('dataView_Item_AuthorTag_'+TaskID).hide();
	
	xajax_MarkTask(TaskID, markDone);
}

function ResetSearch(KeepText)
{
	SR_SelectedAction = "";
	$('SearchResults').setOpacity(1);
	//resets the opacity value of the search result menu
	
	Effect.Fade('SearchResults', {duration:0.1, queue: 'end'});
	setTimeout("$('SideBar').style.visibility = 'visible';", 210);
	
	if(!KeepText)
	{
		if(Browser=="Safari")
			$('SearchBox').value='';
		else
			$('SearchBox').value = SearchPrompt;
		
		$('SearchBox').blur();
	}
}

var OnKeyRequestBuffer = 
    {
        bufferText: false,
        bufferTime: 150,
        
        modified : function(strId)
        {
                setTimeout('OnKeyRequestBuffer.compareBuffer("'+strId+'","'+xajax.$(strId).value+'");', this.bufferTime);
        },
        
        compareBuffer : function(strId, strText)
        {

            if (strText == xajax.$(strId).value && strText !== this.bufferText)
            {
                this.bufferText = strText;
                OnKeyRequestBuffer.makeRequest(strId);
            }
        },
        
        makeRequest : function(strId)
        {
            StartSearch(xajax.$(strId).value);
			this.bufferText = false;
        }
    }

function FocusOnSearch()
{
	$('SearchBox').focus();
}

function StartSearch(Keyword)
{
	if(!Keyword)	return;
	SR_NextIndex = null;
	//document.getElementById('Search_Indicator').style.display = 'block';
	//document.getElementById('x_SearchResults').innerHTML = "<p align='center'><img src='/img/App_GUI/Misc/indicator_6.gif' /></p>";
	
	//Effect.Fade('SideBar', {duration:0.2});
	$('SideBar').style.visibility = 'hidden';
	setTimeout("document.getElementById('SearchResults').style.display = 'block';", 210);
	//alert(Keyword);
	xajax_Search(Keyword);
}

function AddASticky_SideBar()
{
	xajax_AddSticky_SideBar(xajax.getFormValues('StickyForm'));
	setTimeout("document.getElementById('StickyForm').reset();", 500);
}

function ToggleQuickNotesSidebarForm(forceoff)
{
	if($('QuickNotes_Form_Sidebar').style.display != 'none')
	{
		if(forceoff)	return false;
		$('QuickNotes_Form_Sidebar').style.display = 'none';
		$('QuickNotes_Form_Sidebar_Finished').style.display = 'block';
		$('QuickNotes_Form_Sidebar').reset();
	}
	else
	{
		$('QuickNotes_Form_Sidebar').style.display = 'block';
		$('QuickNotes_Form_Sidebar_Finished').style.display = 'none';
		setTimeout("document.getElementById('QuickNotes_SideBar_TA').focus();", 50);
	}
}
var searchCompleteDelay = null;

function searchCompleted() {
	
	if(Status_CurrentID) {
		
		var searchResults = $('x_SearchResults').select('.SRItem');
		
		for(i=0;i<searchResults.length;i++) {
			new Draggable(searchResults[i].id, {ghosting:true, revert:'failure', handle:'SRIcon'});
		}
		
		Droppables.add('SegmentsContainer', {accept:'SRItem', hoverclass:'x_Content_hover', containment:'x_SearchResults', greedy:true, onDrop:function(element){xajax_dataView_LinkFrom(element.id, Status_CurrentID)}});
	}
	else {
		Droppables.remove('x_Content');
	}
}

function NewTopic()
{
	xajax_Topic_AddNew();
}

function NewProfile()
{
	xajax_Contact_AddNew();
}

function Clipboard_Copy(text2copy) {
  if (window.clipboardData) {
    window.clipboardData.setData("Text",text2copy);
  } else {
    var flashcopier = 'flashcopier';
    if(!document.getElementById(flashcopier)) {
      var divholder = document.createElement('div');
      divholder.id = flashcopier;
      document.body.appendChild(divholder);
    }
    document.getElementById(flashcopier).innerHTML = '';
    var divinfo = '<embed src="/themes/clipboard.swf" FlashVars="clipboard='+escape(text2copy)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
    document.getElementById(flashcopier).innerHTML = divinfo;
  }
}

function ShowAbout()
{
	if($('MainArea'))
		Goto(4, 2);
	else
		alert(aboutString);
}

function UploadCancel()
{
	//alert("FTP Upload Cancel detected.");
	xajax_CancelUpload();
}

function UploadComplete()
{
	alert("FTP Upload Complete detected.");
}

function ToggleSideBarGroup(SideBarID)
{
	
	if($('SideBarGroup_'+SideBarID).className == 'SideBarGroup_Expanded')
	{
		$('SideBarGroup_'+SideBarID).className = 'SideBarGroup_Collapsed';
		//Effect.BlindUp('SideBarGroup_'+SideBarID+'_Content', {duration:0.2});
		$('SideBarGroup_'+SideBarID+'_Content').style.display = 'none';
	}
	else
	{
		$('SideBarGroup_'+SideBarID).className = 'SideBarGroup_Expanded';
		//Effect.BlindDown('SideBarGroup_'+SideBarID+'_Content', {duration:0.2});
		$('SideBarGroup_'+SideBarID+'_Content').style.display = 'block';
	}
	
	SaveGroupStatus();
}

function ToggleMainGroup(GroupID)
{
	if($('SideBarGroup_'+GroupID+'_Content').style.display == 'none')
	{
		$('SideBarGroup_'+GroupID+'_Content').style.display = 'block';
		$('SideBarGroup_'+GroupID).className = 'MainGroup_Expanded';
	}
	else
	{
		$('SideBarGroup_'+GroupID+'_Content').style.display = 'none';
		$('SideBarGroup_'+GroupID).className = 'MainGroup_Collapsed';
	}
	
	SaveGroupStatus();
}

function SaveGroupStatus()
{
	
	var GroupStatus = "";
	//Save group status

	if($('SideBarGroup_Dashboard_Content').style.display == 'none')
		GroupStatus = GroupStatus + "A";
	else
		GroupStatus = GroupStatus + "B";

	if($('SideBarGroup_Topics_Content') && $('SideBarGroup_Topics_Content').style.display == 'none')
		GroupStatus = GroupStatus + "A";
	else
		GroupStatus = GroupStatus + "B";
	
	if($('SideBarGroup_Contacts_Content') && $('SideBarGroup_Contacts_Content').style.display == 'none')
		GroupStatus = GroupStatus + "A";
	else
		GroupStatus = GroupStatus + "B";

	if($('SideBarGroup_Channels_Content').style.display == 'none')
		GroupStatus = GroupStatus + "A";
	else
		GroupStatus = GroupStatus + "B";


	if($('SideBarGroup_Tasks_Content').style.display == 'none')
		GroupStatus = GroupStatus + "A";
	else
		GroupStatus = GroupStatus + "B";
		
	if($('SideBarGroup_Collections_Content').style.display == 'none')
		GroupStatus = GroupStatus + "A";
	else
		GroupStatus = GroupStatus + "B";
	
	if($('SideBarGroup_QuickAccess_Content').style.display == 'none')
		GroupStatus = GroupStatus + "A";
	else
		GroupStatus = GroupStatus + "B";
	
	
	xajax_SideBar_SaveGroupStatus(GroupStatus);
}

function addslashes(str) {
	str=str.replace(/\\/g,'\\\\');
	str=str.replace(/\'/g,'\\\'');
	str=str.replace(/\"/g,'\\"');
	str=str.replace(/\0/g,'\\0');
	return str;
}


function OpenFile(path)
{
	//document.location.href = 'http://pagico.local/'+path;
	document.location.href = '#pagicoLaunch://'+path;
}

function SaveFile(path)
{
	document.location.href = '#pagicoSave://'+path;
}


function convertWord(type, content) {
	switch (type) {
		// Gets executed before the built in logic performes it's cleanups
		case "before":
			//content = content.toLowerCase(); // Some dummy logic
			break;

		// Gets executed after the built in logic performes it's cleanups
		case "after":
			//content = content.toLowerCase(); // Some dummy logic
			break;
	}

	return content;
}

function ResetURL()
{
	document.location.href = '#reset';
}

var HideBottomMenu_Timer;
var BottomMenu_QuickNotes_Focused = false;

function ToggleBottomMenu(forceoff)
{
	
	if($('BottomMenu_SyncMenu').style.display != 'none')	ToggleBottomSyncMenu(1);
	
	if($('BottomMenu_AddMenu').style.display == 'none' && !forceoff)
	{
		if($('QuickStart_Arrow') && $('QuickStart_Arrow').style.display != 'none') $('QuickStart_Arrow').style.display = 'none';
		
		$('BottomMenu_AddMenu').style.display = 'block';
		
		$('BottomMenu_AddMenu_Button').className = 'BottomMenu_Btn BottomMenu_Btn_active';
	}
	else
	{
		if(BottomMenu_QuickNotes_Focused) return;
		
		$('BottomMenu_AddMenu').style.display = 'none';
		$('BottomMenu_AddMenu_Button').className = 'BottomMenu_Btn';
	
		ToggleQuickNotesSidebarForm(1);
		
		$('QuickNotes_SideBar_TA').rows = 2;
		$('QuickNotes_Form_Sidebar').reset();
	}
}
function ToggleBottomSyncMenu(forceoff)
{
	if($('BottomMenu_AddMenu').style.display != 'none')	ToggleBottomMenu(1);
		
	//need to preserve the current icon
	var customClass = $('MenuBtn_Sync').className.substring($('MenuBtn_Sync').className.lastIndexOf(' '));
	
	if($('BottomMenu_SyncMenu').style.display == 'none' && !forceoff)
	{
		//BottomMenu_Btn Menu_Sync
		//BottomMenu_Btn Menu_Sync_Working
		//BottomMenu_Btn Menu_Sync_Done
		
		
		//alert(customClass);
		
		$('BottomMenu_SyncMenu').style.display = 'block';
		$('MenuBtn_Sync').className = 'BottomMenu_Btn BottomMenu_Btn_active '+customClass;
	}
	else
	{
		$('BottomMenu_SyncMenu').style.display = 'none';
		$('MenuBtn_Sync').className = 'BottomMenu_Btn ' + customClass;
	}
}

function GetImported()
{
	xajax_GetImported();
}

function ResetIdleTimer()
{
	clearTimeout(IdleTimer);
	IdleTimer = setTimeout("document.location.href='/html/SignIn.php';", 1440000);
}

function NewInboxTask()
{
	var defaultDestination;
	if(Status_CurrentID)
		defaultDestination = Status_CurrentID;
	else
		defaultDestination = "";
	
	if(event)
		ClipIt('', 'NewTaskEx',  event.clientX, event.clientY + (window.pageYOffset?window.pageYOffset:document.body.scrollTop), defaultDestination);
	else
		ClipIt('', 'NewTaskEx',  250, 50, defaultDestination);
}

function ShowWelcome()
{
	window.open('/start/welcome.php', "Welcome to Pagico", "width=650, height=400, toobar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");	
}

function Trash(UID, quiet, callbackFunction, isRegularAction)
{
	var confirmPrompt = DeleteConfirmText;
	if(isRegularAction == 1)
		confirmPrompt = confirmPrompt + "\n" + regularAction;
	else
		confirmPrompt = confirmPrompt + "\n" + permanentAction;
		
	
	if(quiet != 1)
	{
		if(confirm(confirmPrompt))
		{
			if($('dataView_Item_'+UID)) {
				Effect.BlindUp('dataView_Item_'+UID, {duration:0.4});
				setTimeout("$('dataView_Item_"+UID+"').remove(); dataView_ResetMenus();", 500);
			}
			
			if($('ChannelList_Item_'+UID)) {
				
				Effect.BlindUp('ChannelList_Item_'+UID, {duration:0.4});
				setTimeout("$('ChannelList_Item_"+UID+"').remove();", 500);
				
			}
			
			xajax_trashItem(UID, callbackFunction);
		}
	}
	else
	{
		if($('dataView_Item_'+UID)) {
				Effect.BlindUp('dataView_Item_'+UID, {duration:0.4});
				setTimeout("$('dataView_Item_"+UID+"').remove(); dataView_ResetMenus();", 500);
		}

		xajax_trashItem(UID, callbackFunction);
	}
	
	return;
}

function emptyTrash() {
	if(confirm(emptyTrashConfirmText)) {
		
		toggleLoadingPanel();
		
		xajax_emptyTrash();
		
	}
}

Array.prototype.unique =
  function() {
    var a = [];
    var l = this.length;
    for(var i=0; i<l; i++) {
      for(var j=i+1; j<l; j++) {
        // If this[i] is found later in the array
        if (this[i] === this[j])
          j = ++i;
      }
      a.push(this[i]);
    }
    return a;
  };

var Duplicated=0;
function Duplicate(obj)
{
	if(Duplicated==1)	return;
	
	toggleLoadingPanel();
	
	obj.innerHTML = "Duplicating...";
	Duplicated = 1;

	xajax_Duplicate(Status_CurrentID);
}


function ToggleCollection(PageSetID)
{
	Effect.toggle('PageSet_'+PageSetID, 'BLIND', {duration:0.2});
	setTimeout("new Effect.ScrollTo('PageSet_Item_"+PageSetID+"', {duration:1});", 200);
}


function printScreen()
{
	xajax_printScreen($('x_Content').innerHTML, $('x_Content').className);
}

function showScreenPrint() {
	window.open('/html/printScreen.php', "Pagico", "width="+(window.innerWidth - 185)+", height=500, toobar=no, menubar=no, scrollbars=yes, resizable=yes, location=no, status=no");
}

function printCompleted()
{
	window.open('/database/Exported/', "Pagico", "width=1024, height=500, toobar=no, menubar=no, scrollbars=yes, resizable=yes, location=no, status=no");
}


function DisplayControls(ID)
{
	//Effect.toggle(ID+"_Box", "Blind", {duration:0.3, queue:{scope:'myscope', position:'end'}});
	//return;
	if(document.getElementById(ID+"_Box").style.display!="none")
	{
		if(document.getElementById(ID+"_Alternative"))
			document.getElementById(ID+"_Alternative").style.display='block';
			
		//document.getElementById(ID+"_Box").style.display="none";
		Effect.BlindUp(ID+'_Box', {duration:0.2});
	}
	else
	{
		if(document.getElementById(ID+"_Alternative"))
			document.getElementById(ID+"_Alternative").style.display='none';
			
		$(ID+"_Box").style.display="block";
		
		if($(ID+'_Box_Input'))	$(ID+'_Box_Input').focus();
		Effect.BlindDown(ID+'_Box', {duration:0.2});
	}
	//Element.scrollTo(ID+"_Box");
}

function doExport(Theme)
{
	DisplayControls('Export');
	toggleLoadingPanel();
	xajax_exportTopic(Status_CurrentID, Theme);
}

<!-- Begin
var text = "";
var previousSelection = "";
var currentlySelectedDOM = "";

function clearCurrentSelection() {
	text = (document.all) ? document.selection.createRange().text : document.getSelection();
	text.empty();
}

function verifyPopupIcon() {
	text = (document.all) ? document.selection.createRange().text : document.getSelection();
	text = new String(text).trim();
	
	if(!text || text.length < 3 || text.length > 50 || EditMode > 0) {
		setTimeout("previousSelection = '';", 500);
		resetPopupSelection();
	}
}

function showPopupIcon(e) { 
	
	//clearTimeout(clearPopupSelectionTimeout);
	
	text = (document.all) ? document.selection.createRange().text : document.getSelection();
	
	var offsetX = 0;

	if(text.anchorOffset <= text.focusOffset) //swipe from left to right
		movingToRight = true;
	else
		movingToRight = false;
		
	text = new String(text).trim();

	var targ;
	if (!e) var e = window.event;
	if (e.target) targ = e.target;
	else if (e.srcElement) targ = e.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;

	while(!targ.id) {
		targ = targ.parentNode;
	}
	
	if(!text || text.length < 3 || text.length > 50 || text == previousSelection || targ.tagName == "INPUT" || targ.tagName == "TEXTAREA" || targ.tagName == "FORM") {
		//clear the floating icon
		setTimeout("previousSelection = '';", 500);
		resetPopupSelection();
		return;
	}

	//alert(targ.id);
	
	currentlySelectedDOM = targ.id;
	/*
	if(targ.id.indexOf('Task') !== -1) {
		//it's a list item. show the Create an associated list
		$('popupSelection_Menu_Item_SubList').removeClassName('popupSelection_Menu_Item_Disabled');
	}
	else {
		//it's not a list item. hide the option
		$('popupSelection_Menu_Item_SubList').addClassName('popupSelection_Menu_Item_Disabled');
	}
	*/
	//setTimeout("verifyPopupIcon();", 200);

	previousSelection = text;



	//alert(targ.id);
	
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
	
	var iconTop = e.clientY - 13;
	var menuTop = e.clientY - 13 - 35;
	
	if(movingToRight) {
		
		var iconLeft = e.clientX + 10;
		var menuLeft = e.clientX + 10;
		
		if(iconLeft + 24 >= WindowWidth) {
			iconLeft = e.clientX - 24;
			iconTop = e.clientY + 10;
			
			menuLeft = WindowWidth - 140 - 25;
			menuTop += 20;
		}
		
		if(iconTop + 24 + 5 > WindowHeight) {
			iconTop = e.clientY - 24 - 10;
		}
		
		$('popupSelection_icon').className = '';
		
	}
	else {
		
		var iconLeft = e.clientX - 10 - 24;
		var menuLeft = e.clientX - 10 - 140;
		
		if(iconLeft <= 10) {
			iconLeft = e.clientX;
			iconTop = e.clientY + 10;
			
			menuLeft = e.clientX;
			menuTop = e.clientY - 35;
		}
		
		$('popupSelection_icon').className = 'popupSelection_icon_left';
	}
	
	if(menuLeft < 10)	menuLeft = 10;
	if(menuLeft + 140 + 10 > WindowWidth) menuLeft = WindowWidth - 140 - 15;
	
	if(menuTop < 5)	menuTop = 5;
	
	$('popupSelection_icon').style.left = iconLeft + 'px';
	$('popupSelection_Menu').style.left = menuLeft + 'px';
	
	$('popupSelection_icon').style.top = iconTop + 'px';
	$('popupSelection_Menu').style.top = menuTop + 'px';
	
	
	$('popupSelection_icon').style.display = 'block';
	
	//alert(currentlySelectedDOM);
//document.theform.text.value = text;
return true;
}

function adjustPopupMenuPosition(menuID) {
	
	if(!menuID)	menuID = 'popupSelection_Menu';

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
	
	var menuTop = $(menuID).style.top;
	
	var menuTop = menuTop.substring(0, menuTop.indexOf("p")) - 0;

	if(menuTop + $(menuID).clientHeight > WindowHeight) {
		//alert("menuTop: "+menuTop);
		//alert('Current Bottom: '+ (menuTop + $('popupSelection_Menu').clientHeight) + ' Window Height: '+WindowHeight);
		
		menuTop = WindowHeight - $(menuID).clientHeight - 10;
		
		new Effect.Morph(menuID, {style: "top:"+menuTop+"px;", duration:0.2});
	}
	
	return true;
}

var popupMenuTimeout = null;

function showPopupMenu(textSelection, posX, posY) {
	
	if(posX > 0 && posY > 0) {
		//reposition the menu accordingly...
		$('popupSelection_Menu').style.top = (posY - 13 - 30) + 'px';
		$('popupSelection_Menu').style.left = (posX - 70) + 'px';
	}
	
	xajax_loadPopupSelection_Menu(textSelection);
	
	$('popupSelection_icon').style.display = 'none';
	Effect.Appear('popupSelection_Menu', {duration:0.2});
	
	setTimeout("adjustPopupMenuPosition();", 300);
	
}

function resetPopupSelection(keepIcon) {

	if(!$('popupSelection_Menu'))	return false;
	
	$('popupSelection_Menu').style.display = 'none';
	$('General_Popup_Menu').style.display = 'none';
	if(keepIcon != 1)
		$('popupSelection_icon').style.display = 'none';
	else
		$('popupSelection_icon').style.display = 'block';
		
}

document.onmouseup = showPopupIcon;
if (!document.all) document.captureEvents(Event.MOUSEUP);
//  End -->

function clipToLink(type) {
	//toggleLoadingPanel();
	xajax_clipToLink(currentlySelectedDOM, previousSelection, type);
}




function Channels_setItemShared(channelID, itemUID, action) {
	//alert("Trying to set "+itemUID+" to be "+action+" in channel "+channelID);
	xajax_Channels_setItemShared(channelID, itemUID, action);
	
}

function Channels_takeOwnership(itemUID) {
	toggleLoadingPanel();
	xajax_Channels_takeOwnership(itemUID);
}

//channel sync
//var channels as new Array;

//list all channels here
//=====================================================================================
var syncQueue = new Array();
var startSyncDelay = null;

function syncQueue_Add(channelUID) {
	
	
	//if(localAutoRestartTimeout) clearTimeout(localAutoRestartTimeout);
	//if(serverAutoRestartTimeout) clearTimeout(serverAutoRestartTimeout);
	
	//alert("Trying to add channel ("+channelUID+") to the queue ("+syncQueue.length+").");
	
	if(isOffline == true)	return false;
	//skip if the client is currently offline.
	
	syncQueue[syncQueue.length] = channelUID;
	
	syncQueue = array_unique(syncQueue);
	//removes duplicates

	//alert('adding '+channelUID);
	
	
	if($('Sync_Status').hasClassName('Menu_Sync_Done') || $('inboxSync_Status').hasClassName('Menu_Sync_Done')) {
		
		resetSyncIcons();
		
	}
	
	if($('Sync_Status').className == "Tab_SyncStatus" && $('inboxSync_Status').className == "Tab_SyncStatus" && syncQueue.length == 1)
		startSyncDelay = setTimeout("channelSync();", 500);
	
}
var autoSyncTimeout = null;

function resetSyncIcons(autoGoing) {
	
	if(autoSyncTimeout)
		clearTimeout(autoSyncTimeout);
	
	//alert("resetting icons ("+autoGoing+")");
	
	var baseClass = 'BottomMenu_Btn';
	if($('BottomMenu_SyncMenu').style.display != 'none') {
		baseClass = 'BottomMenu_Btn BottomMenu_Btn_active';
	}
	
	$('Sync_StatusMessage').innerHTML = "Sync with the Cloud";
	
	$('Sync_Status').className = "Tab_SyncStatus";
	$('inboxSync_Status').className = "Tab_SyncStatus";
	
	$('MenuBtn_Sync').className = baseClass + " Menu_Sync";
	
	//ToggleBottomSyncMenu(1);
	if(autoGoing > 0) {
		//alert("auto-going is enabled, queue has: "+syncQueue.length);
		channelSync();
	}
	
}

//this function starts syncing with the first one in the sync queue
function channelSync() {
	
	if($('Sync_Status').hasClassName("Menu_Sync_Working") || $('inboxSync_Status').hasClassName("Menu_Sync_Working")) {
		//prevents simutaneous syncs
		//alert('cancel out simultaneous syncs');
		
		return false;
	}

	
	//alert('ready to sync, currently '+syncQueue.length+' in queue.');
	
	if(syncQueue.length > 0) {
		
		syncChannel(syncQueue.shift());
		//removes itself from the channels array
	}
	else {
		SyncFinished(1, "There's nothing to sync right now.");
		monitorDaemonInterval = setInterval("monitorDaemon();", 90 * 1000);
		//attempt to start the monitorDaemon;
	}
}

function syncChannel(channelUID) {
	
	//alert("Trying to sync with "+channelUID);
	
	var baseClass = 'BottomMenu_Btn';
	if($('BottomMenu_SyncMenu').style.display != 'none') {
		baseClass = 'BottomMenu_Btn BottomMenu_Btn_active';
	}
	
	//detects if it's available to sync	
	$('Sync_StatusMessage').innerHTML = "Syncing in progress...";
	
	if(inInbox(channelUID))
		$('inboxSync_Status').className = "Tab_SyncStatus Menu_Sync_Working";
	else
		$('Sync_Status').className = "Tab_SyncStatus Menu_Sync_Working";
	
	
	$('MenuBtn_Sync').className = baseClass + " Menu_Sync_Working";
	$('MenuBtn_ChannelSync').className = 'BottomMenu_AddMenu_Item_Disabled';
	
	//initiates the xajax sync process
	//setTimeout("xajax_Channels_Sync('"+channelUID+"');", 1000);
	xajax_Channels_Sync(channelUID);
	
}

function array_unique(ar){
  var sorter = {};
  for(var i=0,j=ar.length;i<j;i++){
    sorter[ar[i]] = ar[i];
  }
  ar = [];
  for(var i in sorter){
    ar.push(i);
  }
  return ar;
}

var channelMonitorTimestamp = 0;
function startChannelsMonitor() {

	channelMonitorTimestamp = new Date().getTime();
	setTimeout("xajax_Channels_Monitor();", 500);
	
}

var monitorDaemonInterval = setInterval("monitorDaemon();", 90 * 1000);
//the monitorDaemon kicks in every two minutes.

function monitorDaemon() {
	
	var currentTimestamp = new Date().getTime();
	
	if((currentTimestamp - channelMonitorTimestamp) >= 60 * 1000)
		startChannelsMonitor();
		
}

//--------------------- Synchronization -------------------------
function SyncFinished(result, value) {
	
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	if(minutes < 10) minutes = "0" + minutes;
	
	$('Sync_StatusMessage').innerHTML = "Last synced at " + hours + ":" + minutes + ".";
	$('MenuBtn_ChannelSync').className = 'BottomMenu_AddMenu_Item';
	
	if($('inboxSync_Status').hasClassName('Menu_Sync_Working'))
		var inboxSync = true;
	else
		var inboxSync = false;
	
	if(!value)
		value = "";
	else
		value = "<br /><br />" + value;
	
	var baseClass = 'BottomMenu_Btn';
	if($('BottomMenu_SyncMenu').style.display != 'none') {
		baseClass = 'BottomMenu_Btn BottomMenu_Btn_active';
	}
	
	switch(result) {
		case 1:
			
			//alert("Sync finished, now the queue has: "+syncQueue.length);
			
			if(syncQueue.length > 0) {
				//there's other channels waiting in queue
				resetSyncIcons(1);
			}
			else {
				//finished successfully
				$('Sync_StatusMessage').innerHTML = "<strong>Synced successfully.</strong>" + value;
				//$('Sync_StatusMessage').innerHTML = "Last synced at " + hours + ":" + minutes + ".";

				if(inboxSync == true) {
					$('inboxSync_Status').className = "Tab_SyncStatus Menu_Sync_Done";
				}
				else {
					$('Sync_Status').className = "Tab_SyncStatus Menu_Sync_Done";
				}

				$('MenuBtn_Sync').className = baseClass + " Menu_Sync_Done";
				
				autoSyncTimeout = setTimeout("resetSyncIcons();", 10000);
				//resets the UI after 10 seconds
				
				setTimeout("startChannelsMonitor();", 3 * 1000);
				//re-start the monitoring services in five second;
			}
			
			break;
		case -1:
			//error
			$('Sync_StatusMessage').innerHTML = "<strong>Sync failed.</strong>" + value;
			
			if(inboxSync == true) {
				$('inboxSync_Status').className = "Tab_SyncStatus Menu_Sync_Error";
			}
			else {
				$('Sync_Status').className = "Tab_SyncStatus Menu_Sync_Error";
			}
			
			$('MenuBtn_Sync').className = baseClass + " Menu_Sync_Error";
			
			//clearTimeout(serverAutoRestartTimeout);
			//clearTimeout(localAutoRestartTimeout);
			//clears the auto-timed monitors when the sync failed.
			
			break;
		default:
			//reset icons
			$('Sync_Status').className = "Tab_SyncStatus";
			$('inboxSync_Status').className = "Tab_SyncStatus";
			
			$('MenuBtn_Sync').className = baseClass + " Menu_Sync";
	}
}

function refreshView(callback) {
	
	targetYOffset = $('x_Content').scrollTop;
	
	//var objectUID = null;
	if(Status_CurrentID) {
		//objectUID = Status_CurrentID;
		switchTo(Status_CurrentID);
	}
	else {
		Goto(Current_MainTabID, Current_SubTabID, Current_Parameter, '', Current_NaviPath);
	}
	
	if(callback) {
		setTimeout(callback, 500);
	}

}

function showUpdateIndicator(UIDsInvolved) {
	
	setTimeout("xajax_UINotify('Pagico - Channels', 'You have newly updated data.');", 500);

	//alert("I'm getting this: "+UIDsInvolved);
	if(!Status_CurrentID) {
		
		refreshView();
		//refresh the current view
		
		return;
	}
	
	if(EditMode > 0) {
		var listOfUIDs = new Array();
		var indicatorNeeded = false;

		listOfUIDs = UIDsInvolved.split(',');

		for(i=0;i<listOfUIDs.length;i++) {

			if(document.getElementById('dataView_Item_'+listOfUIDs[i])) {

				if(dataView_CurrentEditingItem == listOfUIDs[i])
					indicatorNeeded = true;
				else
					xajax_dataView_refreshItem(listOfUIDs[i], Status_CurrentID);
					//updates that specific dataObject item
					
			}

		}

		if(UIDsInvolved.indexOf(Status_CurrentID) >= 0)
			indicatorNeeded = true;

		if(indicatorNeeded == true) {
			cleanupCode = "";
			$('newDataIndicator').style.display = 'block';
		}
	}
	else {
		//switchTo(Status_CurrentID);
		refreshView();
		//reload the current view if nothing's in the edit mode
	}
	
}

function ToggleLock()
{
	if(document.getElementById('PageLock').style.display=='none')
	{
		//document.getElementById('LockButton').className="ActivatedLock";
		if(document.getElementById('LockButton').className=="ActivatedLock")
		{
			xajax_Topic_SetLock(Status_CurrentID, "");
		}
		else
		{
			//document.getElementById('PageLock').style.display = 'block';
			Effect.BlindDown('PageLock', {duration:0.2});
			setTimeout("document.getElementById('PageLock_Password1').focus();", 300);
		}
	}
	else
	{
		document.getElementById('PageLock').style.display = 'none';
	}
}

function SetLock()
{
	xajax_Topic_SetLock(Status_CurrentID, document.getElementById('PageLock_Password1').value);
	Effect.toggle('PageLock', 'Blind', {duration:0.2});
}

function VerifyPassword()
{
	if(document.getElementById('PageLock_Password1').value&&document.getElementById('PageLock_Password1').value==document.getElementById('PageLock_Password2').value)
	{
		document.getElementById('PageLock_Button').disabled = false;
	}
	else
	{
		document.getElementById('PageLock_Button').disabled = true;
	}
}

function adjustInnerContainer(finalAttempt) {

	var WindowHeight = window.innerHeight;	
	
	if($('PageControls')) {
		$('x_Content').style.height = (WindowHeight - 71 - 23) + 'px';
	}
	else {
		$('x_Content').style.height = (WindowHeight - 71) + 'px';
	}
	
	if(!$('SegmentsContainer_Inner')) return;
		
	var targetMinHeight = ($('SegmentsContainer_Inner').clientHeight + ($('x_Content').clientHeight - $('ActualContent').clientHeight) - 30);
	
	if(targetMinHeight < 150) targetMinHeight = 150;
	
	if($('x_Content').clientHeight - targetMinHeight < 100)
		targetMinHeight -= 100;
		//if the bottom is too close to the bottom of the screen
	
	$('SegmentsContainer_Inner').style.minHeight = targetMinHeight + 'px';	
	
	if(!finalAttempt && Math.abs($('x_Content').clientHeight - $('ActualContent').clientHeight) > 2)
		adjustInnerContainer(true);
}


function BackgroundSave(ID)
{
	
	//if(document.getElementById('Changed_'+ID).value==1)
	{

		//if(Safari3==1)
		{
			var content = tinyMCE.get('Segment_'+ID+'_Text').getContent();
			document.getElementById('Segment_'+ID+'_Text').value = content;
		}
		
		//xajax_SaveChanges(xajax.getFormValues('Segment_'+ID+'_Edit'), 1);
		xajax_dataView_Save(xajax.getFormValues('dataView_Item_'+ID+'_Edit'), 1);
		
		var dt = new Date();
		document.getElementById('SaveIndicator_'+ID).innerHTML = "Auto-Saved at "+dt.getHours()+":"+dt.getMinutes();

		//document.getElementById('Changed_'+ID).value = 0;
		
		//setTimeout("document.getElementById('SaveIndicator_"+ID+"').innerHTML = '';", 30*1000);
		//auto-hides this message after 30 seconds. doesn't seem to be necessary.
		
	}
	
}

function beep() {
	//Sound.play("/extras/beep.mp3");
	document.getElementById('snd_Beep').play();
}

function inInbox(itemUID) {
	if(itemUID.indexOf("-") == 5)
		return true;
	else
		return false
}

function goOnline() {
	
	if($('dataView_SharedStatus'))
		$('dataView_SharedStatus_blocker').style.display = 'none';
	
	if($('Sync_StatusMessage').innerHTML == Localized_OfflinePrompt)
		$('Sync_StatusMessage').innerHTML = "Sync with the Cloud";
		
	isOffline = false;
	
}

function goOffline() {
	
	if($('dataView_SharedStatus'))
		$('dataView_SharedStatus_blocker').style.display = 'block';
	
	var localization = new Localization();
	
	$('Sync_StatusMessage').innerHTML = localization.phrase["You are currently offline"];
	
	isOffline = true;
	
}


function adjustInputSize(objId) {
	
	var obj = $(objId);
	var minLength = 12, targetSize;
	
	if(!obj)	return false;

	targetSize = Math.round(obj.value.length * 1.3);
	
	if(targetSize < minLength)	targetSize = minLength;
	
	obj.size = targetSize;
	
}
function PlaySlideShow()
{
	window.open('/html/SlideShow.php?DataAddress='+Status_CurrentID, "Pagico", "width="+screen.width+", height="+screen.availHeight+", toobar=no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no");	
}

function toggleLoadingPanel(dismiss) {
	
	if($('Container').hasClassName('appLoading') || dismiss) {
		$('Container').removeClassName('appLoading');
	}
	else {
		$('Container').addClassName('appLoading');
	}
	
}

function mergeTasks() {
	
	if($('mergeTaskBtn').hasClassName("ToolBtn_Disabled"))	return false;
	
	if(confirm("All the completed single task items in the current view will be merged into one list.\n\nThis action cannot be undone.\n\nDo you wish to continue?")) {
		
		toggleLoadingPanel();
		
		if(!Status_CurrentID) {
			//alert("Merge tasks in Inbox");
			
			xajax_mergeCompletedTasks("Inbox");
		}
		else {
			xajax_mergeCompletedTasks(Status_CurrentID);
		}
		
	}
	
}

function toggleContainerTools(enable) {
	
	if(enable == true) {
		
		$('mergeTaskBtn').removeClassName("ToolBtn_Disabled").addClassName("ToolBtn_Enabled");
		
		$('foldAllBtn').removeClassName("ToolBtn_Disabled").addClassName("ToolBtn_Enabled");
		
		$('expandAllBtn').removeClassName("ToolBtn_Disabled").addClassName("ToolBtn_Enabled");
		
	}
	else {
		$('mergeTaskBtn').removeClassName("ToolBtn_Enabled").addClassName("ToolBtn_Disabled");
		
		$('foldAllBtn').removeClassName("ToolBtn_Enabled").addClassName("ToolBtn_Disabled");
		
		$('expandAllBtn').removeClassName("ToolBtn_Enabled").addClassName("ToolBtn_Disabled");
		
	}
	
}

//------------------ Custom Methods ------------------

Effect.Scroll = Class.create();
Object.extend(Object.extend(Effect.Scroll.prototype, Effect.Base.prototype), {
  initialize: function(element) {
    this.element = $(element);
    var options = Object.extend({
      x:    0,
      y:    0,
      mode: 'absolute'
    } , arguments[1] || {}  );
    this.start(options);
  },
  setup: function() {
    if (this.options.continuous && !this.element._ext ) {
      this.element.cleanWhitespace();
      this.element._ext=true;
      this.element.appendChild(this.element.firstChild);
    }

    this.originalLeft=this.element.scrollLeft;
    this.originalTop=this.element.scrollTop;

    if(this.options.mode == 'absolute') {
      this.options.x -= this.originalLeft;
      this.options.y -= this.originalTop;
    } else {

    }
  },
  update: function(position) {   
    this.element.scrollLeft = this.options.x * position + this.originalLeft;
    this.element.scrollTop  = this.options.y * position + this.originalTop;
  }
});


function myScrollTo(container, element) {
	
	container = $(container); 
	element = $(element); 
	
	var element_y = element.y ? element.y : element.offsetTop;
	
	//container.scrollTop=element_y-(document.all?0:container.offsetTop);

	new Effect.Scroll(container, {x:0, y:(element_y-(document.all?0:container.offsetTop))});

	return element;

}