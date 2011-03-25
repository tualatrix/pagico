<?php
/*************************************************************

					Pagico 3 - Data Module

Module Structure:

Main function: Process(SubTabID, DataAddress (if any));
Returns:

	SideBar modules list.		e.g.: 12
	SubTabsCode (no ajax here)
	MainContent codes.
	Javascripts needed for the MainContent codes.

*************************************************************/
define("EditionCode", "STND");
if(constant("EditionCode")!=constant("EditionCode2"))	Error(404);


function Main($SubTabID=0, $Parameter="", $Password="", $options="")
{
	global $CurrentDB, $iSpaceSettings, $lp, $CurrentDB_Settings, $basedir, $Library_DIR;

	if(constant("EditionCode")!="PEPL")
	{
	
		switch($SubTabID)
		{
			case -1:	//Specific topic
				require("$basedir/html/modules/Data_Topic.php");
		
				$Topic = ParseTopic($Parameter, $Password, $options);
				//file_put_contents("$basedir/log.txt", $Topic["ContentCode"]);
			
				$Content["Content"] = $Topic["ContentCode"];
				$Content["JavaScript"] = $Topic["JavaScript"];
				$Content["JSFile"] = "/html/modules/Data_Topic.js";
				break;
			

			case "0":	//Topic List
				{
					//tag explore
					$TagsArray = array();
					$SubTags = array();
					$PageCount = 0;
					
					$dbh = $GLOBALS["currentDatabase"]->handler;
					$Query = $dbh->query("SELECT UID, Content, Modified, Flags FROM mach WHERE Type='Topic' ORDER BY Modified DESC;", PDO::FETCH_ASSOC);
					
					if(!$Query)	$Query = array();
					
					$JavaScript = "tagExplorer_ListView = new listView('x_List', 'tagExplorer_ListView');";
					
					
					foreach($Query as $row)
					{	

						if(!$row["UID"] || !$row["Content"])	continue;
						
						$UID = $row["UID"];
						$topicObject = unserialize($row["Content"]);
						$row["Flags"] = unserialize($row["Flags"]);
					
						
						$PageCount ++;
						
						//if the tag comes without the trailing comma, add it
						if($topicObject["Tags"]&&substr($topicObject["Tags"], -1)!=",")	$topicObject["Tags"].= ",";
						
						//set the default title to untitled topics
						if(!trim($topicObject["Title"]))	$topicObject["Title"] = $lp->_("UntitledPage");
						
						$shareStatus = Channels_getSharedStatus($UID);
						
						//$JavaScript.="AddEntry('$UID', \"".addslashes(trim($topicObject["Title"]))."\", \"".str_replace("\"", "", trim($topicObject["Tags"]))."\", \"".GetDate_Approximately($row["Modified"])."\");";

						if(!is_array($row["Flags"]))	$row["Flags"] = array();

						$JavaScript.= "tagExplorer_ListView.addItem({\"UID\":\"".$UID."\", \"Hash\":\"".addslashes(strtoupper($topicObject["Title"]." ".$topicObject["Tags"]))."\", \"projectStatus\":\"".$topicObject["projectStatus"]."\", \"Title\":\"".addslashes($topicObject["Title"])."\", \"Tags\":\"".$topicObject["Tags"]."\", \"Shared\":\"".$shareStatus["sharedOrNot"]."\", \"Deletable\":\"".(($shareStatus["sharedOrNot"] == 1 && substr(strrchr($UID, "-"), 1) != $GLOBALS["authorID"]) ? "0" : "1")."\", \"Modified\":\"".getDate_Approximately($row["Modified"], true)."\", \"Unread\":\"".(in_array("UNREAD", $row["Flags"])?"1":"0")."\", \"Type\":\"Topic\", \"Timestamp\":".$row["Modified"]."});";
						
						//explode the tags, and create the tag statistic. sort the tag by the count of subtags						
						$Tags = explode(",", $topicObject["Tags"]);
						
						array_merge($TagsArray, $Tags);
						
						$tmp = $Tags;
						foreach($Tags as $Tag)
						{
							//$TagLog.="\n + Processing Tag '$Tag'.";
							
							if(!$Tag = trim($Tag))	continue;

							//$TagLog.="\n + Tag '$Tag' got through.";

							$TagsArray[$Tag] ++;

							$SortedTags[] = $Tag;
							if(!isset($SubTags[$Tag]))	$SubTags[$Tag] = array();

							//$TagLog.="\n + Calculating subtags for '$Tag' ...";
							foreach($tmp as $SubTag)
							{
								//trim out empty tags
								//$TagLog.="\n + + + Filter out blank tags '$SubTag' ...";
								if(!$SubTag = trim($SubTag))	continue;

								//trim out the mother tag itself								
								//$TagLog.="\n + + + Filter out the tags itself '$SubTag' ...";	
								if($SubTag == $Tag)	continue;

								//$TagLog.="\n + + + Adding '$SubTag' to the subtag group for '$Tag' ...";	
								if(!in_array($SubTag, $SubTags[$Tag]))
								{
									//$TagLog.="Added.";
									array_push($SubTags[$Tag], $SubTag);
								}
							}
						}
					}
					
					//file_put_contents("$CurrentDB/cache/TagLog.txt", $TagLog);
					
					$SubTagStatistics = array();

					foreach($SubTags as $TagName => $SubTagArray)
					{
						$SubTagStatistics[$TagName] = count($SubTagArray)+($TagsArray[$TagName]/1000);
					}

					//update the tag cache when ever possible
					file_put_contents("$CurrentDB/cache/TagCache.php", "<?php exit(\"Access Denied.\")?>\n".serialize($TagsArray));

					//$SortedTags = array_unique($SortedTags);
					arsort($SubTagStatistics);
					//print_r($SubTagStatistics);

					$SortedTags = array_keys($SubTagStatistics);
				
					$JavaScript.="AddTopEntry('', \"".$lp->_("All Projects")."\", '".($Parameter?"":"1")."', '".$PageCount."');\n";
					if($CurrentDB_Settings["HiddenTags_Enabled"]==1)
					{
						foreach($SortedTags as $Tag)
						{
							if(stripos($CurrentDB_Settings["HiddenTags"], $Tag.",")!==false)	continue;

							$JavaScript.="AddTopEntry(\"$Tag\", \"$Tag\", '".(strtoupper(urldecode($Parameter))==$Tag?"1":"0")."', '".$TagsArray[$Tag]."');\n";
						}					
					}
					else
					{
						foreach($SortedTags as $Tag)
						{
							$JavaScript.="AddTopEntry(\"$Tag\", \"$Tag\", '".(strtoupper(urldecode($Parameter))==$Tag?"1":"0")."', '".$TagsArray[$Tag]."');\n";
						}
					}

					sort($SortedTags);

					foreach($SortedTags as $Tag)
					{
						$JavaScript.="SortedTags.push(\"$Tag\");\n";
					}

					$TagExploreCode = "
						<div id='TagExplorer'>
							<div class='TagFrame' id='SubFrame_0'>
							</div>

							<div id='SubFrames'>
							</div>
						</div>";
				}
			
				//$Content["JSFile"] = "/html/modules/Data_List.js";
				$ContentCode = "
					<div class='createNew_InputArea'>
						<input type='text' id='QuickAdd_Simple' placeholder='".$lp->_("Need a new project? Write the title here and press enter.")."' onfocus=\"$('createNew_InputArea_Hint').show();\" onblur=\"$('createNew_InputArea_Hint').hide();\" onkeyup=\"if(event.keyCode==13) {this.disabled = true; this.blur(); xajax_Topic_AddNew(this.value);} else if(event.keyCode == 27) {this.value = ''; projectList_Filter('');} else { projectList_Filter(this.value);}\" />
						<div id='createNew_InputArea_Hint' style='display:none' onclick=\"$('QuickAdd_Simple').focus();\">&larr; ".$lp->_("Hit ENTER to create new, or ESC to cancel")."</div>
					</div>

					$TagExploreCode

					<div id='x_List_OrderOptions' class='tableHeader'>
					
					<a href='javascript:void(0)' id='x_List_OrderOptions_Column_Unread' onclick=\"tagExplorer_ListView.toggleOrder('Unread')\" class='tableHeader_Option' style='width:3%;'><div class='tableHeader_SortIcon' id='x_List_OrderOptions_ColumnIcon_Unread'></div></a>
					<a href='javascript:void(0)' id='x_List_OrderOptions_Column_Title' onclick=\"tagExplorer_ListView.toggleOrder('Title')\" class='tableHeader_Option' style='width:82%'>".$lp->_("Title")." <div class='tableHeader_SortIcon' id='x_List_OrderOptions_ColumnIcon_Title'></div></a>
					<a href='javascript:void(0)' id='x_List_OrderOptions_Column_Timestamp' onclick=\"tagExplorer_ListView.toggleOrder('Timestamp')\" class='tableHeader_Option tableHeader_Option_Selected_DESC' style='width:14%'>".$lp->_("Modified Time")." <div class='tableHeader_SortIcon tableHeader_SortIcon_DESC' id='x_List_OrderOptions_ColumnIcon_Timestamp'></div></a>
					
					</div>

					<div id='x_List'>
						
					</div>
				
					<span class='ModuleEmpty_Indicator' id='x_TopicList_EmptyIndicator'><span class='ModuleEmpty_Indicator_Title'>".$lp->_("Projects")."</span><span class='ModuleEmpty_Indicator_Text'>".$lp->_("This is the place to organize all kinds of projects and events.")."<br />".$lp->_("You can store notes, tasks, files, and cross-links within projects.")."<br /><a href='javascript:void(0)' onclick=\"xajax_LaunchDocument('http://help.pagico.com/category/managing-data/#content')\" class='ModuleEmpty_Indicator_Link'>".$lp->_("Learn more")." <span class='ModuleEmpty_Indicator_Link_Icon'></span></a></span></span>
					";
				
			
				$Content["SubCategory"] = $SubCategoryCode;
				$Content["Content"] = $ContentCode;
				$Content["JavaScript"] = "Init_TopicList();\n".$JavaScript."\nResetTopicList();";
				break;
			
			default:
				//group.
				
				$collectionObj = new collectionObject($SubTabID);
				$CollectionCode = $collectionObj->render();
				
				//$Group = TopicGroup_getGroup($SubTabID, 1);
				//file_put_contents("$basedir/log.txt", $Topic["ContentCode"]);
			
				$Content["Content"] = $CollectionCode["ContentCode"];
				$Content["JavaScript"] = $CollectionCode["JavaScript"];

				$Content["JSFile"] = "/html/modules/Data_Group.js";
				
				
		}
	}
	else
	{
		//$Content["Content"] = "<img src='/img/App_GUI/Misc/Sample_Topics.jpg' style='margin-left:2px' />";
		$Content["Content"] ="<span class='ModuleEmpty_Indicator'><span class='ModuleEmpty_Indicator_Title'>".$lp->_("Projects").".</span><span class='ModuleEmpty_Indicator_Text'>".$lp->_("Oops, this feature is not available in your current edition.")."<br /><br />".$lp->_("For more information on feature comparison between editions, please visit:")." <a href='javascript:void(0)' onclick=\"xajax_LaunchDocument('http://www.pagico.com/purchase/')\">http://www.pagico.com/purchase/</a>.</span></span>";
	}


	$Content["SideBar"] = "012";
	
	
	return $Content;
}

?>