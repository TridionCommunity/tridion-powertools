Type.registerNamespace("PowerTools2011.Popups");

PowerTools2011.Popups.Example = function ()
{
	Type.enableInterface(this, "PowerTools2011.Popups.Example");
	this.addInterface("Tridion.Cme.View");

	var p = this.properties;

	p.processId = null;
	p.pollInterval = 500; //Milliseconds between each call to check the status of a process
};

PowerTools2011.Popups.Example.prototype.initialize = function ()
{
	$log.message("initializing example popup...");

	this.callBase("Tridion.Cme.View", "initialize");

	var p = this.properties;
	var c = p.controls;

	c.ExecuteButton = $controls.getControl($("#ExecuteButton"), "Tridion.Controls.Button");
	c.SelectButton = $controls.getControl($("#SelectItem"), "Tridion.Controls.Button");
	c.CloseButton = $controls.getControl($("#CloseDialog"), "Tridion.Controls.Button");

    

	$evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._onExecuteButtonClicked));
	$evt.addEventHandler(c.SelectButton, "click", this.getDelegate(this._onSelectButtonClicked));
	$evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onCloseButtonClicked));
};

PowerTools2011.Popups.Example.prototype._onSelectButtonClicked = function () {




    //Callback method for ItemSelector 'insert' event.
    var onSelectDialogItemInsert = function onSelectDialogItemInsert(event) {
        var selectedItems = event.data.items;
        $j("#SelectedItem").html(" You selected: {0}".format(selectedItems[0]));

    };
    
    //Callback method for ItemSelector 'unload' event.
    var onSelectDialogClosed = function onSelectDialogClosed(event) {
        var p = this.properties;
        if (p.popup) {
            p.popup.dispose();
            p.popup = null;
        }
    };

    //Construct url to itemselector. 
    //1e param -> RootID. Where to start in the Treeview of the ItemSelector. (Organizational item. E.g.: tcm:1-1-2)
    //2e param -> Which item to pre-select in the dashboard view of the ItemSelector. (E.g. "tcm:1-1-16")
    var dialogUrl = $cme.Popups.ITEM_SELECT.URL.format("", "");
    var dialogFeatures = $cme.Popups.ITEM_SELECT.FEATURES; //Constant. 

    //Initialize filter. (Which itemtypes to show, basedOnSchema, etc). 
    //For a complete list see: ItemSelectControl.js in %tridion install%\web\webui\Editors\CME\Controls\ItemSelect\. Function: Tridion.Controls.ItemSelectControl.prototype.setOptions = function ItemSelectControl$setOptions(options) 
    var filterDefinition = new Tridion.ContentManager.ListFilter();
    filterDefinition.conditions.ItemTypes = [$const.ItemType.COMPONENT, $const.ItemType.COMPONENT_TEMPLATE];

    //Some more examples for the filter:
    //var filter = new Tridion.ContentManager.ListFilter();
    //filter.conditions.ItemTypes = [$const.ItemType.CATEGORY, $const.ItemType.KEYWORD];
    //filter.conditions.BasedOnItem = selection.getItems();
    //filter.columns = $const.ColumnFilter.DEFAULT | $const.ColumnFilter.ALLOWED_ACTIONS | $const.ColumnFilter.EXTENDED;

    var popUp = Tridion.Controls.Popup.create(
			dialogUrl,
			dialogFeatures,
			{
			    filter: filterDefinition,
			    isListThumbnails: false, //List thumbnails for binaries?
			    singleSelection: true    //Allow multiple selections? 
			});

    $evt.addEventHandler(popUp, "insert", onSelectDialogItemInsert); //Bind callback function to 'insert' event. In this event you define what to do with the selected items.
    $evt.addEventHandler(popUp, "unload", onSelectDialogClosed); //Bind callback function to 'unload'. Properly dispose the popup.
    popUp.open();

}

PowerTools2011.Popups.Example.prototype._onExecuteButtonClicked = function ()
{
    $j('#CloseDialog').hide();
    
    var p = this.properties;

	var onSuccess = Function.getDelegate(this, this._onExecuteStarted);
	var onFailure = null;
	var context = null;

	PowerTools2011.Model.Services.Example.Execute(onSuccess, onFailure, context, false);


	var dialog = $j("#dialog");
	var win = $j(window);

	//Get the screen height and width
	var maskHeight = $j(document).height();
	var maskWidth = win.width();

	//Set height and width to mask to fill up the whole screen
	$j('#mask').css({ 'width': maskWidth, 'height': maskHeight }).fadeIn(1000).fadeTo("slow", 0.8);

	//Get the window height and width
	
	var winH = win.height();
	var winW = win.width();

	//Set the popup window to center
	dialog.css({ "top": (winH / 2 - dialog.height() / 2),
		"left": (winW / 2 - dialog.width() / 2)
	}).fadeIn(2000);
};

PowerTools2011.Popups.Example.prototype._onCloseButtonClicked = function ()
{
	$j('#mask, .window').hide();
	$j('#ProgressStatus').html("");
	$j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
};

PowerTools2011.Popups.Example.prototype._updateProgressBar = function (process)
{
	$j('#ProgressStatus').html(process.Status);
	$j('#ProgressBar').css({ 'width': process.PercentComplete + '%', 'display': 'block' });
}

PowerTools2011.Popups.Example.prototype._handleStatusResponse = function (result)
{
	var p = this.properties;

	p.processId = result.Id;

	this._updateProgressBar(result);

	if (result.PercentComplete < 100)
	{
	    this._pollStatus(p.processId);
	}
	else {
	    $j('#ProgressStatus').html(result.Status);
	    $j('#CloseDialog').show();
		p.processId = ""
	}
}

PowerTools2011.Popups.Example.prototype._pollStatus = function (id)
{
    var onFailure = null;
    var onSuccess = Function.getDelegate(this, this._handleStatusResponse);
    var context = null;

    var callback = function ()
    {
        $log.debug("Checking the status of process #" + id);
        PowerTools2011.Model.Services.Example.GetProcessStatus(id, onSuccess, onFailure, context, false);
    };

    setTimeout(callback, this.properties.pollInterval);
}

PowerTools2011.Popups.Example.prototype._onExecuteStarted = function (result)
{
    if (result)
    {
        this._pollStatus(result.Id);
    }
};


$display.registerView(PowerTools2011.Popups.Example);
