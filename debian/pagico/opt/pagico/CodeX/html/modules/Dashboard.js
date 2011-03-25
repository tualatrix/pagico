var FinishedTasks = new Array();
var Freeze = 0;

function Init()
{
	FinishedTasks = new Array();
	Freeze = 0;
}


function SwitchSelect(value)
{
	if(value)
	{
		document.getElementById('AddTask_Advanced').style.display = 'block';
	}
	else
	{
		document.getElementById('NewTask_Form').reset();
		document.getElementById('AddTask_Advanced').style.display = 'none';
	}
}

function SwitchTasks()
{
	if(Freeze)	return;

	document.getElementById('FinishedTasks_CheckBox').disabled = true;
	
	Freeze = 1;
	
	if(document.getElementById('FinishedTasks_CheckBox').checked)
	{
		if(FinishedTasks.length>100)
		{
			for(i=0;i<FinishedTasks.length;i++)
			{
				//Effect.BlindDown('TaskItem_'+FinishedTasks[i], {duration:0.5});
				document.getElementById('TaskItem2_'+FinishedTasks[i]).style.display = 'block';
			}			
		}
		else
		{
			for(i=0;i<FinishedTasks.length;i++)
			{
				Effect.BlindDown('TaskItem2_'+FinishedTasks[i], {duration:0.7});
				//document.getElementById('TaskItem2_'+FinishedTasks[i]).style.display = 'block';
			}	
		}
	}
	else
	{
		if(FinishedTasks.length>100)
		{
			for(i=0;i<FinishedTasks.length;i++)
			{
				//Effect.BlindDown('TaskItem2_'+FinishedTasks[i], {duration:0.5});
				document.getElementById('TaskItem2_'+FinishedTasks[i]).style.display = 'none';
			}			
		}
		else
		{
			for(i=0;i<FinishedTasks.length;i++)
			{
				Effect.BlindUp('TaskItem2_'+FinishedTasks[i], {duration:0.5});
				//document.getElementById('TaskItem2_'+FinishedTasks[i]).style.display = 'block';
			}	
		}
	}
	
	setTimeout("Freeze = 0;document.getElementById('FinishedTasks_CheckBox').disabled = false;", 700);
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

function dashboard_ScrollToThisWeek() {
	
	if(document.getElementById('Group_Tasks_ThisWeek')) {
		myScrollTo('x_Content', 'Group_Tasks_ThisWeek');
	}
}
