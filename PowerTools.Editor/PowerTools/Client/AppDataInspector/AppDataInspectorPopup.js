Type.registerNamespace("PowerTools.Popups");

// Construct new instance of this popup
PowerTools.Popups.AppDataInspector = function(element)
{
    Type.enableInterface(this, "PowerTools.Popups.AppDataInspector");
    this.addInterface("Tridion.Cme.View");
    this.addInterface("PowerToolsBase", [this]);
};

// Attach event handling for Refresh button and initiate execution
PowerTools.Popups.AppDataInspector.prototype.initialize = function()
{
    this.callBase("Tridion.Cme.View", "initialize");

    var p = this.properties;
    var c = p.controls;

    c.RefreshButton = $controls.getControl($("#RefreshButton"), "Tridion.Controls.Button");
    $evt.addEventHandler(c.RefreshButton, "click", this.getDelegate(this._execute));

    this._execute();
};

// Call method AppDataInspectorWorkder.execute() in order to kickoff AppData retrieval in this popup
// The same worker is also used from the Tab JS handler (AppDataInspectorTab.js).
PowerTools.Popups.AppDataInspector.prototype._execute = function()
{
    var worker = new PowerTools.AppDataInspectorWorker();
    worker.execute();
};

// Register this popup with the framework
$display.registerView(PowerTools.Popups.AppDataInspector);
