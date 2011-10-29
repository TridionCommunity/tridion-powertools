Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.AppDataInspector = function ()
{
    Type.enableInterface(this, "PowerTools.Popups.AppDataInspector");
    this.addInterface("Tridion.Cme.View");

    var p = this.properties;
    p.processId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
};

// Read parameters and assign callbacks for buttons in the GUI
PowerTools.Popups.AppDataInspector.prototype.initialize = function ()
{
    $log.message("Initializing AppDataInspector popup...");
    this.callBase("Tridion.Cme.View", "initialize");

    var p = this.properties;
    var c = p.controls;

    p.itemId = $url.getHashParam("itemId");

    c.RefreshButton = $controls.getControl($("#RefreshButton"), "Tridion.Controls.Button");
    c.CloseButton = $controls.getControl($("#CloseDialog"), "Tridion.Controls.Button");

    $evt.addEventHandler(c.RefreshButton, "click", this.getDelegate(this._onRefreshButtonClicked));
    $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onCloseButtonClicked));

    this._onRefreshButtonClicked();
};

// Reads the checkboxes values and initiates a service call to get the item counts
PowerTools.Popups.AppDataInspector.prototype._onRefreshButtonClicked = function ()
{
    $j('#container tbody').html("<tr><td>Loading...</td></tr>");
    $j('#CloseDialog').hide();
    $j('#ProgressBar').css({ 'width': '1%', 'display': 'block' });
    $j('#ProgressStatus').html("Progress");
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
    dialog.css({
        "top": (winH / 2 - dialog.height() / 2),
        "left": (winW / 2 - dialog.width() / 2)
    }).fadeIn(400);

    var p = this.properties;
    var onSuccess = Function.getDelegate(this, this._onExecuteStarted);
    var onFailure = null;
    var context = null;

    PowerTools.Model.Services.AppDataInspector.Execute(p.itemId, onSuccess, onFailure, context, false);
};

PowerTools.Popups.AppDataInspector.prototype._onCloseButtonClicked = function ()
{
    $j('#mask, .window').hide();
    $j('#ProgressStatus').html("");
    $j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
};

PowerTools.Popups.AppDataInspector.prototype._updateProgressBar = function (process)
{
    $j('#ProgressStatus').html(process.Status);
    $j('#ProgressBar').css({ 'width': process.PercentComplete + '%', 'display': 'block' });
}

// Update status until process is not complete. Once complete, initial call for the AppDataInspectorData object.
PowerTools.Popups.AppDataInspector.prototype._handleStatusResponse = function (result)
{
    $log.message("Handle Status Response...");
    var p = this.properties;
    p.processId = result.Id;
    this._updateProgressBar(result);

    if (result.PercentComplete < 100)
    {
        this._pollStatus(p.processId);
    }
    else
    {
        this._getAppDataInspectorData(p.processId);
        $j('#ProgressStatus').html(result.Status);
        //$j('#CloseDialog').show();
        this._onCloseButtonClicked();
        p.processId = "";
    }
}

function htmlEncode(value)
{
    return $j('<div/>').text(value).html();
}

function htmlDecode(value)
{
    return $j('<div/>').html(value).text();
}

// We have a response with data. Fill in the values and visibility for each item type counts.
PowerTools.Popups.AppDataInspector.prototype._displayData = function (response)
{
    var p = this.properties;
    var content = "";
    response.each(function (elem)
    {
        content += "<tr><td>" + elem.ApplicationId + "</td><td>" + htmlEncode(elem.Value) + "</td></tr>";
    });

    $j('#container tbody').html(content);
};

// Initiate service async call for retrieving the counts data (after the process completed)
PowerTools.Popups.AppDataInspector.prototype._getAppDataInspectorData = function (id)
{
    if (id != "")
    {
        $log.debug("Retrieving AppDataInspectorData for process #" + id);
        var onSuccess = Function.getDelegate(this, this._displayData);
        var onFailure = null;
        var context = null;
        PowerTools.Model.Services.AppDataInspector.GetData(onSuccess, onFailure, context, false);
    }
};

PowerTools.Popups.AppDataInspector.prototype._pollStatus = function (id)
{
    var onSuccess = Function.getDelegate(this, this._handleStatusResponse);
    var onFailure = null;
    var context = null;

    var callback = function ()
    {
        $log.debug("Checking the status of process #" + id);
        PowerTools.Model.Services.AppDataInspector.GetProcessStatus(id, onSuccess, onFailure, context, false);
    };

    setTimeout(callback, this.properties.pollInterval);
}

PowerTools.Popups.AppDataInspector.prototype._onExecuteStarted = function (result)
{
    if (result)
    {
        this._pollStatus(result.Id);
    }
};

$display.registerView(PowerTools.Popups.AppDataInspector);
