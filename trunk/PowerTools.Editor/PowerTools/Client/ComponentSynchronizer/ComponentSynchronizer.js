Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.ComponentSynchronizer = function () {

    Type.enableInterface(this, "PowerTools.Popups.ComponentSynchronizer");
    this.addInterface("Tridion.Cme.View");
    this.addInterface("Tridion.Cme.Views.ItemWithSchema");
    
    var p = this.properties;

    p.processId = null;
    p.schemaId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process

    p.item;
    //The following is a list of properties used in the ItemWithSchema interface. Probably we won´t need all of them
    p.fieldsElement;
    p.isFieldsGenerated = false;
    p.isFieldsGenerating = false;
    p.useMetadataSchema = true;
    p.validationPopup = null;
    p.activeEditor;
    p.activeFormatAreaEditor;
    p.activeFormatAreaName;
    p.hasClickedFaToolbar;
    p.faToolbarsHideTimeout;
    p.activePopup;
    p.isUserAction = false;
    p.isUserAutoCorrectRequest = false;
    p.formatPageId = "FormatPage";
    p.previousToolbarPageId;
    p.prevFormatAreaState;
};

PowerTools.Popups.ComponentSynchronizer.prototype.initialize = function () {

    $log.message("initializing component Synchronizer popup...");

    this.callBase("Tridion.Cme.View", "initialize");


    var p = this.properties;
    var c = p.controls;

    p.schemaId = $url.getHashParam("folderId");



    p.item = $models.getItem(p.schemaId);





    console.debug("subtype " + p.item.getTitle());





    $j('#schemaTcm').html(p.schemaId);


    this.setSchemaBasedFieldsElement($("#SchemaBasedFields"));

    if (p.fieldsElement) {
        console.debug("1");
        c.fieldBuilder = new Tridion.FieldBuilder(p.fieldsElement);
        console.debug("2");

        //Attach events? propably not needed. We are not changing the used schema after popup creation  
        //$evt.addEventHandler(c.fieldBuilder, "change", this.getDelegate(this.onFormFieldsChanged));
        //$evt.addEventHandler(c.fieldBuilder, "focusmove", this.getDelegate(this._onFormFocusMoved));
    }

    c.ExecuteButton = $controls.getControl($("#ExecuteButton"), "Tridion.Controls.Button");
    c.CloseButton = $controls.getControl($("#CloseButton"), "Tridion.Controls.Button");
    //c.SchemaControl = $controls.getControl($("#Schema"), "Tridion.Controls.Dropdown");

    //$evt.addEventHandler(c.SchemaControl, "loadcontent", this.getDelegate(this.onSchemaLoadContent));
    $evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._onExecuteButtonClicked));
    $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onCloseButtonClicked));


    this.generateFields(true);





};



PowerTools.Popups.ComponentSynchronizer.prototype.initializeControls = function ComponentSynchronizer$initializeControls() {
    alert("Im used!");
    /*var p = this.properties;
    var c = p.controls;

    this.callBase("Tridion.Cme.Views.Item", "initializeControls");
    c.formatPage = c.ItemToolbar.getPage(p.formatPageId);
    p.enabledControls.formatPage = true;*/
};


PowerTools.Popups.ComponentSynchronizer.prototype._onExecuteButtonClicked = function () {
    alert("Execute code");
};

PowerTools.Popups.ComponentSynchronizer.prototype._onCloseButtonClicked = function () {

    $j('#mask, .window').hide();
    $j('#ProgressStatus').html("");
    $j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
    $log.message("Close event Fired");
    this.fireEvent("close");
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


/**
* Generate Schema Fields.
* @param {Boolean} reload. True regenarates fields Item fields. Optional.
*/
PowerTools.Popups.ComponentSynchronizer.prototype.generateFields = function ComponentSynchronizer$generateFields(reload) {
    var p = this.properties;
    var c = p.controls;

    p.toLoad = true;

    if (p.isFieldsGenerating) {
        return;
    }

    if (reload) {
        p.isFieldsGenerated = false;
    }

    if (!p.isFieldsGenerated && c.fieldBuilder) {
        //var item = this.getItem();
        var schema = p.schemaId ? $models.getItem(p.schemaId) : null;






        //this.applyFieldsSchema(schema, true);

        p.isFieldsGenerating = true;

        if (!schema) {
            c.fieldBuilder.setData(null);
            c.fieldBuilder.setSchema(null);
            c.fieldBuilder.generate();
            p.isFieldsGenerating = false;
            p.isFieldsGenerated = true;
            $css.undisplay(p.fieldsElement);
        }
        else {
            $css.display(p.fieldsElement);
            if (!schema.isStaticWebSchemaLoading() && schema.isStaticWebSchemaLoaded()) {
                //var fieldData = this.getItemFields(); Ojo
                //
                var fieldData = null;
                var isInstanceData = false;
                var orgItem;
                if (true) {
                    orgItem = schema.getOrganizationalItem();
                }


                if (fieldData || (schema.isInstanceDataLoaded(orgItem) && !schema.isInstanceDataLoading(orgItem))) {
                    if (!fieldData) {
                        fieldData = schema.getInstanceData(orgItem, !p.useMetadataSchema);
                        isInstanceData = !!fieldData;
                    }

                    if (schema.isStaticTridionWebSchema()) {
                        var nameSpace = schema.getStaticNamespaceUri();
                        if (false) {
                            c.fieldBuilder.setSchema(schema.getStaticMetadataFields(), "Metadata", nameSpace);
                        }
                        else {
                            c.fieldBuilder.setSchema(schema.getStaticFields(), schema.getStaticRootElementName(), nameSpace);
                        }
                        c.fieldBuilder.setData(fieldData);
                        //c.fieldBuilder.setReadOnly(this.isItemReadOnly());
                        c.fieldBuilder.generate();
                        if (isInstanceData) {
                            //this.notifyFieldChange(c.fieldBuilder);
                        }
                    }
                    else	//complex schema
                    {
                        c.fieldBuilder.setData(null);
                        c.fieldBuilder.setSchema(null);
                        c.fieldBuilder.generate();
                        $css.undisplay(p.fieldsElement);
                        if (isInstanceData || !fieldData) {
                            if (!fieldData) {
                                fieldData = "<{0} xmlns=\"{1}\" />".format(schema.getStaticRootElementName(), schema.getStaticNamespaceUri());
                            }
                            item.setContent(fieldData, this); // content, because we know metadata cannot be complex
                        }
                    }
                    p.isFieldsGenerating = false;
                    p.isFieldsGenerated = true;
                }
                else {
                    schema.loadInstanceData(orgItem);
                    $evt.addEventHandler(schema, "instancedataload", this.getDelegate(this.onInstancedataload));                
                }
            }
            else {
                schema.staticLoad();
                $evt.addEventHandler(schema, "staticwebschemaload", this.getDelegate(this.onStaticWebSchemaLoad));

            }

            if (!p.isFieldsGenerated) {
                c.fieldBuilder.setLoading();
                p.isFieldsGenerating = false;
            }
        }
    }
    Tridion.DisplayController.resize();
};


/**
* Gets Item fields XML representation.
* @returns {String} XML String of Item fields.
*/
PowerTools.Popups.ComponentSynchronizer.getItemFields = function ComponentSynchronizer$getItemFields() {
    var item = this.getItem();
    if (item) {
        return this.properties.useMetadataSchema ? item.getMetadata() : item.getContent();
    }
};


/**
* Loading the Schema if it`s not loaded and applying the fields to the Schema.
* @param {Tridion.ContentManager.Schema} schema. Schema which is used to loading and fields generating.
* @param {Boolean} invalidateItemFields. True invalidate Item fields. Optional. 
*/
PowerTools.Popups.ComponentSynchronizer.applyFieldsSchema = function Component$ComponentSynchronizer(schema, invalidateItemFields) {
    //this.getMetadataTab().applyFieldsSchema(schema, invalidateItemFields);
    this.callBase("Tridion.Cme.Views.ItemWithSchema", "applyFieldsSchema", [schema, invalidateItemFields]);
};

PowerTools.Popups.ComponentSynchronizer.prototype.onStaticWebSchemaLoad = function Schema$ComponentSynchronizer(value)
{
    console.debug("onStaticWebSchemaLoad");
    this.generateFields(true);
};

PowerTools.Popups.ComponentSynchronizer.prototype.onInstancedataload = function Schema$ComponentSynchronizer(value)
{
    console.debug("onInstancedataload");
    this.generateFields(true);
};

$display.registerView(PowerTools.Popups.ComponentSynchronizer);
