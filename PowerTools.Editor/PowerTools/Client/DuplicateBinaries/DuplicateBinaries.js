Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.DuplicateBinaries = function DuplicateBinaries$constructor() 
{
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
PowerTools.Popups.DuplicateBinaries.prototype.initialize = function DuplicateBinaries$initialize() 
{
    this.callBase("Tridion.Cme.View", "initialize");
    this.properties.orgItemId = $url.getHashParam("orgItemId");

    // hide the results table
    $css.undisplay($("#resultsTable"));
};


// Performs a service call on the publication id to find any duplicate file names
PowerTools.Popups.DuplicateBinaries.prototype._onExecuteButtonClicked = function DuplicateBinaries$_onExecuteButtonClicked() 
{
    var p = this.properties;
    var publicationId = p.orgItemId;
    var onSuccess = this.getDelegate(this._onExecuteStarted);
    PowerTools.Model.Services.DuplicateBinaries.Execute(publicationId, onSuccess, this.getErrorHandler());
};


PowerTools.Popups.DuplicateBinaries.prototype._handleDuplicateBinaryData = function DuplicateBinaries$_handleDuplicateBinaryData(response) 
{
    // let the user know something is happening
	var tableBody = $("#tbody");
    $css.display($("#resultsTable"));

    var content = "";

    response.each(function (elem) {
        content += "<tr><div class=\"tabImgIcon\"></div></td>" +
        "<td>" + elem.ItemTcmId + "</td><td>" + elem.ItemFileName + "</td</tr>";
    });

    if (!content) {
        content = "<tr id=\"noResults\"><td colspan=\"2\">There are no duplicate binaries in this Publication.</td></tr>";
    }

    tableBody.innerHTML = content;
};

PowerTools.Popups.DuplicateBinaries.prototype.afterSuccess = function DuplicateBinaries$afterSuccess(processId)
{
	if (processId != "")
	{
		var onSuccess = this.getDelegate(this._handleDuplicateBinaryData);
		PowerTools.Model.Services.DuplicateBinaries.GetDuplicateBinaryData(onSuccess, this.getErrorHandler());
	}
};

$display.registerView(PowerTools.Popups.DuplicateBinaries);
