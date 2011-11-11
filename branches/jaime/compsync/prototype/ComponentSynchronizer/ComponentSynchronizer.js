Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.ComponentSynchronizer = function () {
    Type.enableInterface(this, "PowerTools.Popups.ComponentSynchronizer");
    this.addInterface("Tridion.Cme.View");

    var p = this.properties;

    p.processId = null;
    p.folderId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
};

PowerTools.Popups.ComponentSynchronizer.prototype.initialize = function () {

    $log.message("initializing component Synchronizer popup...");

    this.callBase("Tridion.Cme.View", "initialize");

    var p = this.properties;
    var c = p.controls;

    p.folderId = $url.getHashParam("folderId");

    c.CreateReferenceButton = $controls.getControl($("#CreateReferenceButton"), "Tridion.Controls.Button");
    c.ExecuteButton = $controls.getControl($("#ExecuteButton"), "Tridion.Controls.Button");
    c.CloseButton = $controls.getControl($("#CloseButton"), "Tridion.Controls.Button");
    c.BtnBrowse = $controls.getControl($("#BtnBrowse"), "Tridion.Controls.Button");
    c.BtnRemove = $controls.getControl($("#BtnRemove"), "Tridion.Controls.Button");
    c.FieldTitle = $("#FieldTitle");
    c.FieldURI = $("#FieldURI");
    c.FieldSchema = $("#FieldSchema");

    //$evt.addEventHandler(c.SchemaControl, "loadcontent", this.getDelegate(this.onSchemaLoadContent));
    $evt.addEventHandler(c.CreateReferenceButton, "click", this.getDelegate(this._onCreateReferenceButtonClicked));
    $evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._onExecuteButtonClicked));
    $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onCloseButtonClicked));
    $evt.addEventHandler(c.BtnBrowse, "click", this.getDelegate(this._onBrowseClicked));

    c.BtnRemove.hide();
};



PowerTools.Popups.ComponentSynchronizer.prototype._onBrowseClicked = function _onBrowseClicked(event) {
    //$log.message("_onBrowseClicked: fired! [" +  this +"]");
    var p = this.properties;
    var c = p.controls;
    if (p.ItemPopup && p.ItemPopup.isOpen()) {
        p.ItemPopup.focus();
    } else {

        var filter = new Tridion.ContentManager.ListFilter();
        filter.conditions.ItemTypes = [$const.ItemType.COMPONENT];
        p.ItemPopup = $popup.create($cme.Popups.ITEM_SELECT.URL.format('tcm:2-1-2'), $cme.Popups.ITEM_SELECT.FEATURES, { filter: filter });


        var self = this;

        function ComponentSynchronizer$_onBrowseClicked$onPopupClosed(event) {
            // Release
            if (p.ItemPopup) {
                p.ItemPopup.dispose();
                p.ItemPopup = null;

                //clean area
                //$j('#SchemaBasedFields').empty();
                //$j('#SchemaBasedFieldsEmbeded').empty();
                //$j('#PageFields').empty();
                //$j('#PageFieldsComponents').empty();
                alert('close');
            }
        };

        $evt.addEventHandler(p.ItemPopup, "insert",
			function ComponentSynchronizer$_onBrowseClicked$onPopupSubmitted(event) {

			    // Update
			    var items = event.data.items;
			    if (items) {

			        var itemId, itemName, schemaName;
			        for (var i = 0, len = items.length; i < len; i++) {
			            itemId = items[i];

			            if (!String.isNullOrEmpty(itemId)) {
			                var item = $models.getItem(itemId);
			                if (item) {
			                    itemName = item.getStaticTitle();
			                    var schema = item.getSchema();
			                    schemaName = schema ? (schema.getStaticTitle() || schema.getTitle() || "") : "";
			                }
			            }
			            break;
			        }

			        if (itemId && itemName) {
			            c.FieldURI.value = itemId;
			            c.FieldTitle.value = itemName;
			            c.FieldSchema.value = schemaName;
			            c.BtnRemove.show();
			        }

			    }

			    // Release
			    ComponentSynchronizer$_onBrowseClicked$onPopupClosed();
			});

        $evt.addEventHandler(p.ItemPopup, "unload", ComponentSynchronizer$_onBrowseClicked$onPopupClosed);
        p.ItemPopup.open();
    }
}





PowerTools.Popups.ComponentSynchronizer.prototype._onCreateReferenceButtonClicked = function () {
    var itemType = $const.ItemType.COMPONENT;
    var item = $models.createNewItem(itemType);
    var urlParams = {};

    var orgItemId = "tcm:2-1-2";
    item.setOrganizationalItem(orgItemId);
    var editorURL = "/WebUI/item.aspx?tcm=16"
    item.setTitle("Synchronization Component - [Unique ID]");

    if (!item.openInEditor(editorURL, null, urlParams)) {
        $messages.registerError($localization.getCoreResource("IsPopupBlocker"), null, null, null, true);
    }
    return item;
};

PowerTools.Popups.ComponentSynchronizer.prototype._onExecuteButtonClicked = function () {
    alert("Execute code");
};

PowerTools.Popups.ComponentSynchronizer.prototype._onCloseButtonClicked = function () {
    this.fireEvent("cancel");
    window.close();
};

PowerTools.Popups.ComponentSynchronizer.prototype.onSchemaLoadContent = function (e) {

    var schemaList = this.getListFieldsSchemas($const.SchemaPurpose.COMPONENT);

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



PowerTools.Popups.ComponentSynchronizer.prototype.getListFieldsSchemas = function (purpose) {
    var p = this.properties;

    var folder = $models.getItem(p.folderId);
    var publication = folder.getPublication();

    var list = publication.getListSchemas(purpose);
    return list;
}

$display.registerView(PowerTools.Popups.ComponentSynchronizer);
