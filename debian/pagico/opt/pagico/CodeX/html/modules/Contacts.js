function TrashContact(ID)
{
	if(confirm("Are you sure to delete this contact?\n"+document.getElementById('x_ContactName').innerHTML))
	{
		xajax_TrashContact(ID);
	}
}

function Toggle_Activity(Open)
{
	if(Open==1)
	{
		
		if(document.getElementById('CreateNew_Body').style.height != '100px')
		{
			$('CreateNew_Activity_File').src = 'about:blank';
			$('CreateNew_Activity_File').src = '/html/modules/Contacts_Profile_file.php?ActivityID=AUTO';			
		}
		
		document.getElementById('CreateNew_Activity').style.display = 'block';
		
		document.getElementById('CreateNew_Body').style.height = '100px';
		
	}
	else
	{
		document.getElementById('CreateNew_Activity').style.display = 'none';
		document.getElementById('CreateNew_Body').style.height = '25px';
	}
}

function TrashNote(NoteID)
{
	Effect.BlindUp('Note_'+NoteID, {duration:0.2});
	
	xajax_TrashNote(NoteID);
}

function AddNewTask()
{
	xajax_AddNewTask("AUTO", xajax.getFormValues('NewTask_Form'));
	document.getElementById('NewTask_Form').reset();
}

function EditTask(TaskID)
{
	xajax_AddNewTask(TaskID, xajax.getFormValues('TaskForm_'+TaskID));
	//document.getElementById('TaskForm_'+TaskID).reset();
}

function Toggle_TaskEdit(TaskID, ToggleDueDate)
{
	if(document.getElementById('Task_'+TaskID+'_Display').style.display!='none')
	{
		document.getElementById('Task_'+TaskID+'_Display').style.display = 'none';
		document.getElementById('Task_'+TaskID+'_Edit').style.display = 'block';
		
		if(ToggleDueDate)
			document.getElementById('TaskForm_'+TaskID).DueDate.focus();
		else
			document.getElementById('TaskForm_'+TaskID).Title.focus();
	}
	else
	{
		document.getElementById('Task_'+TaskID+'_Edit').style.display = 'none';
		document.getElementById('Task_'+TaskID+'_Display').style.display = 'block';
	}
}

function CheckProfileTask(TaskID)
{
	if(document.getElementById('Task_CheckBox_'+TaskID).checked)
	{
		document.getElementById('Task_DateTime_'+TaskID).className = 'ProfileTask_DueDate Todo_Date_Done';
	}
	else
	{
		document.getElementById('Task_DateTime_'+TaskID).className = 'ProfileTask_DueDate';
	}

	xajax_CheckProfileTask(TaskID, document.getElementById('Task_CheckBox_'+TaskID).checked);
}

function AddNewActivity()
{
	xajax_AddActivity("AUTO", xajax.getFormValues('NewActivity_Form'));
	
	document.getElementById('NewActivity_Form').reset();
	
	Toggle_Activity(0);
}

function Toggle_ActivityEdit(ActivityID, SaveOrNot)
{
	if(document.getElementById('Activity_'+ActivityID+'_Display').style.display!='none')
	{
		document.getElementById('Activity_'+ActivityID+'_Display').style.display = 'none';
		document.getElementById('Activity_'+ActivityID+'_Edit').style.display = 'block';
		
		document.getElementById('NewActivity_Form').style.visibility = 'hidden';
	}
	else
	{
		document.getElementById('Activity_'+ActivityID+'_Edit').style.display = 'none';
		document.getElementById('Activity_'+ActivityID+'_Display').style.display = 'block';
		document.getElementById('NewActivity_Form').style.visibility = 'visible';
		
		if(SaveOrNot)
		{
			xajax_AddActivity(ActivityID, xajax.getFormValues("ActivityForm_"+ActivityID));
		}

		document.getElementById('ActivityForm_'+ActivityID).reset();
	}
}

function TrashActivity(ActivityID)
{
	Effect.BlindUp('Activity_'+ActivityID, {duration:0.2});
	xajax_TrashActivity(ActivityID);
}

function TrashProfileTask(TaskID)
{
	Effect.BlindUp('Task_'+TaskID+'_PT', {duration:0.2});
	xajax_TrashProfileTask(TaskID);
}

function TrashAttachment(ActivityID, AttachmentID)
{
	Effect.Fade('Attachment_'+AttachmentID, {duration:0.2});
	
	xajax_TrashAttachment(ActivityID, AttachmentID);
}


function PrintContact()
{
	window.open('/html/Print_Profile.php?DataAddress='+Status_CurrentID, "Pagico", "width=1024, height=500, toobar=no, menubar=no, scrollbars=yes, resizable=yes, location=no, status=no");
}

function StartArchive(Deadline)
{
	$('Archive_Btn').disabled = true;
	xajax_StartArchive(Status_CurrentID, Deadline);
}

function ToggleArchived()
{
	if($('Archived_Title').className == 'Contacts_ExpandedGroup')
	{
		$('Archived_Title').className = 'Contacts_CollapsedGroup';
		$('x_ArchivedContent').innerHTML = "";
	}
	else
	{
		$('Archived_Title').className = 'Contacts_ExpandedGroup';
		xajax_LoadArchive(Status_CurrentID);
	}
	
}
