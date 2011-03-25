//------------- Tag Explorer ---------------------
var FilterTag;
var SortedTags = new Array();
var TopEntryIndex = 0;
var TempID = 0;

var currentSelectedTag;

var PreviousLevel=0;
var initCode = "";

function Init_TopicList()
{
	FilterTag = "";
	SortedTags = new Array();
	TempID = 0;
	TopEntryIndex = 0;
	PreviousLevel=0;
	
	//Topics = new Array();
	//Topic_IDs = new Array();
	//Topic_Tags = new Array();
	SortedTags = new Array();
	//Topic_Dates = new Array();
	
	TempID = 0;
	
	currentSelectedTag = "";
	initCode = "";
}

function ResetTopicList()
{
	tagExplorer_ListView.init();
	tagExplorer_ListView.render();
	
	if(tagExplorer_ListView.visibleItems.length > 0)
	{
		$('TagExplorer').style.display = "block";
		$('x_List_OrderOptions').style.display = "block";
		
		$('x_TopicList_EmptyIndicator').style.display = 'none';
		
		if(initCode)	eval(initCode);
	}
	else
	{
		$('TagExplorer').style.display = "none";
		$('x_List_OrderOptions').style.display = "none";
		//$('TagExplorer_Status').style.display = "none";
		
		$('x_TopicList_EmptyIndicator').style.display = 'block';
	}
	
}

var Path;

function SwitchCategory(obj, NewTag, TagLevel, SkipSubTag)
{
	if(!TagLevel)	TagLevel = 0;


	//1. Change the look to "selected"

	var i=0, temp;
	
	Path = NewTag;
	
	while(temp = document.getElementById('SubFrame_'+TagLevel+'_'+i))
	{

		if(temp.className != 'SubTagItem')
		{
			temp.className = 'SubTagItem';
			break;
		}
		i++;
	}
	
	if(obj)	obj.className = 'SubTagItem_Selected';

	//2. Clear all deeper categories.
	
	var i=TagLevel-0+1;
	
	while(temp = document.getElementById('SubFrame_'+i))
	{
		document.getElementById('SubFrames').removeChild(temp);
		i++;
	}

	//3. Get list of subtags.

	if(NewTag) NewTag = NewTag + ',';
	FilterTag = NewTag;
	
	if(!FilterTag) SkipSubTag = 1;
	//does not list sub tags for the "All Topics" item
	
	//alert(FilterTag);
	tagExplorer_ListView.filterItems({'Tags':FilterTag}, true);
	
	var currentItem = "", topicTags = new Array();
	
	var SubTags = new Object();
	var tagsAdded = 0;

	
	for(var i=0; i< tagExplorer_ListView.visibleItems.length; i++) {
		
		currentItem = tagExplorer_ListView.allItems[tagExplorer_ListView.visibleItems[i]];
		
		//alert("Currently I'm going through item "+currentItem["UID"]+" which has these tags: "+currentItem["Tags"]);
		
		if(!currentItem["Tags"])	continue;
		
		topicTags = currentItem["Tags"].split(',');
		
		for(j=0; j<topicTags.length; j++) {
			
			if(!topicTags[j])	continue;
			
			if(FilterTag.indexOf(topicTags[j]+',') >= 0)	continue;
			//skip repetitive tags
		
			//alert("Adding "+topicTags[j]+" to the list...");
			if(!SubTags[topicTags[j]])
				SubTags[topicTags[j]] = 1;
			else
				SubTags[topicTags[j]] ++;
			
			tagsAdded ++;
			
		}
		
	}
	
	//Object.extend(SubTags.prototype, Enumerable);
	var subTagsArray = new Array();
	for(var key in SubTags) {
		
		//alert('writing '+key+' -> '+SubTags[key]);
		
		subTagsArray.push(key + "|" + SubTags[key]);
		//alert(key + "|" + SubTags[key]);
	}
	
	//subTagsArray.sort(function(a, b) {return parseInt(a) - parseInt(b);});
	
	subTagsArray.sort(function(a, b) {
		return getItemComparisonValue(a) - getItemComparisonValue(b);
	});
	subTagsArray.reverse(true);
	
	if(subTagsArray.length > 1 && SkipSubTag != 1)
	{
		
		//SubTags.reverse(true);
		
		PreviousLevel = FilterTag.split(',').length;
		
		var TargetFrameLevel = TagLevel-0+1;

		var TempIndex = 0;
		var TempCode = "";
		
		//for(var i in SubTags) {
		//for(var i in subTagsArray) {
		for(var j=0; j< subTagsArray.length; j++) {
		
			i = subTagsArray[j].substring(0, subTagsArray[j].indexOf("|"))
		
			//if(typeof subTagsArray[i] != "number")	continue;
			//alert("I'm looking at SubTags["+i+"] = "+SubTags[i]);
			
			//alert(SubTags[i]);
			
			if(! SubTags[i] > 0)	continue;
			
			if(SubTags[i] > 1)
				TempCode += "<div class='SubTagItem' id='SubFrame_"+TargetFrameLevel+"_"+(TempIndex++)+"' onclick=\"SwitchCategory(this, '"+FilterTag+","+i+"', '"+TargetFrameLevel+"')\"><span class='ItemCaption'>"+i+"</span><span class='ItemCount'>"+SubTags[i]+"</span><span class='SubTagItem_Icon'></span></div><br />";
			else
				TempCode += "<div class='SubTagItem' id='SubFrame_"+TargetFrameLevel+"_"+(TempIndex++)+"' onclick=\"SwitchCategory(this, '"+FilterTag+","+i+"', '"+TargetFrameLevel+"', 1)\"><span class='ItemCaption'>"+i+"</span><span class='ItemCount'>"+SubTags[i]+"</span><span class='SubTagItem_Icon'></span></div><br />";
			
		}

		if(!document.getElementById('SubFrame_'+TargetFrameLevel))
		{	
			document.getElementById('SubFrames').innerHTML += "<div class='TagFrame' id='SubFrame_"+TargetFrameLevel+"' style='display:none'>"+TempCode+"</div>";
		}
		else
		{
			document.getElementById('SubFrame_'+TargetFrameLevel).innerHTML += TempCode;
		}

		//setTimeout("document.getElementById('SubFrame_"+TargetFrameLevel+"').style.display = 'block';", 10);
		document.getElementById('SubFrame_'+TargetFrameLevel).style.display = 'block';
		
		document.getElementById('SubFrames').style.width = TargetFrameLevel * "201" + 'px';

		//document.getElementById('TagExplorer').scrollTop = 9999;
	}
	/*
	Path = "";
	for(i=0;i<FilterTags.length;i++)
	{
		Path = Path + FilterTags[i] + " &gt; ";
	}
	*/
	
	if(!Path)	Path = "";
}

//prepares the temp list based on current sorting option
function prepareTempList(matchedTopics) {
	
	//alert("I'm getting this: "+matchedTopics);
	
 	var allTopics = matchedTopics.split(",");
	var sortedTopics = '';
	
	var sortingColumn = "Title";
	var sortingMethod = "DESC";
	
	//assume that the title is the sorting column
	var sortingColumnIcon = $('x_List_OrderOptions_ColumnIcon_Title');
	
	if(sortingColumnIcon.className == 'tableHeader_SortIcon') {
		//if the title has the cusomtized order
		sortingColumn = "Date";
		sortingColumnIcon = $('x_List_OrderOptions_ColumnIcon_Date');
	}
	
	if(sortingColumnIcon.className == 'tableHeader_SortIcon tableHeader_SortIcon_ASC') {
		//if it's ascending
		sortingMethod = "ASC";
	}

	//alert("SortingColumn: "+sortingColumn + " / " + sortingMethod);

	//do the sort
	if(sortingColumn == 'Date' && sortingMethod == 'DESC') return matchedTopics;
	//override - this is the default order
	
	if(sortingColumn == 'Date' && sortingMethod == 'ASC') {
		allTopics.each(function(name, index) {
			//alert('a: '+name + ' @ ' + index);
			sortedTopics = name + ',' + sortedTopics;
		});
		
		//alert("returngin: "+sortedTopics);
		return sortedTopics;
	}
	
	sortedTopics = new Array();
	
	//sort for topics
	allTopics.each(function(name, index) {
		if(!name)	return;
		
		//alert('name: '+name+' index: '+index);
		sortedTopics[sortedTopics.length] = name+"|"+Topics[name];
		
	});
	
	//var aCharacter, bCharacter;
	sortedTopics.sort(function(a, b) {
		return getFirstCharacter(a).charCodeAt(0) - getFirstCharacter(b).charCodeAt(0);
	});
	
	
	if(sortingMethod == 'DESC') {
		sortedTopics.reverse(true);
	}
	
	var newOrder = "";
	sortedTopics.each(function(name, index) {
		newOrder = newOrder + name.substring(0, name.indexOf("|")) + ',';
	})
	//alert(newOrder);
	
	return newOrder;
	//return the sort column


}

function getFirstCharacter(string) {

	return string.substring(string.indexOf("|") + 1, string.indexOf("|") + 2).toLowerCase();
}

function GetTopicList(FilterTag) 
{
	//alert(FilterTag);
	
	currentSelectedTag = FilterTag;
	
	var FilterTags = FilterTag.split(",");
	var MatchedTopics = "", TopicMatched;
	var CurrentTag_i, CurrentTag_j;
	

	for(i=0;i<Topic_Tags.length;i++)
	{
		TopicMatched = 1;
		//alert(Topic_Tags[i]);
		
		if(FilterTag)
		{
			CurrentTag_i = ','+Topic_Tags[i];
			
			if(!CurrentTag_i)	continue;
			
			for(j=0;j<FilterTags.length;j++)
			{
				
				CurrentTag_j = FilterTags[j];
				if(CurrentTag_j == "")	continue;

				if(CurrentTag_i.indexOf(','+CurrentTag_j+',') == -1 && CurrentTag_i!=','+CurrentTag_j)
				{
					TopicMatched = 0;
					break;
				}
			}
		}

		if(TopicMatched == 1 && MatchedTopics.indexOf(i+',') == -1)
		{
			MatchedTopics = MatchedTopics + i + ',';
		}
	}
	
	MatchedTopics = prepareTempList(MatchedTopics);
	//sort the topics based on current order option
	
 	var TopicIndexes = MatchedTopics.split(",");
	//alert(MatchedTopics);
	
	var Code = "", TopicID, TopicTitle, TopicTag;
	
	for(i=0;i<TopicIndexes.length;i++)
	{
		if(!TopicIndexes[i])	continue;
		
		TopicID = Topic_IDs[TopicIndexes[i]];
		TopicTitle = Topics[TopicIndexes[i]];
		TopicTag = Topic_Tags[TopicIndexes[i]];
		if(!TopicTag)	TopicTag = "";
		
		TopicDate = Topic_Dates[TopicIndexes[i]];

		var Link_href = "javascript:void(0)";
		var Link_JS = "SwitchTopic('"+TopicID+"', '', Path)";

		var tagsCode = "", tagMatched;
		
		var tags = TopicTag.split(",");
		
		for(j=0;j<tags.length;j++) {
			
			tagMatched = false;
			CurrentTag_j = tags[j];
			
			if(!CurrentTag_j)	continue;
			
			for(k=0;k<FilterTags.length;k++) {
				if(!FilterTags[k])	continue;
				
				if(FilterTags[k] == CurrentTag_j) {
					tagMatched = true;
					break;
				}
			}
			
			if(tagMatched)
				tagsCode = tagsCode + "<a class='Topic_Selected_TagSelection rightFloat' href='javascript:void(0)' onclick=\"SwitchTag('" + tags[j] + "')\">"+tags[j]+"</a>";
			else
				tagsCode = tagsCode + "<a class='Topic_TagSelection rightFloat' href='javascript:void(0)' onclick=\"SwitchTag('" + tags[j] + "')\">"+tags[j]+"</a>";
		}
		
		var topicStatusCode = "";
		
		if(Topic_Flags[TopicIndexes[i]] == "R") {
			topicStatusCode = "<div class='PageList_Item_StatusIcon dataView_ReadOnly'></div>";
			//display the readonly sign
		}
		else {
			topicStatusCode = "<a href='javascript:void(0)' class='PageList_Item_Trash' id='Page_"+TopicID+"_Trash' onclick=\"TrashPage_TagExplore('"+TopicID+"')\" style='display:none'></a>";
			//or the trash icon
		}
		
		
		Code = Code + "<div title=\""+TopicTitle+"\" id='Page_"+TopicID+"' class='listView_Item "+(i%2 == 1? 'listView_Item_Alt':'')+"' onmouseover=\"HoverPageItem(this, '"+TopicID+"')\" onmouseout=\"LeavePageItem(this, '"+TopicID+"')\">"+topicStatusCode+"<div class='listView_ItemIcon listView_ItemIcon_Topic'></div><a href='"+Link_href+"' onclick=\""+Link_JS+"\" class='listView_Item_Title'>"+TopicTitle+"</a><span class='listView_Item_Misc'>"+tagsCode+"</span><span class='listView_Item_Modified'>"+TopicDate+"</span></div>";
	}
	
	document.getElementById('x_List').innerHTML = Code;
}

if(document.getElementById('SubFrames'))
	document.getElementById('SubFrames').style.width = '0px';

/*
function AddEntry(PageID, PageTitle, PageTag, PageDate)
{
	Topics[TempID] = (PageTitle);
	Topic_Tags[TempID] = (PageTag);
	Topic_Dates[TempID] = PageDate;
	Topic_IDs[TempID++] = (PageID);
}
*/

function AddTopEntry(TagName, TagCaption, Selected, CategoryCount)
{
	if(!TagCaption)	TagCaption = TagName;
	
	if(!CategoryCount)	CategoryCount = "";
	
	if(Selected!=1)
	{
		document.getElementById('SubFrame_0').innerHTML = document.getElementById('SubFrame_0').innerHTML + "<div class='SubTagItem' id='SubFrame_0_"+(TopEntryIndex)+"' onclick=\"SwitchCategory(this, '"+TagName+"')\"><span class='ItemCaption'>"+TagCaption+"</span><span class='ItemCount'>"+CategoryCount+"</span><span class='SubTagItem_Icon'></span></div><br />";
	}
	else
	{
		document.getElementById('SubFrame_0').innerHTML = document.getElementById('SubFrame_0').innerHTML + "<div class='SubTagItem_Selected' id='SubFrame_0_"+(TopEntryIndex)+"' onclick=\"SwitchCategory(this, '"+TagName+"')\"><span class='ItemCaption'>"+TagCaption+"</span><span class='ItemCount'>"+CategoryCount+"</span><span class='SubTagItem_Icon'></span></div><br />";
		
		//GetTopicList(TagName);
		//setTimeout("SwitchCategory(null, '"+TagName+"');document.getElementById('SubFrame_0_"+(TopEntryIndex)+"').className = 'SubTagItem_Selected';", 500);
		initCode = "SwitchCategory(null, '"+TagName+"');document.getElementById('SubFrame_0_"+(TopEntryIndex)+"').className = 'SubTagItem_Selected';";
	}
	
	TopEntryIndex++;
}

//==============================================================


function HoverPageItem(obj, ID)
{
	if(Browser=="Explorer")
	{
		obj.style.backgroundColor = '#f0f9ff';
	}
	
	document.getElementById('Page_'+ID+'_Trash').style.display = 'block';
}

function LeavePageItem(obj, ID)
{
	if(Browser=="Explorer")
	{
		obj.style.backgroundColor = '#ffffff';
	}
	
	document.getElementById('Page_'+ID+'_Trash').style.display = 'none';
}

function ShowControls(ID)
{
	document.getElementById(ID+"_Control").style.display="inline-block";
}

function HideControls(ID)
{
	document.getElementById(ID+"_Control").style.display="none";
}

function TrashPage_TagExplore(ID)
{
	if(confirm(Localized_TrashPage_Prompt))
	{
		for(i=0;i<Topic_IDs.length;i++)
		{
			if(Topic_IDs[i]==ID)
			{
				Topic_IDs[i] = "";
				Topics[i] = "";
				Topic_Tags[i] = "";
			}
		}
		
		Effect.BlindUp('Page_'+ID, {duration:0.3});
		xajax_trashItem(ID);
	}
	return;
}

function projectList_Filter(filterText) {
	if(filterText) {
		
		//turn on the search mode
		if($('TagExplorer').style.display != 'none')	Effect.BlindUp('TagExplorer', {duration:0.3, queue:'end'});
		
		tagExplorer_ListView.filterItems({'Hash':filterText.toUpperCase()}, true);
	}
	else {
		//turn off the search mode
		if($('TagExplorer').style.display == 'none')	Effect.BlindDown('TagExplorer', {duration:0.3, queue:'end'});
		
		tagExplorer_ListView.filterItems(null, true);
		
	}
}