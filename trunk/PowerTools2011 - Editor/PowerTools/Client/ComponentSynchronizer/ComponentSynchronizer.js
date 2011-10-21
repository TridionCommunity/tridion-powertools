Type.registerNamespace("PowerTools2011.Popups");

PowerTools2011.Popups.ComponentSynchronizer = function () {
    Type.enableInterface(this, "PowerTools2011.Popups.ComponentSynchronizer");
    this.addInterface("Tridion.Cme.View");

    var p = this.properties;
    
    p.processId = null;
    p.folderId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
};

PowerTools2011.Popups.ComponentSynchronizer.prototype.initialize = function () {
    
    $log.message("initializing component Synchronizer popup...");

    this.callBase("Tridion.Cme.View", "initialize");

    var p = this.properties;
    var c = p.controls;

    p.folderId = $url.getHashParam("folderId");

    c.ExecuteButton = $controls.getControl($("#ExecuteButton"), "Tridion.Controls.Button");
    c.CloseButton = $controls.getControl($("#CloseButton"), "Tridion.Controls.Button");
    c.SchemaControl = $controls.getControl($("#Schema"), "Tridion.Controls.Dropdown");

    $evt.addEventHandler(c.SchemaControl, "loadcontent", this.getDelegate(this.onSchemaLoadContent));
    $evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._onExecuteButtonClicked));
    $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onCloseButtonClicked));
};

PowerTools2011.Popups.ComponentSynchronizer.prototype._onExecuteButtonClicked = function () {
    alert("Execute code");
};

PowerTools2011.Popups.ComponentSynchronizer.prototype._onCloseButtonClicked = function () {

    $j('#mask, .window').hide();
    $j('#ProgressStatus').html("");
    $j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
    $log.message("Close event Fired");
    this.fireEvent("close");
};

PowerTools2011.Popups.ComponentSynchronizer.prototype.onSchemaLoadContent = function (e) {
    
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





$display.registerView(PowerTools2011.Popups.ComponentSynchronizer);
