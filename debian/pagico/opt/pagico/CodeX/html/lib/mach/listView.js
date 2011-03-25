/* the listView class */

function listView(targetElement, instanceName) {
	
	//variable definitions here
	this.targetElement = "";
	this.visibleItems = new Array();
	this.allItems = new Object();
	this.readOnly = false;
	this.sortColumn = "Timestamp";
	this.sortOrder = "DESC";
	this.currentFilter = "";
	this.showInactive = false;
	this.hiddenItems = 0;
	
	this.lp = new localization();
	//alert(this.lp.phrase["Hide inactive projects"]);
	
	this.previousSortColumn = "";
	
	this.targetElement = targetElement;
	this.instanceName = instanceName;
	
	if(targetElement && document.getElementById(targetElement)) this.targetElement = document.getElementById(targetElement);

	//-------- below are methods ------------

	//itemDetails should be arrays
	this.addItem = function(itemDetails) {
		
		this.allItems[itemDetails["UID"]] = itemDetails;
		
	}

	//the criteria should be array, e.g.: ['tags'=>'one, two, ...']
	//the result will be saved as this.visibleItems
	this.filterItems = function(criteria, autoUpdate) {
		
		this.hiddenItems = 0;
		this.visibleItems = new Array();
		
		//alert(criteria);
		
		if(!criteria) {
			//if no criteria set, send everything to visibleItems
			this.init();
			
			if(autoUpdate == true) this.render();
			
			return;
		}
		
		
		var filterValues = new Array();
		var filterKey = "";
		this.currentFilter = "";
		
		for(var i in criteria) {
			
			value = criteria[i];
			
			if(!value)	continue;
			filterKey = i;
			
			if(value.indexOf(',') >= 0) {
				filterValues = value.split(',');
				this.currentFilter = value;
			}
			else {
				filterValues.push(value);
			}
			
			break;
			
		}
		
		var itemMatched;
		
		for(var i in this.allItems) {
			
			itemDetail = this.allItems[i];

			itemMatched = true;
			
			if(filterValues.length == 1) {
				if(itemDetail[filterKey].indexOf(filterValues[0]) == -1) {
					itemMatched = false;
				}
			}
			else {
				
				for(var j = 0; j<filterValues.length; j++) {

					filter = filterValues[j];

					if(itemDetail[filterKey].indexOf(filter+',') == -1) {
						itemMatched = false;
						break;
					}

				}
			}
		
			
			if(itemMatched == true) {
				
				if(itemDetail["projectStatus"] == 1) this.hiddenItems ++;
				
				this.visibleItems.push(itemDetail["UID"]);
			}
		}
		
		if(autoUpdate == true) {
			this.render();
		}
		
	}
	
	this.sort = function(sortColumn, sortOrder) {
		
		if(sortColumn)	this.sortColumn = sortColumn;
		if(sortOrder)	this.sortOrder = sortOrder;

		if(!this.visibleItems.length) return;
		//Do nothing if there's nothing to sort
		
		//if the visibleItems array hasn't been initiated already
		//alert("trying to sort with " + this.sortColumn + " with " + this.visibleItems.length + " in the visibleItems");
		var sortedArray = new Array();

		for(var i=0; i<this.visibleItems.length;i++) {
			
			itemUID = this.visibleItems[i];
			
			if(!itemUID || !this.allItems[itemUID])	continue;
			
			//alert("Item " + itemUID + "'s "+this.sortColumn+" = " + this.allItems[itemUID][this.sortColumn]);
			
			sortedArray.push(itemUID+"|"+this.allItems[itemUID][this.sortColumn]);
		}
		
		//alert(sortedArray.length);
		
		sortedArray.sort(function(a, b) {
			return getItemComparisonValue(a) - getItemComparisonValue(b);
		});
		
		if(this.sortOrder == "DESC") 
			sortedArray.reverse(true);
			//reverse the array if it's descending
		
		this.visibleItems = new Array();
		
		for(i = 0;i<sortedArray.length;i++) {
			
			this.visibleItems.push(sortedArray[i].substring(0, sortedArray[i].indexOf("|")));
			//alert("adding "+sortedArray[i].substring(0, sortedArray[i].indexOf("|"))+" into the visibleItems array");
		}
		
		
	}

	//removes one item from the allItems, based on the temporary itemID
	this.removeItem = function(itemID) {
		//alert("Trying to remove "+itemID);

		//1. Remove item from the current list

		confirmPrompt = DeleteConfirmText + "\n" + permanentAction;
		
		if(confirm(confirmPrompt)) {
		
			delete this.allItems[itemID];
			this.render();
			
			//2. Call xajax to remove the item from the database
			xajax_trashItem(itemID);
		}
		
		
	}

	//the itemID should be the tempID used in the allItems pool
	this.renderItem = function(itemUID, useAlternativeBG) {
		var HTMLCode = "";
		
		var itemDetail = this.allItems[itemUID];

		
		var iconClass = "";
		var tagsCode = "";
				
		switch(itemDetail["Type"]) {
			case "Topic":
				iconClass = 'listView_ItemIcon_Topic';
				
				if(itemDetail["Tags"]) {
					var tags = itemDetail["Tags"].split(",");

					for(var i=0;i<tags.length;i++) {

						name = tags[i];

						if(!name)	continue;

						if(this.currentFilter.indexOf(name+',') >= 0) {
							tagsCode = tagsCode + "<a class='Topic_Selected_TagSelection rightFloat' href='javascript:void(0)' onclick=\"SwitchTag('" + name + "')\">"+name+"</a>";

						}
						else {

							tagsCode = tagsCode + "<a class='Topic_TagSelection rightFloat' href='javascript:void(0)' onclick=\"SwitchTag('" + name + "')\">"+name+"</a>";

						}
					}
				}

				break;
			case "Profile":
				iconClass = 'listView_ItemIcon_Profile';
				
				if(itemDetail["Email"])
					tagsCode = "<a href='javascript:void(0)' onclick=\"xajax_LaunchDocument('"+itemDetail["Email"]+"')\" class='Clipping'>"+itemDetail["Email"]+"</a>";
					
				if(itemDetail["Gender"])
					iconClass = 'listView_ItemIcon_Profile_'+itemDetail["Gender"];
					
					
					
				break;
		}
		
		var hiddenItemCls = "";
		if(itemDetail["projectStatus"] == 1) {
			//hidden item
			hiddenItemCls = "listView_Item_Hidden";
		}
		
		if(useAlternativeBG == 1)
			altBG = "listView_Item_Alt";
		else
			altBG = "";
		
		
		
		var unreadStatus = "listView_ItemIcon_Blank";
		
		if(itemDetail["Unread"] == 1)
			unreadStatus = "listView_ItemIcon_Unread";
			
		var overlayIcon = "listView_ItemIcon_Blank";
		
		if(itemDetail["Shared"] == 1)
			overlayIcon = "listView_ItemIcon_Overlay_Shared";

		if(itemDetail["Deletable"] == "1")
			deleteIcon = "<a id='listView_Item_"+itemUID+"_Control' href='javascript:void(0)' class='listView_Item_TrashIcon' onclick=\""+this.instanceName+".removeItem('"+itemUID+"');\"></a>";
		else
			deleteIcon = "<a id='listView_Item_"+itemUID+"_Control' href='javascript:void(0)' class='listView_Item_TrashIcon_Disabled'></a>";
			

		HTMLCode = "<div title=\""+itemDetail["Title"]+"\" id='listView_Item_"+itemUID+"' class='listView_Item "+altBG+" "+hiddenItemCls+"'><div class='listView_ItemIcon "+unreadStatus+"' onclick=\"switchTo('"+itemUID+"')\"></div><div onclick=\"switchTo('"+itemUID+"')\" class='listView_ItemIcon "+iconClass+"'><div class='listView_ItemIcon_Overlay "+overlayIcon+"'></div></div><a href='javascript:void(0)' onclick=\"switchTo('"+itemUID+"')\" class='listView_Item_Title'>"+itemDetail["Title"]+"</a><span class='listView_Item_Misc'>"+tagsCode+"</span><span class='listView_Item_Modified'>"+itemDetail["Modified"]+"</span>"+deleteIcon+"</div>";
		
		return HTMLCode;
		
	}

	//this function initiates the visibleItems array
	this.init = function() {
		
		this.hiddenItems = 0;
		this.visibleItems = new Array();
		
		var tmp;
		
		for(var i in this.allItems) {
			
			tmp = this.allItems[i];
			
			if(tmp["projectStatus"] == 1) this.hiddenItems ++;
			
			this.visibleItems.push(this.allItems[i]["UID"]);
			
		}

	}

	//renders all visibleItems using the renderItem method, and displays it into the this.targetElement node
	this.render = function() {
		
		this.sort();
		//always sort before rendering
		
		var HTMLCode = "", tmp;
		
		for(var i=0;i<this.visibleItems.length;i++) {
			
			itemUID = this.visibleItems[i];
			if(!itemUID)	continue;
			
			tmp = this.allItems[itemUID];
			
			if(!this.showInactive && tmp["projectStatus"] == 1)	continue;
			
			HTMLCode = HTMLCode + this.renderItem(itemUID, i%2);
			
		}
		
		//alert(this.targetElement.innerHTML);
		
		if(typeof this.targetElement == "string") {
			this.targetElement = document.getElementById(this.targetElement);
		}
		
		//alert(this.targetElement.innerHTML);
		if(this.hiddenItems > 0) {
			//there are items hidden
			
			if(!this.showInactive)
				HTMLCode += "<a href='javascript:void(0)' class='listView_showHiddenItemBtn' onclick=\""+this.instanceName+".seeInactiveProjects();\">"+this.lp.phrase["See also: %NUMBER% inactive project(s)"].replace("%NUMBER%", this.hiddenItems)+"</a>";
			else
				HTMLCode += "<a href='javascript:void(0)' class='listView_showHiddenItemBtn' onclick=\""+this.instanceName+".hideInactiveProjects();\">"+this.lp.phrase["Hide inactive projects"]+"</a>";
			
		}
		this.targetElement.innerHTML = HTMLCode;
		
	}
	
	this.toggleOrder = function(orderColumn) {
		
		if(this.sortOrder == "DESC")
			this.sortOrder = "ASC";
		else
			this.sortOrder = "DESC";
		
		
		if(orderColumn != this.sortColumn) {
			this.previousSortColumn = this.sortColumn;
		}
		
		this.sortColumn = orderColumn;
		
		/*
		var theOtherColumn = 'Title';
		
		if(orderColumn == 'Title')
			theOtherColumn = 'Timestamp';
		*/
		//1. set the current column
		$('x_List_OrderOptions_Column_'+orderColumn).className = 'tableHeader_Option tableHeader_Option_Selected_'+this.sortOrder;
		$('x_List_OrderOptions_ColumnIcon_'+orderColumn).className = 'tableHeader_SortIcon tableHeader_SortIcon_'+this.sortOrder;

		if(this.previousSortColumn) {
			//2. reset theOtherColumn	
			$('x_List_OrderOptions_Column_'+this.previousSortColumn).className = 'tableHeader_Option';
			$('x_List_OrderOptions_ColumnIcon_'+this.previousSortColumn).className = 'tableHeader_SortIcon';
		}

		
		//alert("Currently this is sorting with "+this.sortColumn+" in the order of "+this.sortOrder);
		
		this.render();
	}
	
	this.seeInactiveProjects = function() {
		this.showInactive = true;
		this.render();
	}
	
	this.hideInactiveProjects = function() {
		this.showInactive = false;
		this.render();
	}
	
	this.getItemComparisonValue = function(value) {
		
		if(typeof value == "string") {
			
			value = value.substring(value.indexOf("|") + 1, value.indexOf("|") + 2).toLowerCase();
			return value.charCodeAt(0);
			
		}
		else if(typeof value == "number") {
			return value;
		}
		else if(typeof value == "boolean") {
			return (value == true ? 1 : 0);
		}
		
	}
	
}


function getItemComparisonValue(value, verbose) {
	
	realValue = value.substring(value.indexOf("|") + 1);

	if(verbose)	alert(realValue);

	if(realValue == parseInt(realValue))
		valueType = "number";
	else if(realValue == true || realValue == false)
		valueType = "boolean";
	else
		valueType = "string";
	
	//alert(realValue + " is " + valueType);
	
	if(valueType == "string") {
		
		return realValue.toLowerCase().charCodeAt(0);
		
	}
	else if(valueType == "number") {
		return realValue;
	}
	else if(valueType == "boolean") {
		return (realValue == true ? 1 : 0);
	}
	
}
