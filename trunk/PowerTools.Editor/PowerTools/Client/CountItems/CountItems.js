Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.CountItems = function ()
{
    Type.enableInterface(this, "PowerTools.Popups.CountItems");
    this.addInterface("Tridion.Cme.View");

    var p = this.properties;

    p.processId = null;
    p.folderId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
};

PowerTools.Popups.CountItems.prototype.initialize = function ()
{
    $log.message("Initializing CountItems popup...");
    this.enableCheckboxes();
    this.callBase("Tridion.Cme.View", "initialize");

    var p = this.properties;
    var c = p.controls;

    p.orgItemId = $url.getHashParam("orgItemId");

    c.ExecuteButton = $controls.getControl($("#ExecuteButton"), "Tridion.Controls.Button");
    c.CloseButton = $controls.getControl($("#CloseDialog"), "Tridion.Controls.Button");

    $evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._onExecuteButtonClicked));
    $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onCloseButtonClicked));
};

PowerTools.Popups.CountItems.prototype.enableCheckboxes = function ()
{
    $log.message("Setting checkboxes enabled status");

    var orgItemId = $url.getHashParam("orgItemId");
    switch ($models.getItemType(orgItemId))
    {
        case $const.ItemType.PUBLICATION:
            $j('#FolderChk').attr('checked', true);
            $j('#ComponentChk').attr('checked', true);
            $j('#StructureGroupChk').attr('checked', true);
            $j('#PageChk').attr('checked', true);
            break;

        case $const.ItemType.FOLDER:
            $j('#FolderChk').attr('checked', true);
            $j('#ComponentChk').attr('checked', true);
            $j('#StructureGroupChk').attr('disabled', true);
            $j('#PageChk').attr('disabled', true);
            break;

        case $const.ItemType.STRUCTURE_GROUP:
            $j('#FolderChk').attr('disabled', true);
            $j('#ComponentChk').attr('disabled', true);
            $j('#StructureGroupChk').attr('checked', true);
            $j('#PageChk').attr('checked', true);
            break;
    }
}

PowerTools.Popups.CountItems.prototype._onExecuteButtonClicked = function ()
{
    $j('#CloseDialog').hide();

    var p = this.properties;
    p.countFolders = $j('#FolderChk').attr('checked');
    p.countComponents = $j('#ComponentChk').attr('checked');
    p.countStructureGroups = $j('#StructureGroupChk').attr('checked');
    p.countPages = $j('#PageChk').attr('checked');

    var onSuccess = Function.getDelegate(this, this._onExecuteStarted);
    var onFailure = null;
    var context = null;
    PowerTools.Model.Services.CountItems.Execute(p.orgItemId, p.countFolders, p.countComponents, p.countStructureGroups, p.countPages,
            onSuccess, onFailure, context, false);

    var dialog = $j("#dialog");
    var win = $j(window);

    //Get the screen height and width
    var maskHeight = $j(document).height();
    var maskWidth = win.width();

    //Set height and width to mask to fill up the whole screen
    //$j('#mask').css({ 'width': maskWidth, 'height': maskHeight }).fadeIn(1000).fadeTo("slow", 0.8);

    //Get the window height and width
    var winH = win.height();
    var winW = win.width();

    //Set the popup window to center
    dialog.css({ "top": (winH / 2 - dialog.height() / 2),
        "left": (winW / 2 - dialog.width() / 2)
    }).fadeIn(400);
};

PowerTools.Popups.CountItems.prototype._onCloseButtonClicked = function ()
{
    $j('#mask, .window').hide();
    $j('#ProgressStatus').html("");
    $j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
};

PowerTools.Popups.CountItems.prototype._updateProgressBar = function (process)
{
    $j('#ProgressStatus').html(process.Status);
    $j('#ProgressBar').css({ 'width': process.PercentComplete + '%', 'display': 'block' });
}

PowerTools.Popups.CountItems.prototype._handleStatusResponse = function (result)
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
        this._getCountItemsData(p.processId);
        $j('#ProgressStatus').html(result.Status);
        //$j('#CloseDialog').show();
        this._onCloseButtonClicked();
        p.processId = "";
    }
}

PowerTools.Popups.CountItems.prototype._handleCountItems = function (response)
{
    var p = this.properties;

    if (p.countFolders)
    {
        $j('#FolderSet span').html(response.Folders);
        $j('#FolderSet').show();
    } else { $j('#FolderSet').hide(); }

    if (p.countComponents)
    {
        $j('#ComponentSet span').html(response.Components);
        $j('#ComponentSet').show();
    } else { $j('#ComponentSet').hide(); }

    if (p.countStructureGroups)
    {
        $j('#StructureGroupSet span').html(response.StructureGroups);
        $j('#StructureGroupSet').show();
    } else { $j('#StructureGroupSet').hide(); }

    if (p.countPages)
    {
        $j('#PageSet span').html(response.Pages);
        $j('#PageSet').show();
    } else { $j('#PageSet').hide(); }
};

PowerTools.Popups.CountItems.prototype._getCountItemsData = function (id)
{
    if (id != "")
    {
        var onSuccess = Function.getDelegate(this, this._handleCountItems);
        var onFailure = null;
        var context = null;
        PowerTools.Model.Services.CountItems.GetCountItemsData(onSuccess, onFailure, context, false);
    }
};

PowerTools.Popups.CountItems.prototype._pollStatus = function (id)
{
    var onSuccess = Function.getDelegate(this, this._handleStatusResponse);
    var onFailure = null;
    var context = null;

    var callback = function ()
    {
        $log.debug("Checking the status of process #" + id);
        PowerTools.Model.Services.CountItems.GetProcessStatus(id, onSuccess, onFailure, context, false);
    };

    setTimeout(callback, this.properties.pollInterval);
}

PowerTools.Popups.CountItems.prototype._onExecuteStarted = function (result)
{
    if (result)
    {
        this._pollStatus(result.Id);
    }
};

$display.registerView(PowerTools.Popups.CountItems);
