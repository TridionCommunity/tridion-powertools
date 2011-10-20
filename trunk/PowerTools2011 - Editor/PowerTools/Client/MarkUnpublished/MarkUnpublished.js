Type.registerNamespace("PowerTools2011.Popups");

PowerTools2011.Popups.MarkUnpublished = function () {

    Type.enableInterface(this, "PowerTools2011.Popups.MarkUnpublished");
    this.addInterface("Tridion.Cme.View");

    var p = this.properties;
    
    p.processId = null;
    p.orgItemUri = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
};

PowerTools2011.Popups.MarkUnpublished.prototype.initialize = function () {
    
    $log.message("initializing MarkUnpublished popup...");

    this.callBase("Tridion.Cme.View", "initialize");

    var p = this.properties;
    var c = p.controls;

    p.orgItemUri = $url.getHashParam("orgItemUri");

    $log.message("p.orgItemUri (from $url.getHashParam(orgItemUri): " + p.orgItemUri), "info";

    c.ExecuteButton = $controls.getControl($("#ExecuteButton"), "Tridion.Controls.Button");
    c.CloseButton = $controls.getControl($("#CloseDialog"), "Tridion.Controls.Button");
    c.RecursiveControl = $controls.getControl($("#Recursive"), "Tridion.Controls.Dropdown");
    
    //this manages the selection of recursive or not (perhaps use a select control!!)
    $evt.addEventHandler(c.RecursiveControl, "change", this.getDelegate(this.onSelectControl));
    $evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._onExecuteButtonClicked));
    $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onCloseButtonClicked));

    //add control to show
    // components (and associated pages) marked as unpublished
    // pages marked as unpublished
    // - hidden here, shown on success
};

PowerTools2011.Popups.MarkUnpublished.prototype._onExecuteButtonClicked = function () {
    //$j('#CloseDialog').hide();

    var p = this.properties;
    var recursive = "Y"; //TODO: read from DDL.Recursive

    var onSuccess = Function.getDelegate(this, this._onExecuteStarted);
    var onFailure = null;
    var context = null;

    PowerTools2011.Model.Services.MarkUnpublished.Execute(p.orgItemId, recursive, onSuccess, onFailure, context, false);

};

PowerTools2011.Popups.MarkUnpublished.prototype._onCloseButtonClicked = function () {

    //$j('#mask, .window').hide();
    $j('#ProgressStatus').html("");
    $j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });

    alert('CLOSE? But....');
};


PowerTools2011.Popups.MarkUnpublished.prototype._updateProgressBar = function (process) {
    
    $j('#ProgressStatus').html(process.Status);
    $j('#ProgressBar').css({ 'width': process.PercentComplete + '%', 'display': 'block' });
}

PowerTools2011.Popups.MarkUnpublished.prototype._handleStatusResponse = function (result)
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

PowerTools2011.Popups.MarkUnpublished.prototype._pollStatus = function (id)
{
    var onFailure = null;
    var onSuccess = Function.getDelegate(this, this._handleStatusResponse);
    var context = null;

    var callback = function ()
    {
        $log.debug("Checking the status of process #" + id);
        PowerTools2011.Model.Services.MarkUnpublished.GetProcessStatus(id, onSuccess, onFailure, context, false);
    };

    setTimeout(callback, this.properties.pollInterval);
}

PowerTools2011.Popups.MarkUnpublished.prototype._onExecuteStarted = function (result)
{
    if (result)
    {
        this._pollStatus(result.Id);
    }
};



$display.registerView(PowerTools2011.Popups.MarkUnpublished);
