Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.ImageUploader = function () {
    Type.enableInterface(this, "PowerTools.Popups.ImageUploader");
    this.addInterface("Tridion.Cme.View");

    //Base class for initializing execute-,close button, and progressbar.
    this.addInterface("PowerToolsBase", [this]);

    var p = this.properties;

    p.processId = null;
    p.folderId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process   
};


PowerTools.Popups.ImageUploader.prototype.initialize = function () {

    $log.message("initializing example popup...");

    this.callBase("Tridion.Cme.View", "initialize");

    var p = this.properties;
    var c = p.controls;

    
    p.folderId = $url.getHashParam("folderId");
    
    c.SchemaControl = $controls.getControl($("#Schema"), "Tridion.Controls.Dropdown");
    $evt.addEventHandler(c.SchemaControl, "loadcontent", this.getDelegate(this.onSchemaLoadContent));
};
PowerTools.Popups.ImageUploader.prototype.validateInput = function () {
    var p = this.properties;
    
    var localDirectory = $j("#Main_SourceFolder").val();    
    if (localDirectory == "") {
        $messages.registerError("Please fill in a folder.", null, null, true, true);
        return false;
    }
    
    var schemaUri = p.controls.SchemaControl.getValue() || "";
    if (schemaUri == "") {
        $messages.registerError("No schema selected! Please selected a valid schema.", null, null, true, true);
        return false;
    }

    return true;
}

PowerTools.Popups.ImageUploader.prototype._onExecuteButtonClicked = function () {
    var p = this.properties;

    //-Schema Uri (ItemSelector)
    var schemaUri = p.controls.SchemaControl.getValue() || "";    
    //-Local directory on the server
    var localDirectory = $j("#Main_SourceFolder").val();

    var onSuccess = Function.getDelegate(this, this._onExecuteStarted);
    var onFailure = null;
    var context = null;
   
    PowerTools.Model.Services.ImageUploader.Execute(localDirectory, p.folderId, schemaUri, onSuccess, onFailure, context, false);


};

PowerTools.Popups.ImageUploader.prototype.onSchemaLoadContent = function (e)
{

    var schemaList = this.getListFieldsSchemas($const.SchemaPurpose.MULTIMEDIA);

    if (schemaList)
    {
        var dropdown = this.properties.controls.SchemaControl;
        function Component$onSchemaLoadContent$listLoaded()
        {
            $evt.removeEventHandler(schemaList, "load", Component$onSchemaLoadContent$listLoaded);
            dropdown.setContent(schemaList.getXml());
        }

        if (schemaList.isLoaded(true))
        {
            Component$onSchemaLoadContent$listLoaded();
        }
        else
        {
            $evt.addEventHandler(schemaList, "load", Component$onSchemaLoadContent$listLoaded);
            schemaList.load();
        }
    }
};

PowerTools.Popups.ImageUploader.prototype.getListFieldsSchemas = function (purpose) {
    var p = this.properties;
    var folder = $models.getItem(p.folderId);
    var publication = folder.getPublication();
    var list = publication.getListSchemas(purpose);
    return list;
};

PowerTools.Popups.ImageUploader.prototype.afterSuccess = function (event) {
    //Optional method: called after the service-call was finished (100%). Useful for getting data that was gathered/stored by the service-call  

    //Only refresh if dashboardview shows the folder where you want to upload the images
    var contextUri = window.opener.$display.getView().properties.contextUri;   
    var targetUri = $url.getHashParam("folderId");
    if (contextUri == targetUri) {
        window.opener.$display.getView().refreshList();
    }

};

$display.registerView(PowerTools.Popups.ImageUploader);
