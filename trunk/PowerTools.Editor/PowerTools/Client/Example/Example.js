Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.Example = function ()
{
    Type.enableInterface(this, "PowerTools.Popups.Example");
    this.addInterface("Tridion.Cme.View");

    var p = this.properties;

    p.processId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
};

PowerTools.Popups.Example.prototype.initialize = function ()
{
    $log.message("initializing example popup...");

    this.callBase("Tridion.Cme.View", "initialize");

    var p = this.properties;
    var c = p.controls;

    c.ExecuteButton = $controls.getControl($("#ExecuteButton"), "Tridion.Controls.Button");
    c.SelectButton = $controls.getControl($("#SelectItem"), "Tridion.Controls.Button");
    c.CloseButton = $controls.getControl($("#CloseDialog"), "Tridion.Controls.Button");
    c.PublicationsDropDown = $controls.getControl($("#Publications"), "Tridion.Controls.Dropdown");



    $evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._onExecuteButtonClicked));
    $evt.addEventHandler(c.SelectButton, "click", this.getDelegate(this._onSelectButtonClicked));
    $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onCloseButtonClicked));
    $evt.addEventHandler(c.PublicationsDropDown, "loadcontent", this.getDelegate(this._onPublicationsDropdownLoad));
    $evt.addEventHandler(c.PublicationsDropDown, "change", this.getDelegate(this._onPublicationsDropdownChange));

};


PowerTools.Popups.Example.prototype._onPublicationsDropdownChange = function ()
{
    var p = this.properties;

    $j("#selectedPublication").text(" You selected: {0}".format(p.controls.PublicationsDropDown.getValue()));
}

PowerTools.Popups.Example.prototype._onPublicationsDropdownLoad = function ()
{
    var publicationsList = this.getPublications();
    if (publicationsList)
    {
        var dropdown = this.properties.controls.PublicationsDropDown;

        function Component$onPublicationsDropdownLoad$listLoaded()
        {
            $evt.removeEventHandler(publicationsList, "load", Component$onPublicationsDropdownLoad$listLoaded);
            dropdown.setContent(publicationsList.getXml());
        }

        if (publicationsList.isLoaded(true))
        {
            Component$onPublicationsDropdownLoad$listLoaded();
        }
        else
        {
            $evt.addEventHandler(publicationsList, "load", Component$onPublicationsDropdownLoad$listLoaded);
            publicationsList.load();
        }
    }
};

//Returns a list with publications
PowerTools.Popups.Example.prototype.getPublications = function ()
{
    return $models.getItem($const.TCMROOT).getListPublications();
};


//Callback for itemselector. After the item is selected, this method is called.
PowerTools.Popups.Example.prototype._onSelected = function (event) {
    var selectedItems = event.data.items;
    $j("#SelectedItem").text(" You selected: {0}".format(selectedItems[0]));
};

PowerTools.Popups.Example.prototype._onSelectButtonClicked = function () {

    //Define filter
    var filterDefinition = new Tridion.ContentManager.ListFilter();
    filterDefinition.conditions.ItemTypes = [$const.ItemType.COMPONENT, $const.ItemType.COMPONENT_TEMPLATE];

    //Open popup
    $ptUtils.getItemSelector(null, null, filterDefinition, true, false, this._onSelected);


}

PowerTools.Popups.Example.prototype._onExecuteButtonClicked = function ()
{
    $j('#CloseDialog').hide();

    var p = this.properties;

    var onSuccess = Function.getDelegate(this, this._onExecuteStarted);
    var onFailure = null;
    var context = null;

    PowerTools.Model.Services.Example.Execute(onSuccess, onFailure, context, false);


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

PowerTools.Popups.Example.prototype._onCloseButtonClicked = function ()
{
    $j('#mask, .window').hide();
    $j('#ProgressStatus').html("");
    $j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
};

PowerTools.Popups.Example.prototype._updateProgressBar = function (process)
{
    $j('#ProgressStatus').html(process.Status);
    $j('#ProgressBar').css({ 'width': process.PercentComplete + '%', 'display': 'block' });
}

PowerTools.Popups.Example.prototype._handleStatusResponse = function (result)
{
    var p = this.properties;

    p.processId = result.Id;

    this._updateProgressBar(result);

    if (result.PercentComplete < 100)
    {
        this._pollStatus(p.processId);
    }
    else
    {
        $j('#ProgressStatus').html(result.Status);
        $j('#CloseDialog').show();
        p.processId = ""
    }
}

PowerTools.Popups.Example.prototype._pollStatus = function (id)
{
    var onFailure = null;
    var onSuccess = Function.getDelegate(this, this._handleStatusResponse);
    var context = null;

    var callback = function ()
    {
        $log.debug("Checking the status of process #" + id);
        PowerTools.Model.Services.Example.GetProcessStatus(id, onSuccess, onFailure, context, false);
    };

    setTimeout(callback, this.properties.pollInterval);
}

PowerTools.Popups.Example.prototype._onExecuteStarted = function (result)
{
    if (result)
    {
        this._pollStatus(result.Id);
    }
};


$display.registerView(PowerTools.Popups.Example);
