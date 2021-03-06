﻿Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.FieldRemover = function ()
{

    Type.enableInterface(this, "PowerTools.Popups.FieldRemover");
    this.addInterface("Tridion.Cme.View");

    var p = this.properties;

    p.processId = null;
    p.folderId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
};

PowerTools.Popups.FieldRemover.prototype.initialize = function ()
{

    $log.message("initializing example popup...");

    this.callBase("Tridion.Cme.View", "initialize");

    var p = this.properties;
    var c = p.controls;

    p.folderId = $url.getHashParam("folderId");

    c.ExecuteButton = $controls.getControl($("#ExecuteButton"), "Tridion.Controls.Button");
    c.CloseButton = $controls.getControl($("#CloseDialog"), "Tridion.Controls.Button");
    //c.SchemaControl = $controls.getControl($("#Schema"), "Tridion.Controls.Dropdown");

    //$evt.addEventHandler(c.SchemaControl, "loadcontent", this.getDelegate(this.onSchemaLoadContent));
    $evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._onExecuteButtonClicked));
    $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onCloseButtonClicked));
};

PowerTools.Popups.FieldRemover.prototype._onExecuteButtonClicked = function ()
{
    $j('#CloseDialog').hide();

    var p = this.properties;

    //-Schema Uri (ItemSelector)
    var schemaUri = p.controls.SchemaControl.getValue();
    //-Local directory on the server
    /*
    var localDirectory = $j("#Main_SourceFolder").val();

    var onSuccess = this.getDelegate(this._onExecuteStarted);
    var onFailure = null;
    var context = null;
    */
    PowerTools.Model.Services.FieldRemover.Execute(localDirectory, p.folderId, schemaUri, onSuccess, onFailure, context, false);

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

PowerTools.Popups.FieldRemover.prototype._onCloseButtonClicked = function ()
{
    $j('#mask, .window').hide();
    $j('#ProgressStatus').html("");
    $j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
};

/*
PowerTools.Popups.FieldRemover.prototype.onSchemaLoadContent = function (e) {
    
var schemaList = this.getListFieldsSchemas($const.SchemaPurpose.MULTIMEDIA);

if (schemaList) {
var dropdown = this.properties.controls.SchemaControl;
function Component$onSchemaLoadContent$listLoaded() {
$evt.removeEventHandler(schemaList, "load", Component$onSchemaLoadContent$listLoaded);
dropdown.setContent(schemaList.getXml());
}

if (schemaList.isLoaded(true)) {
Component$onSchemaLoadContent$listLoaded();
}
else {
$evt.addEventHandler(schemaList, "load", Component$onSchemaLoadContent$listLoaded);
schemaList.load();
}
}

};
*/
/*
PowerTools.Popups.FieldRemover.prototype.getListFieldsSchemas = function (purpose) 
{
var p = this.properties;

var folder = $models.getItem(p.folderId);
var publication = folder.getPublication();
var list = publication.getListSchemas(purpose);
return list;
}
*/

PowerTools.Popups.FieldRemover.prototype._updateProgressBar = function (process)
{

    $j('#ProgressStatus').html(process.Status);
    $j('#ProgressBar').css({ 'width': process.PercentComplete + '%', 'display': 'block' });
}

PowerTools.Popups.FieldRemover.prototype._handleStatusResponse = function (result)
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

PowerTools.Popups.FieldRemover.prototype._pollStatus = function (id)
{
    var onFailure = null;
    var onSuccess = this.getDelegate(this._handleStatusResponse);
    var context = null;

    var callback = function ()
    {
        $log.debug("Checking the status of process #" + id);
        PowerTools.Model.Services.FieldRemover.GetProcessStatus(id, onSuccess, onFailure, context, false);
    };

    setTimeout(callback, this.properties.pollInterval);
}

PowerTools.Popups.FieldRemover.prototype._onExecuteStarted = function (result)
{
    if (result)
    {
        this._pollStatus(result.Id);
    }
};



$display.registerView(PowerTools.Popups.FieldRemover);
