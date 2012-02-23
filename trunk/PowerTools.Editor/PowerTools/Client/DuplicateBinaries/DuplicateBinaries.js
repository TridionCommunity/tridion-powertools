Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.DuplicateBinaries = function () {
   
    Type.enableInterface(this, "PowerTools.Popups.DuplicateBinaries");
    this.addInterface("Tridion.Cme.View");
    this.addInterface("PowerToolsBase", [this]);
    
    var p = this.properties;

    p.processId = null;
    p.folderId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process  
    
    //Optional: set properties for the progressbar/modal dialog
    p.progressDialog = { showAnimation: true, closeAfterComplete: false };

};

// Read parameters and assign callbacks for buttons in the GUI
PowerTools.Popups.DuplicateBinaries.prototype.initialize = function () {
    $log.message("Initializing DuplicateBinaries popup...");
    this.callBase("Tridion.Cme.View", "initialize");
    var p = this.properties;
    var c = p.controls;
    p.orgItemId = $url.getHashParam("orgItemId");   
};



// Performs a service call on the publication id to find any duplicate file names
PowerTools.Popups.DuplicateBinaries.prototype._onExecuteButtonClicked = function ()
{
    var p = this.properties;
    var onSuccess = Function.getDelegate(this, this._onExecuteStarted);   
    var onFailure = null;
    var context = null;

    PowerTools.Model.Services.DuplicateBinaries.Execute("tcm:0-1-2", true, onSuccess, onFailure, context, false);
    $log.message("Duplicate binary searching is completed");
};

PowerTools.Popups.DuplicateBinaries.prototype.afterSuccess = function (processId) {
    if (processId != "") {
        alert("this is the after success message");
    }
}

$display.registerView(PowerTools.Popups.DuplicateBinaries);
