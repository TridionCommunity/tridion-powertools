$evt.addEventHandler($display, "start", ShowPublishTask$onDisplayStarted);

function ShowPublishTask$onDisplayStarted() 
{
    $evt.removeEventHandler($display, "start", ShowPublishTask$onDisplayStarted);

    if ($display.getView().getId() == "PublishQueueView") 
	{
        var btnShowTask = $controls.getControl($("#BtnShowTasks"), "Tridion.Controls.Button");
        if (btnShowTask) 
		{
            btnShowTask.fireEvent("click");
        }
    }
}
