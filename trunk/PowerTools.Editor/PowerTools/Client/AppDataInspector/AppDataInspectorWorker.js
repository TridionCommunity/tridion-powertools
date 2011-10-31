Type.registerNamespace("PowerTools");

// Constructs a new worker. Reads item TcmUri from URL.
PowerTools.AppDataInspectorWorker = function ()
{
    this.properties = [];
    var p = this.properties;
    p.processId = null;
    p.itemId = $url.getHashParam("id");
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
};

// Initiate the call to the service to retrieve all Application Data for the given item
PowerTools.AppDataInspectorWorker.prototype.execute = function ()
{
    $log.message("Executing AppDataInspectorWorker...");

    // prepare UI
    $j('#tbody').html("<tr><td colspan=\"3\">Loading...</td></tr>");
    $j('#ProgressBar').css({ 'width': '1%', 'display': 'block' });
    $j('#ProgressStatus').html("Progress");
    $j('#CloseDialog').hide();

    var dialog = $j("#dialog");
    var win = $j(window);
    //Get the window height and width
    var winH = win.height();
    var winW = win.width();

    //Set the popup window to center
    dialog.css({
        "top": (winH - dialog.height()) / 2,
        "left": (winW - dialog.width()) / 2
    }).fadeIn(400);

    // initiate service call
    var p = this.properties;
    var onSuccess = Function.getDelegate(this, this._onExecuteStarted);
    var onFailure = null;
    var context = null;

    PowerTools.Model.Services.AppDataInspector.Execute(p.itemId, onSuccess, onFailure, context, false);
};

// Once the call for app data has been initialised, this call back will start polling for progress status updates
PowerTools.AppDataInspectorWorker.prototype._onExecuteStarted = function (result)
{
    if (result)
    {
        this._pollStatus(result.Id);
    }
};

// Initiate the call for actual data. This call back is called once the service Execute method completed 
// and data is ready on the service to be picked up.
PowerTools.AppDataInspectorWorker.prototype._getData = function (id)
{
    if (id != "")
    {
        $log.debug("Retrieving AppDataInspectorData for process #" + id);
        var onSuccess = Function.getDelegate(this, this._handleDataResponse);
        var onFailure = null;
        var context = null;
        PowerTools.Model.Services.AppDataInspector.GetData(onSuccess, onFailure, context, false);
    }
};

// Call back handling the actual response with Application Data data. Update the UI.
PowerTools.AppDataInspectorWorker.prototype._handleDataResponse = function (response)
{
    var p = this.properties;
    var content = "";
    var i = 0;
    response.each(function (elem)
    {
        content += "<tr class=\"row" + (i % 2) + "\"><td>" + $ptUtils.wbr($ptUtils.htmlEncode(elem.ApplicationId), 12) +
                "</td><td>" + $ptUtils.wbr($ptUtils.htmlEncode(elem.Value), 12) +
                "</td><td>" + $ptUtils.wbr($ptUtils.htmlEncode(elem.Type), 12) +
                "</td</tr>";
        i++;
    });

    if (!content)
    {
        content = "<tr class=\"row0\"><td colspan=\"3\" align=\"center\">No data found</td></tr>";
    }

    $j('#tbody').html(content);

    // hide progress bar
    $j('#mask, .window').hide();
    $j('#ProgressStatus').html("");
    $j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
};

// Initiate progress status update requests to the service. Schedules itself to run again after pollInterval is reached.
PowerTools.AppDataInspectorWorker.prototype._pollStatus = function (id)
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

// Call back that handles progress status reponses. If process completed, call _getData to retrieve the data. Update UI.
PowerTools.AppDataInspectorWorker.prototype._handleStatusResponse = function (result)
{
    $log.message("Handle Status Response...");
    var p = this.properties;
    p.processId = result.Id;
    $j('#ProgressStatus').html(result.Status);
    $j('#ProgressBar').css({ 'width': result.PercentComplete + '%', 'display': 'block' });

    if (result.PercentComplete < 100)
    {
        this._pollStatus(p.processId);
    }
    else
    {
        this._getData(p.processId);
        $j('#ProgressStatus').html(result.Status);
        p.processId = "";
    }
}

// Register this class with the Namespace
PowerTools.AppDataInspectorWorker.registerClass("PowerTools.AppDataInspectorWorker");
