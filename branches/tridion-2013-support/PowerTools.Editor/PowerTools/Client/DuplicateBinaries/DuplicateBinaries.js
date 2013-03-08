Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.DuplicateBinaries = function () {
    Type.enableInterface(this, "PowerTools.Popups.DuplicateBinaries");
    this.addInterface("Tridion.Cme.View");
    this.addInterface("PowerToolsBase", [this]);
    var p = this.properties;
    p.processId = null;
    p.folderId = null;
    p.pollInterval = 500;
    // Optional: set properties for the progressbar/modal dialog
    p.progressDialogSettings.closeAfterComplete = true; 
};

// Read parameters and assign callbacks for buttons in the GUI
PowerTools.Popups.DuplicateBinaries.prototype.initialize = function () {
    $log.message("Initializing DuplicateBinaries popup...");
    this.callBase("Tridion.Cme.View", "initialize");
    var p = this.properties;
    var c = p.controls;
    p.orgItemId = $url.getHashParam("orgItemId");

    // hide the results table
    $j("#resultsTable").hide();
};


// Performs a service call on the publication id to find any duplicate file names
PowerTools.Popups.DuplicateBinaries.prototype._onExecuteButtonClicked = function () {
    var p = this.properties;
    var onSuccess = Function.getDelegate(this, this._onExecuteStarted);
    var onFailure = null;
    var context = null;
    var publicationId = p.orgItemId;

    $log.message("Duplicate binaryready to execute process for Publication : " + publicationId);
    PowerTools.Model.Services.DuplicateBinaries.Execute(publicationId, onSuccess, onFailure, context, false);
    $log.message("Duplicate binary searching within : " + publicationId);
};


// todo
PowerTools.Popups.DuplicateBinaries.prototype._handleDuplicateBinaryData = function (response) {

    // let the user know something is happening
    $j("#resultsTable").show();
    $j("#tbody").html("<tr><td colspan=\"5\">Loading...</td></tr>");


    var content = "";
    var i = 0;

    response.each(function (elem) {
        content += "<tr><td width=\"16\"><div class=\"tabImgIcon\"></div></td>" +
        "<td>" + elem.ItemTcmId + "</td><td>" + elem.ItemFileName + "</td</tr>";
        i++;
    });

    if (!content) {
        content = "<tr id=\"noResults\"><td colspan=\"3\">There are no duplicate items in this publication.</td></tr>";
    }


    $j("#tbody").html(content);
};

// todo
PowerTools.Popups.DuplicateBinaries.prototype.afterSuccess = function (processId) {
    if (processId != "") {
        $log.debug("Retrieving Duplicate File Names for process #" + processId);
        var onSuccess = Function.getDelegate(this, this._handleDuplicateBinaryData);
        var onFailure = null;
        var context = null;
        PowerTools.Model.Services.DuplicateBinaries.GetDuplicateBinaryData(onSuccess, onFailure, context, false);
    }
}

$display.registerView(PowerTools.Popups.DuplicateBinaries);
