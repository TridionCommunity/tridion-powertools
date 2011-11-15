Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.ComponentSynchronizer = function () {
    Type.enableInterface(this, "PowerTools.Popups.ComponentSynchronizer");
    this.addInterface("Tridion.Cme.View");

    var p = this.properties;
    
    p.processId = null;
    p.folderId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
    
    PowerTools.Popups.ComponentSynchronizer.USEDIN = 0;
    PowerTools.Popups.ComponentSynchronizer.USEDINLIST_HEAD_PATH = $config.expandEditorPath("PowerTools/Client/ComponentSynchronizer/Xml/SyncList-head.xml", "PowerTools");
    
};

PowerTools.Popups.ComponentSynchronizer.prototype.initialize = function () {
    
    $log.message("initializing component Synchronizer popup...");

    this.callBase("Tridion.Cme.View", "initialize");  

    var p = this.properties;
    var c = p.controls;
    p.sel = window.dialogArguments.sel; 
    
    
    var p = this.properties;
    var c = p.controls;
    
    p.schema = this.getItem();
    

    p.folderId = $url.getHashParam("folderId");
    p.tabType = {};
    p.tabType[PowerTools.Popups.ComponentSynchronizer.USEDIN];

    c.CreateReferenceButton = $controls.getControl($("#CreateReferenceButton"), "Tridion.Controls.Button");
    c.ExecuteButton = $controls.getControl($("#ExecuteButton"), "Tridion.Controls.Button");
    c.CloseButton = $controls.getControl($("#CloseButton"), "Tridion.Controls.Button");
    c.BtnBrowse = $controls.getControl($("#BtnBrowse"), "Tridion.Controls.Button");
    c.BtnRemove = $controls.getControl($("#BtnRemove"), "Tridion.Controls.Button");
    c.FieldTitle = $("#FieldTitle");
    c.FieldURI = $("#FieldURI");
    c.FieldSchema = $("#FieldSchema");


    //# List Setups
    c.TabControl = $controls.getControl($("#TabControl"), "Tridion.Controls.TabControl");
    c.UsedInPage = c.TabControl.getPage("UsedIn");
    c.UsedInList = $controls.getControl($("#UsedInList"), "Tridion.Controls.List");
    c.DetailsText = $("#ItemDetailsText", p.element);
    c.DetailsVersions = $("#ItemDetailsVersions", p.element);

    //# Buttons
    c.BtnUsedInOpen = $controls.getControl($("#BtnUsedInOpen"), "Tridion.Controls.Button");
    c.BtnUsedInGoTo = $controls.getControl($("#BtnUsedInGoTo"), "Tridion.Controls.Button");
    c.BtnUsedInRefresh = $controls.getControl($("#BtnUsedInRefresh"), "Tridion.Controls.Button");



    var self = this;
    p.tabType[PowerTools.Popups.ComponentSynchronizer.USEDIN] = {
        control: c.UsedInList,
        headPath: PowerTools.Popups.ComponentSynchronizer.USEDINLIST_HEAD_PATH + "?forView=" + Tridion.Core.Configuration.CurrentView + "&forControl=" + c.UsedInList.getId(),
        headDocument: null,
        filter: new Tridion.ContentManager.ListFilter(
			{
			    columns: $const.ColumnFilter.DEFAULT |
						$const.ColumnFilter.ALLOWED_ACTIONS |
						$const.ColumnFilter.VERSIONS,
			    conditions:
				{
                    ItemTypes: [$const.ItemType.COMPONENT],
				    InclLocalCopies: true
				}
			}),
        getListItems: this.getDelegate(this.getListItems, [PowerTools.Popups.ComponentSynchronizer.USEDIN]),
        renderList: function ComponentSynchronizer$renderUsedInList(bodyDocument) {
            self.renderList(PowerTools.Popups.ComponentSynchronizer.USEDIN, bodyDocument);
            //self.updateItemDetails();
        }
    };

    c.UsedInPage.baseInitialize = c.UsedInPage.initialize;
    c.UsedInPage.initialize = this.getDelegate(this.initializeTab, [c.UsedInPage]);


    $evt.addEventHandler(c.BtnUsedInRefresh, "click", this.getDelegate(this.onRefreshBtnClicked));
    $evt.addEventHandler(c.UsedInList, "selectionchange", this.getDelegate(this.onListSelectionChanged));
    $evt.addEventHandler(c.UsedInList, "draw", c.UsedInList.getDelegate(c.UsedInList.setLoading, [false]));


    //# End of Setups
    //$evt.addEventHandler(c.SchemaControl, "loadcontent", this.getDelegate(this.onSchemaLoadContent));
    $evt.addEventHandler(c.CreateReferenceButton, "click", this.getDelegate(this._onCreateReferenceButtonClicked));
    $evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._onExecuteButtonClicked));
    $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onCloseButtonClicked));
    $evt.addEventHandler(c.BtnBrowse, "click", this.getDelegate(this._onBrowseClicked));

    c.BtnRemove.hide();
    this.loadList(true);
    

    

};



/**
* Gets TCM Item object.
* @returns {Object} TCM Item object.
*/
PowerTools.Popups.ComponentSynchronizer.prototype.getItem = function ComponentSynchronizer$getItem() {
    var p = this.properties;
    var c = p.controls;
    if(p.sel){
        if(p.sel.getItems().length == 1){
            var itemId = p.sel.getItem(0);
            var item = $models.getItem(itemId);
            if (item) {
                if (item.getItemType() == $const.ItemType.SCHEMA) {
                    return $models.getItem(itemId);
                }
            }
        }
    }
    return null;
    
    
};


PowerTools.Popups.ComponentSynchronizer.prototype.getSelectedTabType = function ComponentSynchronizer$getSelectedTabType() {
    var p = this.properties;
    return p.tabType[PowerTools.Popups.ComponentSynchronizer.USEDIN];
};


PowerTools.Popups.ComponentSynchronizer.prototype.loadList = function ComponetSynchronizer$loadList(reload) {
    
    var p = this.properties;
    var c = p.controls;

    var list;
    
    var item = this.getItem();
    var tab = this.getSelectedTabType();
    
    if (tab && (list = tab.getListItems())) {
        
        var control = tab.control;
        control.setLoading(true);

        function ComponentSynchronizer$listLoaded() {
            $evt.removeEventHandler(list, "load", ComponentSynchronizer$listLoaded);
            var bodyDocument = list.getXml();            
            tab.renderList(bodyDocument);
        };

        function ComponentSynchronizer$listLoadFailed() {
            $log.message("ComponentSynchronizer$loadList:: List loading failed;");
            $evt.removeEventHandler(list, "loadfailed", ComponentSynchronizer$listLoadFailed);
            control.setLoading(false);
            control.clear();
        };
        
        if (reload || !list.isLoaded(true)) {
            $evt.addEventHandler(list, "load", ComponentSynchronizer$listLoaded);
            $evt.addEventHandler(list, "loadfailed", ComponentSynchronizer$listLoadFailed);            
            list.load(reload);
        }
        else {
            ComponentSynchronizer$listLoaded();
        }
    }
};



PowerTools.Popups.ComponentSynchronizer.prototype.onRefreshBtnClicked = function ComponentSynchronizer$onRefreshBtnClicked(event) {    
    this.loadList(true);
};


/**
* Handles the list selection change event.
* @param {Tridion.Core.Event} event. The event is the event fired from the list.
*/
PowerTools.Popups.ComponentSynchronizer.prototype.onListSelectionChanged = function ComponentSynchronizer$onListSelectionChanged(event) {
    
    var selection = this.getSelection();
    var openCommand = $models.isContainerItemType(selection.getItemType(0)) ? "Properties" : "Open";
    var c = this.properties.controls;
    switch (this.getSelectedPageID()) {
        case "UsedIn":
            c.BtnUsedInOpen.setDisabled(!this.isCommandAvailable(openCommand, selection));
            c.BtnUsedInGoTo.setDisabled(!this.isCommandAvailable("Goto", selection));
            this.updateItemDetails();
            break;
    }
};



/**
* Gets Items List. 
* @param {Enum} tabType Type of opened tab.
* @returns {Object} Items List. 
* <tcm:ListUsingItems xmlns:tcm="http://www.tridion.com/ContentManager/5.0"><tcm:Item ID="tcm:3-924" Title="Labels Component 123" Type="16" OrgItemID="tcm:3-5-2" Path="\020 Content\Building Blocks\Content" SchemaId="tcm:3-923-8" Versions="1 2 3 4" IsNew="false" Allow="268560777" Deny="614" Icon="T16L0P0" Publication="020 Content" /></tcm:ListUsingItems>
*/
PowerTools.Popups.ComponentSynchronizer.prototype.getListItems = function ComponentSynchronizer$getListItems(tabType) {
    
    var item = this.getItem();
    var tab = this.properties.tabType[tabType];
    if(item && tab && $models.getItemType(item.getId()) == $const.ItemType.SCHEMA){
        
        return item.getListUsingItems(tab.filter);
    }
    else
    {
        
        //var customList = new PowerTools.ComponentSynchronizer.Lists.CustomListTcmItems("tcm:5-260-2",tab.filter);
        //var customList = new PowerTools.ComponentSynchronizer.Lists.CustomListTcmItems("tcm:0-0-0",tab.filter);
        
        
        //Build the list
        var strXml = '<tcm:ListUsingItems xmlns:tcm="http://www.tridion.com/ContentManager/5.0">'
        var p = this.properties;
        var items = p.sel.getItems();
        for(var i=0; i<items.length;i++){
            var itemId = items[i];
            var item = $models.getItem(itemId);
            
            if(item){              
                
                var icon = item.callBase("Tridion.ContentManager.VersionedItem", "getItemIcon");//item.getItemIcon();                
                strXml+='<tcm:Item ID="'+itemId+'" Title="'+item.getStaticTitle()+'" Type="16" Icon="'+icon+'"/>';
            }
            
        }
        
        strXml+='</tcm:ListUsingItems>';
        var xmlDoc = $xml.getNewXmlDocument(strXml);    
        
        this.renderList(PowerTools.Popups.ComponentSynchronizer.USEDIN, strXml);
    }
    return null;
};



PowerTools.Popups.ComponentSynchronizer.prototype.renderList = function ComponentSynchronizer$renderList(tabType, bodyXml) {
    
    var p = this.properties;
    $assert.isString(bodyXml);

    var tab = this.properties.tabType[tabType];
    var control = tab.control;
    var headDocument = tab.headDocument;
    
    var xmlDoc = $xml.getNewXmlDocument(bodyXml);

    control.setLoading(true);

    function ComponentSynchronizer$drawControl(definitionDocument) {
        
    
        control.draw(xmlDoc, definitionDocument);
        control.setLoading(false);
    }
    
    if (!headDocument) {
        
        function ComponentSynchronizer$headDocumentLoaded(headDocument) {                        
            tab.headDocument = headDocument;
            ComponentSynchronizer$drawControl(headDocument);
        }

        function ComponentSynchronizer$headDocumentLoadFailed() {
            $log.error("Unable to load head xml file for list.");
        }
        
        $xml.loadXmlDocument(tab.headPath, ComponentSynchronizer$headDocumentLoaded, ComponentSynchronizer$headDocumentLoadFailed);
        
        return;
    }
    ComponentSynchronizer$drawControl(headDocument);
};


PowerTools.Popups.ComponentSynchronizer.prototype.updateItemDetails = function ComponentSynchronizer$updateItemDetails() {
    
    $log.message('9');
    /*var p = this.properties;
    var c = p.controls;
    var tab = p.tabType[PowerTools.Popups.ComponentSynchronizer.USEDIN];

    var usedInList = tab.control;
    var items = usedInList.getSelection().getItems();
    var versionsString;
    
    var details;
    if (items.length == 1) {
        var item = this.getItem();
        alert('11');
        var list = tab.getListItems();
        var versions = list.getVersions(items[0]);

        if (!versions || !versions.length) {
            details = $localization.getEditorResource("NoDetails");
        }
        else {
            var listDefinition = usedInList.getDefinition();
            var node = listDefinition.selectNode(usedInList.getContent(), items[0]);
            var details = $localization.getEditorResource("VersionsDetails", [listDefinition.getNodeTitle(node), item.getStaticTitle()]);
            var isStartsWithZero = versions[0] == 0;
            var prevVer = versionsString = isStartsWithZero ? versions[1] : versions[0];
            var startPointer = isStartsWithZero ? 2 : 1;
            var sequenceCount = 1;

            for (var i = startPointer, len = versions.length; i < len; i++) {
                if (versions[i] == parseInt(versions[i - 1]) + 1) {
                    sequenceCount++;
                    prevVer = versions[i];
                }
                else {
                    if (sequenceCount > 1) {
                        versionsString += ((sequenceCount > 2) ? ("..") : (", ")) + prevVer;
                    }
                    versionsString += ", " + versions[i];
                    sequenceCount = 1;
                }
            }

            if (sequenceCount > 1) {
                versionsString += ((sequenceCount > 2) ? ("..") : (", ")) + prevVer;
            }
        }
    }
    $dom.setInnerText(c.DetailsText, details || "");
    $dom.setInnerText(c.DetailsVersions, versionsString || "");(
    */
};





















PowerTools.Popups.ComponentSynchronizer.prototype._onBrowseClicked = function _onBrowseClicked(event) {

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
                $log.message('close');
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
			                    p.schema = schema;

			                    p.schema = $models.getItem("tcm:3-89-8");
			                    p.tabType[PowerTools.Popups.ComponentSynchronizer.USEDIN].headDocument = null;
			                    schemaName = schema ? (schema.getStaticTitle() || schema.getTitle() || "") : "";
			                }
			            }
			            break;
			        }

			        if (itemId && itemName) {

			            c.FieldTitle.value = ("Reference Component: " + itemName + " (" + itemId + ")");
			            $css.show(c.FieldTitle);
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
    $log.message("Execute code");
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




