
//If you only want your code to affect certain screens/views, you should listen to Anguilla events like this:
$evt.addEventHandler($display, "start", onDisplayStarted);

// This callback is called when any view has finished loading
function onDisplayStarted() {

    $evt.removeEventHandler($display, "start", onDisplayStarted);
    var tabname = $url.getHashParam("tab");
    if (tabname != '') {
        var tabControl = $controls.getControl($("#MasterTabControl"), "Tridion.Controls.TabControl");
        tabControl.selectItem(tabname);        
    }
}
