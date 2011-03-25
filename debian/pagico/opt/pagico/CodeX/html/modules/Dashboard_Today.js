function Dashboard_PostponeSomedayTask(taskID) {
	
	Effect.BlindUp('Task_MI_'+taskID, {duration:0.3});
	
	xajax_Dashboard_PostponeSomedayTask(taskID);
}
/*
InitDashboardFlowchart();

function InitDashboardFlowchart()
{
	var WindowWidth;
	
	if(Browser == "Explorer")
		WindowWidth = document.documentElement.clientWidth;
	else
		WindowWidth = window.innerWidth;

		var FlowchartWidth = WindowWidth - 210 - 186;
	
	$('FlowChart_RightPanel_Today').style.width = FlowchartWidth + 'px';
	
	var leftBound = 0 - (1720 - FlowchartWidth);
	var rightBound = 1720 - FlowchartWidth;
	
	
	new Draggable('FlowChart_Canvas_Today',{
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
		//constrain(x, -560, parent_dimensions.width - element_dimensions.width + 560),

	    revert:false,
		endeffect:function(){}
	  });
	
	MoveFlowChart('center', 1);
	//setTimeout("Effect.Appear('FlowChart_Controls_Today', {duration:0.2});", 500);
	
	//alert('1');
	xajax_getTodayTasks();
}

function PrintFlowChart(Path)
{
	window.open(Path, "Pagico", "width=820, height=600, toobar=no, menubar=no, scrollbars=yes, resizable=yes, location=no, status=no");	
}

function MoveFlowChart(Offset, fast)
{
	var WindowWidth;
	
	if(Browser == "Explorer")
		WindowWidth = document.documentElement.clientWidth;
	else
		WindowWidth = window.innerWidth;
		
	var FlowchartWidth = WindowWidth - 210 - 186;
		
	
	
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
		$('FlowChart_Canvas_Today').style.left = Offset + "px";
	else
		new Effect.Morph('FlowChart_Canvas_Today', {style:'left:'+Offset+'px'});
		
}

function GetDashboardFlowchart()
{
	xajax_GetDashboardFlowchart();
}

function ShowDashboardListButton(TaskID)
{
	if(inInbox(TaskID))	TaskID = "Inbox";
	
	var listButton = document.getElementById('DashboardListButton_'+TaskID);
	if(!listButton)	return;
	
	if(listButton.style.visibility != 'visible')	listButton.style.visibility = 'visible';
}

function HideDashboardListButton(TaskID)
{
	if(inInbox(TaskID))	TaskID = "Inbox";
	
	var listButton = document.getElementById('DashboardListButton_'+TaskID);
	if(!listButton)	return;
	
	if(listButton.style.visibility != 'hidden')	listButton.style.visibility = 'hidden';
}

function effectFunction() {
	return;
}
*/
