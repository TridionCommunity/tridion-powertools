
//If you only want your code to affect certain screens/views, you should listen to Anguilla events like this:
$evt.addEventHandler($display, "start", tabloader$onDisplayStarted);

// This callback is called when any view has finished loading
function tabloader$onDisplayStarted() 
{
    $evt.removeEventHandler($display, "start", tabloader$onDisplayStarted);
    var tabName = $url.getHashParam("tab");
	var tabContainer = $("#MasterTabControl");

    if (tabName && tabContainer) 
	{
        var tabControl = $controls.getControl(tabContainer, "Tridion.Controls.TabControl");
        tabControl.selectItem(tabName);        
    }
}
