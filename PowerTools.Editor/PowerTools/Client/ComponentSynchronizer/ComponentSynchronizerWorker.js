Type.registerNamespace("PowerTools");

// Constructs a new worker. Reads item TcmUri from URL.
PowerTools.ComponentSynchronizerWorker = function () {
    this.properties = [];
    var p = this.properties;
    p.processId = null;
    p.itemId = $url.getHashParam("id");
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
    p.tableRefreshInterval = 500;
};

// Initiate the call to the service to retrieve all Application Data for the given item
PowerTools.ComponentSynchronizerWorker.prototype.execute = function (sel, ref) {
    $log.message("Executing ComponentSynchronizer...");

    // prepare UI
    //JAIME: NOT NEEDED: REMOVE MODAL DIALOG (MAKE IT OPTIONAL)
    $j('#ModalDialog').css({ 'width': '1%', 'display': 'none' });    
    $j('#pbImage').css({ 'background-position': '-120px 50%' });
    $j('#processComplete').html("&nbsp;- 0%");
    

    

    //JAIME: CLOSE BUTTON INSTEAD: $j('#CloseDialog').hide();

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

    $log.message("Calling WS for: " + sel.getItems() + " Ref: " + ref);
    PowerTools.Model.Services.ComponentSynchronizer.Execute(sel.getItems(), ref, onSuccess, onFailure);
};

// Once the call for app data has been initialised, this call back will start polling for progress status updates
PowerTools.ComponentSynchronizerWorker.prototype._onExecuteStarted = function (result)
{
    if (result)
    {
        this._pollStatus(result.Id);
    }
};

// Initiate progress status update requests to the service. Schedules itself to run again after pollInterval is reached.
PowerTools.ComponentSynchronizerWorker.prototype._pollStatus = function (id) {
    var onSuccess = Function.getDelegate(this, this._handleStatusResponse);
    var onFailure = null;
    var context = null;

    var onSuccess2 = Function.getDelegate(this, this._handleStatusResponse);
    var onFailure2 = null;
    var context2 = null;


    var p = this.properties;


    var callback = function () {
        //$log.debug("Checking the status of process #" + id);
        PowerTools.Model.Services.ComponentSynchronizer.GetProcessStatus(id, onSuccess, onFailure, context, false);
    };   

    
    p.statusPollFunction = setTimeout(callback, this.properties.pollInterval);
}


// Call back that handles progress status reponses. If process completed, call _getData to retrieve the data. Update UI.
PowerTools.ComponentSynchronizerWorker.prototype._handleProcessedResponse = function (result) {

    var callback2 = function () {
        var rows = $j('#UsedInList_frame_details').contents().find('tr[id^="item_"]');
        for (var i = 0; i < 10; i++) {
            var origId = $j(rows[i]).attr('id');
            var tcmURI = origId.replace("item_", "");
            var onSuccess2 = Function.getDelegate(this, this._handleProcessedResponse);
            var onFailure2 = null;
            $log.message("id: " + id + " uri:" + tcmURI);
            PowerTools.Model.Services.ComponentSynchronizer.IsItemProcessed(id, tcmURI, onSuccess2, onFailure2, context2, false);
        }
    }
    
    alert("URI: " + result.ComponentURI);
    var row = $j('#UsedInList_frame_details').contents().find('tr[id^="' + result.ComponentURI + '"]');
    $j(rows).attr('id', 'processed_' + origId);
    var column = $j("td", $j(row))[2];
    $j(column).html("Jaime " + itemId);
}




// Call back that handles progress status reponses. If process completed, call _getData to retrieve the data. Update UI.
PowerTools.ComponentSynchronizerWorker.prototype._handleStatusResponse = function (result) {
    //$log.message("Handle Status Response...");
    var p = this.properties;
    p.processId = result.Id;
    var percentage = -120 + result.PercentComplete;
    var value = percentage + 'px 50%';
    $j('#pbImage').css({ 'background-position': value });
    $j('#processComplete').html("&nbsp;- " + result.PercentComplete + "% - " + result.Status);


    if (result.PercentComplete < 100) {
        this._pollStatus(p.processId);
    }
    else {
        p.processId = "";
        clearTimeout(p.statusPollFunction);
        clearTimeout(p.processedItemsPollFunction);        

        $j('#UsedInList_frame_details').contents().find('tr[id^="item_"]').each(function (index) {
            var origId = $j(this).attr('id');
            $j(this).attr('id', 'processed_' + origId);
            var column = $j("td", $j(this))[2];
            $j(column).html("Jaime");
        });
    }
}

// Register this class with the Namespace
PowerTools.ComponentSynchronizerWorker.registerClass("PowerTools.ComponentSynchronizerWorker");
