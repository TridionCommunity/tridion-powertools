// setup and initialize interface
Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.Help = function () {
    Type.enableInterface(this, "PowerTools.Popups.Help");
    this.addInterface("Tridion.Cme.View");
    //this.addInterface("PowerToolsBase", [this]);

    var p = this.properties;

    p.processId = null;
    p.folderId = null;
    p.pollInterval = 500;
};

PowerTools.Popups.Help.prototype.initialize = function() {
    $log.message("Initializing Help Pop-up");
    this.callBase("Tridion.Cme.View", "initialize");
    var p = this.properties;
    var c = p.controls;
    
    c.TabControl = $controls.getControl($("#HelpTabControl"), "Tridion.Controls.TabControl");
    
    this._setupControls();
};

PowerTools.Popups.Help.prototype._setupControls = function _setupControls() {
    $log.message("Help Pop-up setting up controls");

    var p = this.properties;
    var c = p.controls;

    /*
    var page = c.TabControl.getPage("dpgContactUs");
    if (page) {
        c.TabControl.showItem(page);
        c.TabControl.selectItem(page);
    }
    */
};

$display.registerView(PowerTools.Popups.Help);
