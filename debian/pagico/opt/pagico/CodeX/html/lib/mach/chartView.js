/*
The chartView class
*/

function chartView(targetElement, instanceName) {
	
	this.allItems = new Object();
	this.allParents = new Object();
	
	this.currentViewType = 0;
	this.currentStepSize = 0;
	this.totalStepCount = 0;
	this.criteria = "";
	
	this.init = true;
	
	this.instanceName = instanceName;
	
	this.chartViews = new Array();
	
	this.chartViews[0] = 'weekView';
	this.chartViews[1] = 'quarterView';
	this.chartViews[2] = 'yearView';
	
	this.today = new Date();
	this.targetElement = targetElement;
	
	this.localization = new localization();
	
	this.weekdays = new Array();
	this.weekdays[0] = this.localization.phrase["Sun"];
	this.weekdays[1] = this.localization.phrase["Mon"];
	this.weekdays[2] = this.localization.phrase["Tue"];
	this.weekdays[3] = this.localization.phrase["Wed"];
	this.weekdays[4] = this.localization.phrase["Thu"];
	this.weekdays[5] = this.localization.phrase["Fri"];
	this.weekdays[6] = this.localization.phrase["Sat"];
	
	this.months = new Array();
	this.months[1] = this.localization.phrase["Jan"];
	this.months[2] = this.localization.phrase["Feb"];
	this.months[3] = this.localization.phrase["Mar"];
	this.months[4] = this.localization.phrase["Apr"];
	this.months[5] = this.localization.phrase["May"];
	this.months[6] = this.localization.phrase["Jun"];
	this.months[7] = this.localization.phrase["Jul"];
	this.months[8] = this.localization.phrase["Aug"];
	this.months[9] = this.localization.phrase["Sep"];
	this.months[10] = this.localization.phrase["Oct"];
	this.months[11] = this.localization.phrase["Nov"];
	this.months[12] = this.localization.phrase["Dec"];
	
	this.stepLength = new Array();
	this.stepLength[0] = 0;
	this.stepLength[1] = 0;
	this.stepLength[2] = 0;
	
	this.lowRange = 0;
	this.highRange = 0;
	
	this.dragged = false;
	this.adjustDragSteps = null;
	
	
	this.JSCode = "";

	//initialize the targetElement
	$$("#"+this.targetElement)[0].innerHTML = "\
	<div class='toolbar_Light'>\
		<div class='toolbarButtons'>\
			<a href='javascript:void(0)' class='toolbarButton'><span class='navigationArrows_left' onclick='"+this.instanceName+".prev()'></span></a>\
			<div class='toolbarButtonSeparator'></div>\
			<a href='javascript:void(0)' class='toolbarButton' id='toolbarButton_0' onclick='"+this.instanceName+".switchView(0)'>"+this.localization.phrase["Week"]+"</a>\
			<div class='toolbarButtonSeparator'></div>\
			<a href='javascript:void(0)' class='toolbarButton' id='toolbarButton_1' onclick='"+this.instanceName+".switchView(1)'>"+this.localization.phrase["Quarter"]+"</a>\
			<div class='toolbarButtonSeparator'></div>\
			<a href='javascript:void(0)' class='toolbarButton' id='toolbarButton_2' onclick='"+this.instanceName+".switchView(2)'>"+this.localization.phrase["Year"]+"</a>\
			<div class='toolbarButtonSeparator'></div>\
			<a href='javascript:void(0)' class='toolbarButton'><span class='navigationArrows_Right' onclick='"+this.instanceName+".next()'></span></a>\
		</div>\
	</div>\
	<div class='leftSideBar'></div>\
	<div class='canvas'>\
		<h1 onclick='"+this.instanceName+".hideTitle()'></h1>\
		<div class='canvasGrids'></div>\
		<div class='canvasContent'></div>\
	</div>\
	<div class='flowchartOption'><input type='checkbox' id='"+this.targetElement+"_showCompletedTasks' class='showCompletedTasks' value='1' onchange='"+this.instanceName+".refresh();' /> <label for='"+this.targetElement+"_showCompletedTasks'>"+this.localization.phrase["Show previously completed tasks"]+"</label></div>";
	
	disableSelection(document.getElementById(this.targetElement));
	
	this.resetData = function() {
		
		this.allItems = new Object();
		this.allParents = new Object();
		
	}
	
	//this.currentWidth = 100;
	
	this.adjustDimension = function(init) {

		var totalWidth = $(this.targetElement).getWidth() - 1;
		
		//if(!init && Math.round(Math.abs(this.currentWidth - totalWidth) * 100 / this.currentWidth) != 0.01)	return false;
		/*
		if(totalWidth > this.currentWidth)
		{
	 		var delta = Math.round((Math.abs(this.currentWidth - totalWidth) * 100) / this.currentWidth) / 100;
			//document.title = delta;
			if(!init && delta < 0.02)	return;
		}
		*/
		//center the toolbar buttons
		$$("#"+this.targetElement+" .toolbarButtons")[0].style.marginLeft = ((totalWidth - $$('#'+this.targetElement+' .toolbarButtons')[0].getWidth()) / 2)  + 'px';

		var sideBarWidth = Math.round(totalWidth * 0.20);

		if(sideBarWidth <=180)	sideBarWidth = 180;
		if(sideBarWidth >= 250)	sideBarWidth = 250;

		$$("#"+this.targetElement+" .leftSideBar")[0].style.width = (sideBarWidth - 1) + "px";
		$$("#"+this.targetElement+" .canvas")[0].style.width = (totalWidth - sideBarWidth - 1) + 'px';
		
		//determine step length here
		this.stepLength[0] = Math.round((totalWidth - sideBarWidth - 1) / 21) - 1;
		this.stepLength[1] = Math.round((totalWidth - sideBarWidth - 1) / 12) - 1;
		this.stepLength[2] = Math.round((totalWidth - sideBarWidth - 1) / 12) - 1;
		
		/*
		document.styleSheets[0].rules[0].style['width'] = this.stepLength[0]+'px !important';
		document.styleSheets[0].rules[1].style['width'] = this.stepLength[1]+'px !important';
		document.styleSheets[0].rules[2].style['width'] = this.stepLength[2]+'px !important';
		*/
		
		var visibleGrids;
		var redrawNeeded = false;
		if(this.currentViewType == 0)
			visibleGrids = $$("#"+this.targetElement+" .dayGrid");
		else if(this.currentViewType == 1)
			visibleGrids = $$("#"+this.targetElement+" .weekGrid");
		else if(this.currentViewType == 2)
			visibleGrids = $$("#"+this.targetElement+" .monthGrid");
		
		for(i = 0; i < visibleGrids.length; i++) {
			
			visibleGrids[i].style.width = this.stepLength[this.currentViewType] + 'px !important';
			
		}
		
		//if((this.stepLength[this.currentViewType]+'px') != visibleGrids[visibleGrids.length - 1].getStyle('width'))	redrawNeeded = true;
		
		
		var progressBars = $$("#"+this.targetElement+" .expanded div.progressBar");
		var tValue;
		
		for(i = 0; i < progressBars.length; i++) {
			
			tValue = progressBars[i].id.split('_');
			//left, length
			progressBars[i].style.marginLeft = parseFloat(tValue[1]) * this.stepLength[this.currentViewType] + 'px';
			
			if(progressBars[i].className.indexOf('progressBar_Completed') != -1)
				progressBars[i].style.width = (parseFloat(tValue[2]) * this.stepLength[this.currentViewType] - 4) + 'px';
			else
				progressBars[i].style.width = parseFloat(tValue[2]) * this.stepLength[this.currentViewType] + 'px';
			
		}
		
		var progressBars = $$("#"+this.targetElement+" div.groupBracket");
		var tValue;

		for(i = 0; i < progressBars.length; i++) {
			
			tValue = progressBars[i].id.split('_');
			//left, length
			
			progressBars[i].style.left = parseFloat(tValue[1]) * this.stepLength[this.currentViewType] + 'px';
			
			progressBars[i].style.width = (parseFloat(tValue[2]) * this.stepLength[this.currentViewType] - 4) + 'px';
			
		}
		
		//this.currentWidth = totalWidth;

		$$("#"+this.targetElement+" .canvasGrids")[0].style.height = $$("#"+this.targetElement+" .canvas")[0].getHeight() + 'px';
		
		//if(redrawNeeded) this.adjustDimension(true);
		try {
			clearTimeout(this.adjustDragSteps);
		}
		catch (error) {
			//skip errors
		}

		if(this.JSCode && !init)
			this.adjustDragSteps = setTimeout("eval("+this.instanceName+".JSCode);", 500);
		
	}
	
	this.adjustDimension(true);
	
	//add items to the pool
	this.addItem = function (itemDetails) {
		this.allItems[itemDetails["UID"]] = itemDetails;
	}
	
	this.addParent = function (groupDetails) {
		this.allParents[groupDetails["UID"]] = groupDetails;
	}

	this.switchView = function(viewType) {
		
		for(i=0;i<this.chartViews.length;i++) {

			if(i != viewType) {
				$('toolbarButton_'+i).removeClassName("toolbarButton_selected");
				$(this.targetElement).removeClassName(this.chartViews[i]);
			}
			else {
				$('toolbarButton_'+i).addClassName("toolbarButton_selected");
				$(this.targetElement).addClassName(this.chartViews[i]);
			}

		}
		
		this.currentViewType = viewType;
		this.clearView();
		
		this.loadData();
		//this.renderView();
		
	}
	
	this.next = function() {
		if(this.currentViewType == 0) {
			
			this.loadData(this.lowRange + 7*24*3600*1000);
			//this.renderView();
			
		}
		else if(this.currentViewType == 1) {
			var tmp = new Date(this.lowRange);
			var targetMonth = tmp.getMonth() + 3;
			var targetYear = tmp.getFullYear();
			
			if(targetMonth > 11) {
				targetMonth = targetMonth - 12;
				targetYear++;
			}
			
			tmp = new Date(targetYear, targetMonth, 1);
			
			this.loadData(tmp.getTime());
			//this.renderView();
		}
		else if(this.currentViewType == 2) {
			var tmp = new Date(this.lowRange);
			tmp = new Date(tmp.getFullYear() + 1, 0, 1);
			
			this.loadData(tmp.getTime());
			//this.renderView();
		}
	}
	
	this.prev = function() {
		if(this.currentViewType == 0) {
			this.loadData(this.lowRange - 7*24*3600*1000);
			//this.renderView();
		}
		else if(this.currentViewType == 1) {
			var tmp = new Date(this.lowRange);
			var targetMonth = tmp.getMonth() - 3;
			var targetYear = tmp.getFullYear();
			
			if(targetMonth < 0) {
				targetMonth = 12 + targetMonth;
				targetYear--;
			}
			
			tmp = new Date(targetYear, targetMonth, 1);
			
			this.loadData(tmp.getTime());
			//this.renderView();
		}
		else if(this.currentViewType == 2) {
			var tmp = new Date(this.lowRange);
			tmp = new Date(tmp.getFullYear() - 1, 0, 1);
			
			this.loadData(tmp.getTime());
			//this.renderView();
		}
	}
	
	this.clearView = function() {
		$$("#"+this.targetElement+" .canvasContent")[0].innerHTML = "";
	}
	
	//calculates lowRange and highRange, and requests data
	this.loadData = function(startingPoint) {
		
		$(this.targetElement).addClassName("loading");
		
		//determine the lowRange and highRange
		var stepSize = "", stepCount = 0, chartTitle = "";
		
		if(startingPoint) {
			startingPoint = new Date(startingPoint);
		}
		
		switch(this.currentViewType) {
			case 0:
				//weekView - 21 days
				stepSize = "day";
				stepCount = 21;
				if(!startingPoint) {
					//by default, set the starting date to 10 days ago (to center on today)
					startingPoint = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 10);
				}
				
				endingPoint = new Date(startingPoint.getTime() + 21*24*3600*1000 - 1);

				chartTitle = this.months[(startingPoint.getMonth()+1)]+" "+startingPoint.getDate() + " - " + this.months[(endingPoint.getMonth() + 1)] + " " + endingPoint.getDate();
				
				break;
			case 1:
				//quarterView - 3 months
				stepSize = "week";
				stepCount = 12;
				if(!startingPoint) {
					//by default, focus on the current quarter, start from the beginning of this current quarter.
					var quarterStartingPoint;
					if(this.today.getMonth() >= 0 && this.today.getMonth() <= 2)
						quarterStartingPoint = 0;
					else if(this.today.getMonth() >=3 && this.today.getMonth() <= 5)
						quarterStartingPoint = 3;
					else if(this.today.getMonth() >=6 && this.today.getMonth() <= 8)
						quarterStartingPoint = 6;
					else if(this.today.getMonth() >=9 && this.today.getMonth() <= 11)
						quarterStartingPoint = 9;
					
					startingPoint = new Date(this.today.getFullYear(), quarterStartingPoint, 1);
				}
				
				if(startingPoint.getMonth() == 0)
					chartTitle = startingPoint.getFullYear() + " Q1";
				else if(startingPoint.getMonth() == 3)
					chartTitle = startingPoint.getFullYear() + " Q2";
				else if(startingPoint.getMonth() == 6)
					chartTitle = startingPoint.getFullYear() + " Q3";
				else if(startingPoint.getMonth() == 9)
					chartTitle = startingPoint.getFullYear() + " Q4";
					
				break;
			case 2:
				//yearView - 12 months
				stepSize = "month";
				stepCount = 12;
				if(!startingPoint) {
					//by default, focus on the current year
					startingPoint = new Date(this.today.getFullYear(), 0, 1);
				}
				
				chartTitle = startingPoint.getFullYear();
				
				break;
		}
		//generate the header, and the lowRange & highRange
		var chartHeader = this.getHeader(startingPoint, stepSize, stepCount);
		
		$$('#'+this.targetElement+' .canvasGrids')[0].innerHTML = chartHeader;
		
		this.updateChartTitle(chartTitle);
		
		this.resetData();
		
		var showCompletedTasks = (document.getElementById(this.targetElement+"_showCompletedTasks").checked ? 1 : 0);
		
		xajax_chartView_loadTaskData((this.lowRange / 1000), (this.highRange / 1000), this.instanceName, showCompletedTasks, this.criteria);
		//request data over AJAX, with a callback function "myChartView.renderView();"
	}
	
	//render the view
	this.renderView = function() {

		//go through the pool and see which tasks need to be displayed
		//the backend is going to determine which tasks are going to be displayed, sorted in ascending order *grouped by PROJECTS*.
		//this front-end just shows EVERYTHING in the pool.
		var javascriptCodes = "";
		var sidebarCode = "", canvasCode = "", currentParentID = "", itemGroupClass = "";
		var groupStartPoint = null, groupEndPoint = 0;
		var canvasWidth = $$("#"+this.targetElement+" .canvas")[0].getWidth() - 1;
		var projectCompleted = true, projectOverdue = false;
		
		this.JSCode = "";

		for(var UID in this.allItems) {
			
			itemDetail = this.allItems[UID];
			
			if(itemDetail["ParentID"] != currentParentID) {
				//this is a new group
				
				if(this.currentViewType == 1 || this.currentViewType == 2)
					itemGroupClass = 'itemGroup collapsed';
				else
					itemGroupClass = 'itemGroup expanded';
				
				if(sidebarCode) {
					//close the previous group
					sidebarCode += "</div></div>";
					canvasCode +="</div></div>";
					
					var bracketClass = "";
					
					if(projectOverdue) {
						bracketClass += " groupBracket_Overdue";
					}
					else if(projectCompleted) {
						bracketClass += " groupBracket_Completed";
						if(itemGroupClass == "itemGroup expanded") {
							javascriptCodes += this.instanceName + ".toggleGroup('"+currentParentID+"', 'collapsed');";
							//collapse
						}
					}

					if(groupEndPoint < this.lowRange) {
						//no bracket!
						var bracketCode = "<div class='groupBracket bracketLabelLeft "+bracketClass+"' onclick='"+this.instanceName+".prev();'>&larr;</div>";
					}
					else if(groupStartPoint > this.highRange) {
						var bracketCode = "<div class='groupBracket bracketLabelRight "+bracketClass+"' onclick='"+this.instanceName+".next();'>&rarr;</div>";
					}
					else {
						
						
						if(groupStartPoint < this.lowRange) {
							groupStartPoint = this.lowRange;
							bracketClass += " groupBracket_NoStart";
						}

						if(groupEndPoint > this.highRange) {
							bracketClass += " groupBracket_NoEnd";
							groupEndPoint = this.highRange;
						}

						var groupLength = groupEndPoint - groupStartPoint;

						var bracketPosition = this.getTimelinePosition(groupStartPoint);
						var bracketLength = this.getTimelineLength(groupLength);

						var bracketCode = "<div id='"+currentParentID+"_"+bracketPosition+"_"+bracketLength+"' class='groupBracket "+bracketClass+"' style='left:"+(bracketPosition * this.stepLength[this.currentViewType])+"px;width:"+(bracketLength * this.stepLength[this.currentViewType] - 4)+"px' onclick=\""+this.instanceName+".toggleGroup('"+currentParentID+"');\"></div>";

					}
					
					
					canvasCode = canvasCode.replace("<!--"+currentParentID+"-->", bracketCode);

					
					projectCompleted = true;
					projectOverdue = false;
					
					groupStartPoint = null;
					groupEndPoint = 0;
					
				}
				
				if($('taskGroup_'+itemDetail["ParentID"]+'_R')) {
					if($('taskGroup_'+itemDetail["ParentID"]+'_R').hasClassName('collapsed'))
						itemGroupClass = 'itemGroup collapsed';
					else
						itemGroupClass = 'itemGroup expanded';
				}
				
				sidebarCode+="<div class='"+itemGroupClass+"' id='taskGroup_"+itemDetail["ParentID"]+"_L'><a href='javascript:void(0)' class='collapseBoxHandle' onclick=\"if(event.shiftKey) "+this.instanceName+".toggleAll($('taskGroup_"+itemDetail["ParentID"]+"_L').className); else "+this.instanceName+".toggleGroup('"+itemDetail["ParentID"]+"');\"></a><span class='groupTitle' title=\""+this.allParents[itemDetail["ParentID"]].Title+"\" onclick=\"switchTo('"+itemDetail["ParentID"]+"')\">"+this.allParents[itemDetail["ParentID"]].Title+"</span><a href='javascript:void(0)' class='newTaskButton' onclick=\"ClipIt('"+itemDetail["ParentID"]+"', 'NewTask',  event.clientX, event.clientY + (window.pageYOffset?window.pageYOffset:document.body.scrollTop), '')\">&#43;</a><div class='collapseBox'>";
				canvasCode+="<div class='"+itemGroupClass+"' id='taskGroup_"+itemDetail["ParentID"]+"_R'><!--"+itemDetail["ParentID"]+"--><div class='collapseBox'>";
				
				currentParentID = itemDetail["ParentID"];
				
			}
			
			taskStartDate = Date.parse(itemDetail["StartingDate"]);
			
			if(groupStartPoint == null || taskStartDate < groupStartPoint)
				groupStartPoint = taskStartDate;
				
			
			taskDueDate = Date.parse(itemDetail["DueDate"]);
			
			if(itemDetail["CompletionDate"])
				var completionDate = Date.parse(itemDetail["CompletionDate"]);
			
			if(itemDetail["Status"] && completionDate > taskStartDate)
				taskDueDate = completionDate;
				
			//determine the position and length of the task
			var tmp = new Date(taskDueDate);

			if(!tmp.getHours() && !tmp.getMinutes()) {
				taskDueDate += 24*3600*1000 - 1;
				//automatically move the deadline to the end of the day.
			}
			
			if(groupEndPoint < taskDueDate)
				groupEndPoint = taskDueDate;
			
			if(!itemDetail["Status"])	projectCompleted = false;

			if(!itemDetail["Status"] && (taskDueDate + 1) < this.today.getTime())	projectOverdue = true;
					
			if(taskDueDate < this.lowRange || taskStartDate > this.highRange)	continue;
			
			checkMarkCode = "<div id='Task_"+itemDetail["UID"]+"_DB_CheckBox' onclick=\"MarkTask('"+itemDetail["UID"]+"')\" class='chartView_colorBox chartView_colorBox_"+(itemDetail["Color"]?itemDetail["Color"]:0)+" "+(itemDetail["Status"]?"chartView_colorBox_checked":"")+"'><div class='chartView_colorBox_checkMark'></div></div>";

			if(this.criteria != "") {
				sidebarCode += "<div class='itemLine'></span>"+this.renderText(itemDetail["Title"])+"</div>";
			}
			else {
				sidebarCode += "<div class='itemLine' id='Task_"+itemDetail["UID"]+"_DB' title=\""+itemDetail["Title"]+"\">" + checkMarkCode + this.renderText(itemDetail["Title"])+"</div>";
			}
			
			canvasCode+="<div class='itemLine' id='itemLine_"+itemDetail["UID"]+"'>"+this.renderItemBar(itemDetail)+"</div>";
			
		}
		
		if(sidebarCode) {
			//close the previous group
			sidebarCode += "</div>";
			canvasCode += "</div>";
			
			var bracketClass = "";
			
			
			if(projectOverdue) {
				bracketClass += " groupBracket_Overdue";
			}
			else if(projectCompleted) {
				bracketClass += " groupBracket_Completed";
				if(itemGroupClass == "itemGroup expanded") {
					javascriptCodes += this.instanceName + ".toggleGroup('"+currentParentID+"', 'collapsed');";
					//collapse
				}
			}
			
			if(groupEndPoint < this.lowRange) {
				//no bracket!
				var bracketCode = "<div class='groupBracket bracketLabelLeft "+bracketClass+"' onclick='"+this.instanceName+".prev();'>&larr;</div>";
			}
			else if(groupStartPoint > this.highRange) {
				var bracketCode = "<div class='groupBracket bracketLabelRight "+bracketClass+"' onclick='"+this.instanceName+".next();'>&rarr;</div>";
			}
			else {
				
				if(groupStartPoint < this.lowRange) {
					groupStartPoint = this.lowRange;
					bracketClass += " groupBracket_NoStart";
				}

				if(groupEndPoint > this.highRange) {
					bracketClass += " groupBracket_NoEnd";
					groupEndPoint = this.highRange;
				}
					
				var groupLength = groupEndPoint - groupStartPoint;

				var bracketPosition = this.getTimelinePosition(groupStartPoint);
				var bracketLength = this.getTimelineLength(groupLength);

				var bracketCode = "<div id='"+currentParentID+"_"+bracketPosition+"_"+bracketLength+"' class='groupBracket "+bracketClass+"' style='left:"+(bracketPosition * this.stepLength[this.currentViewType])+"px;width:"+(bracketLength * this.stepLength[this.currentViewType] - 4)+"px' onclick=\""+this.instanceName+".toggleGroup('"+currentParentID+"');\"></div>";

			}
			
			canvasCode = canvasCode.replace("<!--"+currentParentID+"-->", bracketCode);
		}
		
		$$('#'+this.targetElement+' .leftSideBar')[0].innerHTML = sidebarCode;
		$$('#'+this.targetElement+' .canvasContent')[0].innerHTML = canvasCode;
		
		this.adjustDimension();
		
		$(this.targetElement).removeClassName('loading');
		
		//eval(this.JSCode);
		//this code is going to be adjusted during the adjustDimension event

		if(javascriptCodes)	eval(javascriptCodes);
		
		var titleTimeout = setTimeout(this.instanceName+".hideTitle();", 2000);
		

	}
	
	this.renderText = function(text) {
		if(text.indexOf("@") != -1)
			text = text.replace(/@(\S+)/g, "<a class='Topic_TagSelection nonFloat' href='javascript:void(0)' onclick=\"SwitchTag('$1')\">$1</a>");
			
		return text;
	}

	this.toggleGroup = function(groupID, target) {
		
		if(target && $('taskGroup_'+groupID+'_L').hasClassName(target))	return false;
		
		$('taskGroup_'+groupID+'_L').toggleClassName("collapsed");
		$('taskGroup_'+groupID+'_R').toggleClassName("collapsed");
		$('taskGroup_'+groupID+'_L').toggleClassName("expanded");
		$('taskGroup_'+groupID+'_R').toggleClassName("expanded");
		
		this.adjustDimension();
	}

	this.toggleAll = function(currentItemStatus) {

		var action = "expanded";
		
		if(currentItemStatus.indexOf("collapsed") != -1)
			action = "collapsed";
		
		for(var UID in this.allParents) {

			if($('taskGroup_'+UID+'_L') && $('taskGroup_'+UID+'_L').hasClassName(action))
				this.toggleGroup(UID);
			
		}
		
	}

	this.renderItemBar = function(itemDetail) {
		
		//determine the position and length of the task
		var taskStartDate = Date.parse(itemDetail["StartingDate"]);
		var taskDueDate = Date.parse(itemDetail["DueDate"]);
		
		if(itemDetail["CompletionDate"])
			var completionDate = Date.parse(itemDetail["CompletionDate"]);
			
		if(itemDetail["Status"] && completionDate > taskStartDate)
			taskDueDate = completionDate;
			//use the actual completion date
		
		var tmp = new Date(taskDueDate);
		var barLabel = "";
		
		if(!tmp.getHours() && !tmp.getMinutes()) {
			taskDueDate += 24*3600*1000 - 1;
			//automatically move the deadline to the end of the day.
		}
		
		var taskDuration = taskDueDate - taskStartDate;
		
		//determine the bar type and color
		var barClass = "progressBar";
		
		if(itemDetail["Status"] == 1) {
			barClass += " progressBar_Completed";
			var taskCompletionDate = Date.parse(itemDetail["CompletionDate"]);
			var tmp2 = new Date(taskCompletionDate);
			barLabel = this.localization.phrase["Completed on"]+" "+this.months[tmp2.getMonth() + 1]+" "+tmp2.getDate();
		}
		else {
			
			if(taskDueDate < this.today.getTime())
				barClass += " progressBar_Red";
			else if(taskStartDate > (this.today.getTime() + 24*3600*1000))
				barClass += " progressBar_Grey";
			else if(taskStartDate >= this.today.getTime())
				barClass += " progressBar_Green";
			else
				barClass += " progressBar_Blue";
			
			tmp = new Date(taskStartDate);
			barLabel = this.months[tmp.getMonth()+1]+" "+tmp.getDate() + " - ";
			tmp = new Date(taskDueDate);
			barLabel += this.months[tmp.getMonth()+1]+" "+tmp.getDate();
		}

		
		
		if(taskStartDate < this.lowRange) {
			barClass+=" noStart";
			taskDuration -= this.lowRange - taskStartDate;
		}
		if(taskDueDate > this.highRange)
			barClass+=" noEnd";
		
		//determine the bar position (left) and length, based on the current viewType
		var stepLength = 0;
		var barLength = 0;
		var barPosition = 0;
		var stepSize;
		if(this.currentViewType == 0) {
			
			stepSize = 24*3600*1000;
			//24 hours for one day, in milliseconds
			
		}
		else if(this.currentViewType == 1) {
			//12 weeks
			stepSize = 24*3600*7*1000;
			//7 days, in milliseconds
		}
		else if(this.currentViewType == 2) {
			//12 months
			stepSize = 365*24*3600 / 12;
		}
		
		
		barLength = this.getTimelineLength(taskDuration);
		//if(barLength < 1) barLength = 1;
		
		barPosition = this.getTimelinePosition(taskStartDate);
		
		//var dblClickCode = "ClipIt('"+itemDetail["UID"]+"', 'ModifyTask', event.clientX, event.clientY + (window.pageYOffset?window.pageYOffset:document.body.scrollTop), '')";
		var singleClickCode = "if("+this.instanceName+".dragged) "+this.instanceName+".dragged = false; else ClipIt('"+itemDetail["UID"]+"', 'objectViewer', event.clientX, event.clientY + (window.pageYOffset?window.pageYOffset:document.body.scrollTop));";
		if(this.criteria != "") {
			singleClickCode = "";
		}
		
		var calculatedBarLength = barLength * this.stepLength[this.currentViewType];
		
		if(barClass.indexOf("progressBar_Completed") != -1)
			calculatedBarLength -= 4;
		
		var itemBarCode = "<div id='"+itemDetail["UID"]+"_"+barPosition+"_"+barLength+"' class='"+barClass+"' style='margin-left:"+(barPosition * this.stepLength[this.currentViewType])+"px;width:"+calculatedBarLength+"px' title=\""+barLabel+"\n"+itemDetail["Title"]+"\" onclick=\""+singleClickCode+"\">"+(barLength >= 3 ? barLabel:"")+(this.criteria == "" ? "<div class='resizeHandle'></div>":"")+"</div>";
		
		if(itemDetail["Status"] != 1 && this.criteria == "")
			this.JSCode += "new Draggable('"+itemDetail["UID"]+"_"+barPosition+"_"+barLength+"', {constraint:'horizontal', snap:["+this.instanceName+".stepLength["+this.currentViewType+"],0], onEnd:function(obj){"+this.instanceName+".dragFinished(); "+this.instanceName+".moveItem(obj.element.id, obj.element.style.left);}}); new Resizable('"+itemDetail["UID"]+"_"+barPosition+"_"+barLength+"', {constraint:'horizontal', snap:["+this.instanceName+".stepLength["+this.currentViewType+"],0], handle:'resizeHandle', onEnd:function(obj){"+this.instanceName+".dragFinished(); "+this.instanceName+".resizeItem(obj.element.id, obj.element.style.width);}});\n";
		
		return itemBarCode;
		
	}
	
	this.moveItem = function(objectID, objectLeft) {
		
		var Values = objectID.split("_");
		var itemUID = Values[0];
		var startingPoint = Values[1];
		var itemOriginalLength = Values[2];
		
		objectLeft = parseInt(objectLeft) / this.stepLength[this.currentViewType];
		
		if(objectLeft != 0) {

			xajax_chartView_adjustTask(itemUID, "StartDate", this.currentStepSize, objectLeft, this.instanceName);
			
		}
		
	}
	
	this.resizeItem = function(objectID, objectWidth) {
		var Values = objectID.split("_");
		var itemUID = Values[0];
		var startingPoint = Values[1];
		var itemOriginalLength = Values[2];
		
		objectWidth = parseInt(objectWidth);
		
		if(objectWidth <= 2) {
			$(objectID).style.width = itemOriginalLength * this.stepLength[this.currentViewType] + 'px';
			return;
		}
		
		if(objectWidth != itemOriginalLength * this.stepLength[this.currentViewType]) {

			var difference = Math.round((objectWidth / this.stepLength[this.currentViewType] - itemOriginalLength) * 100) / 100;
			xajax_chartView_adjustTask(itemUID, "DueDate", this.currentStepSize, difference, this.instanceName);
			
		}
	}
	
	this.dragFinished = function() {
		this.dragged = true;
		setTimeout(this.instanceName+".dragged = false", 250);
	}
	
	this.getTimelinePosition = function(timestamp) {
		
		if(this.lowRange >= timestamp)	return 0;
		
		var canvasWidth = $$("#"+this.targetElement+" .canvas")[0].getWidth() - 1;
		var barPosition = null;
		
		var stepSize = 0, stepLength = 0;
		
		if(this.currentViewType == 0) {
			//21 days - 4.76%
			//stepLength = Math.round(100 * 100 / 21) / 100;
			stepLength = 4.75;
			
			stepSize = 24*3600*1000;
			//24 hours for one day, in milliseconds
			
		}
		else if(this.currentViewType == 1) {
			//12 weeks
			//stepLength = Math.round(100 * 100 / 12) / 100;
			stepLength = 8.30;
			stepSize = 24*3600*7*1000;
			//7 days, in milliseconds
		}
		else if(this.currentViewType == 2) {
			//12 months
			
			var tmp = new Date(timestamp);
			barPosition = tmp.getMonth();

			if(tmp.getDate() > 1) {
				//determine the bar location within that month
				var tmp2 = new Date(tmp.getFullYear(), tmp.getMonth()+1, 1);
				var firstDayNextMonth = tmp2.getTime();
				
				tmp2 = new Date(tmp.getFullYear(), tmp.getMonth(), 1);
				var firstDayThisMonth = tmp2.getTime();
				var totalTimeThisMonth = firstDayNextMonth - firstDayThisMonth;
				
				barPosition += Math.round((tmp.getTime() - firstDayThisMonth) * 100 / totalTimeThisMonth) / 100;
			}

			//stepLength = Math.round(100 * 100 / 12) / 100;
			//stepLength = 8.30;
			
			//stepSize = 365*24*3600*1000 / 12;
			//30 days, in milliseconds
		}
		
		if(barPosition == null)
			barPosition = (Math.round((timestamp - this.lowRange) * 100 / stepSize) / 100);
			
		//barPosition = barPosition * stepLength;// + (Math.floor(barPosition) / canvasWidth) * 50;
		
		return barPosition;
	}
	
	this.getTimelineLength = function(timestamp) {
		var stepSize = 0, stepLength = 0;
		
		var canvasWidth = $$("#"+this.targetElement)[0].getWidth() - 1;
		
		if(this.currentViewType == 0) {
			//21 days - 4.76%
			//stepLength = Math.round(100 * 100 / 21) / 100;
			stepLength = 4.75;
			
			stepSize = 24*3600*1000;
			//24 hours for one day, in milliseconds
			
		}
		else if(this.currentViewType == 1) {
			//12 weeks
			//stepLength = Math.round(100 * 100 / 12) / 100;
			stepLength = 8.30;
			stepSize = 24*3600*7*1000;
			//7 days, in milliseconds
		}
		else if(this.currentViewType == 2) {
			//12 months
			//stepLength = Math.round(100 * 100 / 12) / 100;
			//stepLength = 8.30;
			stepSize = 365*24*3600*1000 / 12;
			//30 days, in milliseconds
		}
		
		barLength = (Math.round((timestamp * 100) / stepSize) / 100);	//4.76
 		//barLength = barLength * stepLength;	// + (Math.round(barLength) / canvasWidth) * 100;

		if(barLength > 100)	barLength = 100;

		return barLength;
		
	}

	this.getHeader = function(startingDate, stepSize, stepCount) {
		
		var headerCode = "", gridContent = "", gridClass="";
		var highlightGrid = false;
		
		this.currentStepSize = stepSize;
		this.totalStepCount = stepCount;
		this.lowRange = startingDate.getTime();
		
		
		var currentDate = startingDate;
		for(i=1; i<=stepCount; i++) {
			
			highlightGrid = false;
			
			if(stepSize=="day") {
			
				gridClass = "";
				
				if(currentDate.getFullYear() == this.today.getFullYear() && currentDate.getMonth() == this.today.getMonth() && currentDate.getDate() == this.today.getDate()) {
					highlightGrid = true;
					gridContent = "<span>"+this.localization.phrase["Today"]+"</span><span>"+this.weekdays[currentDate.getDay()]+"</span>";
				}
				else {
					if(currentDate.getDay() == 6 || currentDate.getDay() == 0)
						gridClass='specialGrid';
						
					gridContent = "<span>"+(currentDate.getDate() == 1 ? this.months[currentDate.getMonth() + 1] : currentDate.getDate())+"</span><span>"+this.weekdays[currentDate.getDay()]+"</span>";
				}	
				
				currentDate.setDate(currentDate.getDate() + 1);
			}
			else if(stepSize=="week") {
				
				var delta = (this.today.getTime() - currentDate.getTime()) / 1000;
				
				if(delta >= 0 && delta < 24*7*3600)
					highlightGrid = true;
					
				gridContent = "<span>"+this.months[currentDate.getMonth()+1] + " " + currentDate.getDate()+"</span><span>Wk "+i+"</span>";
				currentDate.setDate(currentDate.getDate() + 7);
			}
			else if(stepSize=="month") {
				
				if(currentDate.getFullYear() == this.today.getFullYear() && currentDate.getMonth() == this.today.getMonth())
					highlightGrid = true;
					
				gridContent = "<span>"+this.months[currentDate.getMonth() + 1]+"</span><span>"+this.months[currentDate.getMonth() + 1]+"</span>";
				currentDate.setMonth(currentDate.getMonth() + 1);
			}
			
			headerCode += "<div class='"+stepSize+"Grid "+gridClass+" "+(highlightGrid == true ? "currentGrid":"")+"'>"+gridContent+"</div>";
			
		}

		this.highRange = currentDate.getTime();

		return headerCode;
	}
	
	this.updateChartTitle = function(newTitle) {
		$$("#"+this.targetElement+" h1")[0].innerHTML = newTitle;
		$$("#"+this.targetElement+" h1")[0].removeClassName("hide");
	}
	
	this.hideTitle = function() {
		$$("#"+this.targetElement+" h1")[0].addClassName("hide");
	}
	
	this.refresh = function() {
		
		this.loadData(this.lowRange);
		//this.renderView();
	}
}
