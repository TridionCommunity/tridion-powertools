Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.MarkUnpublished = function MarkUnpublished$constructor()
{
    Type.enableInterface(this, "PowerTools.Popups.MarkUnpublished");
    this.addInterface("Tridion.Cme.View");
	this.addInterface("PowerToolBase", [this]);

    var p = this.properties;

    p.processId = null;
    p.orgItemUri = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
};

PowerTools.Popups.MarkUnpublished.prototype.initialize = function MarkUnpublished$initialize()
{
    this.callBase("Tridion.Cme.View", "initialize");

    var p = this.properties;
    var c = p.controls;

    p.orgItemUri = $url.getHashParam("orgItemUri");

    $log.message("p.orgItemUri (from $url.getHashParam(orgItemUri): " + p.orgItemUri), "info";

    c.RecursiveControl = $controls.getControl($("#Recursive"), "Tridion.Controls.Dropdown");

    //this manages the selection of recursive or not (perhaps use a select control!!)
    $evt.addEventHandler(c.RecursiveControl, "change", this.getDelegate(this.onSelectControl));

    //add control to show
    // components (and associated pages) marked as unpublished
    // pages marked as unpublished
    // - hidden here, shown on success
};

PowerTools.Popups.MarkUnpublished.prototype._onExecuteButtonClicked = function MarkUnpublished$_onExecuteButtonClicked()
{
    var p = this.properties;
    var recursive = "Y"; //TODO: read from DDL.Recursive

    var onSuccess = this.getDelegate(this._onExecuteStarted);
    PowerTools.Model.Services.MarkUnpublished.Execute(p.orgItemId, recursive, onSuccess, this.getErrorHandler());
};

$display.registerView(PowerTools.Popups.MarkUnpublished);
