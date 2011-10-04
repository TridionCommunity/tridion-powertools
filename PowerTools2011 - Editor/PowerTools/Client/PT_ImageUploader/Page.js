Type.registerNamespace("PowerTools2011.Popups");

PowerTools2011.Popups.ImageUploader = function ()
{
    Type.enableInterface(this, "PowerTools2011.Popups.ImageUploader");
	this.addInterface("Tridion.Cme.View");

	var p = this.properties;

	p.proxy = new PowerTools2011.Services.ImageUploaderServiceProxy();
	p.processId = null;
	p.pollInterval = 500; //Milliseconds between each call to check the status of a process
};

PowerTools2011.Popups.ImageUploader.prototype.initialize = function ()
{
	$log.message("initializing example popup...");

	this.callBase("Tridion.Cme.View", "initialize");

	var p = this.properties;
	var c = p.controls;

	c.ExecuteButton = $controls.getControl($("#ExecuteButton"), "Tridion.Controls.Button");

	c.CloseButton = $controls.getControl($("#CloseDialog"), "Tridion.Controls.Button");

    // Select the schema
	c.SchemaControl = $controls.getControl($("#Schema"), "Tridion.Controls.Dropdown");
	$evt.addEventHandler(c.SchemaControl, "loadcontent", this.getDelegate(this.onSchemaLoadContent));

    //

	$evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._onExecuteButtonClicked));
	$evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onCloseButtonClicked));
};

PowerTools2011.Popups.ImageUploader.prototype._onExecuteButtonClicked = function () {
    $j('#CloseDialog').hide();



    var p = this.properties;
    var context = this;

    var schemaId = p.controls.SchemaControl.getValue();

    alert(schemaId);

    p.proxy.Execute(function (response) {
        p.processId = response.d.Id;

        setTimeout(function () {
            context._getStatus(p.processId, context);
        }, p.pollInterval);
    });

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


PowerTools2011.Popups.ImageUploader.prototype.onSchemaLoadContent = function (e) {
/*
    var item = this.getItem();

    var schemaPurpose = item.getDefaultSubType();
    if (schemaPurpose == undefined) {
        schemaPurpose = (item.getStaticSubType() || item.getSubType());
    }
*/
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

PowerTools2011.Popups.ImageUploader.prototype.getListFieldsSchemas = function (purpose) {
    var p = this.properties;    
    //if (!p.schemasListIds[purpose]) {
        var folder = $models.getItem($url.getHashParam("id"));
        var publication = folder.getPublication();
        var list = publication.getListSchemas(purpose);
        //p.schemasListIds[purpose] = list.getId();
        return list;
    //}
    //else {
    //    return $models.getItem(p.schemasListIds[purpose]);
    //}
}


PowerTools2011.Popups.ImageUploader.prototype._onCloseButtonClicked = function ()
{
	$j('#mask, .window').hide();
	$j('#ProgressStatus').html("");
	$j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
};

PowerTools2011.Popups.ImageUploader.prototype._updateProgressBar = function (process)
{
	$j('#ProgressStatus').html(process.d.Status);
	$j('#ProgressBar').css({ 'width': process.d.PercentComplete + '%', 'display': 'block' });
}

PowerTools2011.Popups.ImageUploader.prototype._handleStatusResponse = function (response, context)
{
	var p = context.properties;

	p.processId = response.d.Id;

	context._updateProgressBar(response);

	if (response.d.PercentComplete < 100)
	{		
		setTimeout(function ()
		{
			context._getStatus(p.processId, context);
		}, p.pollInterval);
	}
	else {
	    $j('#ProgressStatus').html(response.d.Status);
	    $j('#CloseDialog').show();
		p.processId = ""
	}
}

PowerTools2011.Popups.ImageUploader.prototype._getStatus = function (id, context)
{
	if (id != "")
	{
		context.properties.proxy.GetProcessStatus(id, this._handleStatusResponse, context);
	}
};

$display.registerView(PowerTools2011.Popups.ImageUploader);
