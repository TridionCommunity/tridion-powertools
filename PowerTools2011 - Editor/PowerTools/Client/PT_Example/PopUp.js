Type.registerNamespace("PowerTools2011.Popups");

PowerTools2011.Popups.Example = function ()
{
	Type.enableInterface(this, "PowerTools2011.Popups.Example");
	this.addInterface("Tridion.Cme.View");

	var p = this.properties;

	p.proxy = new PowerTools2011.Services.ExampleServiceProxy();
	p.processId = null;
	p.pollInterval = 500; //Milliseconds between each call to check the status of a process
};

PowerTools2011.Popups.Example.prototype.initialize = function ()
{
	$log.message("initializing example popup...");

	this.callBase("Tridion.Cme.View", "initialize");

	var p = this.properties;
	var c = p.controls;

	c.ExecuteButton = $controls.getControl($("#ExecuteButton"), "Tridion.Controls.Button");
	c.SelectButton = $controls.getControl($("#SelectItem"), "Tridion.Controls.Button");
	c.CloseButton = $controls.getControl($("#CloseDialog"), "Tridion.Controls.Button");

    

	$evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._onExecuteButtonClicked));
	$evt.addEventHandler(c.SelectButton, "click", this.getDelegate(this._onSelectButtonClicked));
	$evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onCloseButtonClicked));
};

PowerTools2011.Popups.Example.prototype._onExecuteButtonClicked = function ()
{
    $j('#CloseDialog').hide();
    
    var p = this.properties;
	var context = this;



	p.proxy.Execute(function (response)
	{
		p.processId = response.d.Id;

		setTimeout(function ()
		{
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

PowerTools2011.Popups.Example.prototype._onCloseButtonClicked = function ()
{
	$j('#mask, .window').hide();
	$j('#ProgressStatus').html("");
	$j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
};

PowerTools2011.Popups.Example.prototype._updateProgressBar = function (process)
{
	$j('#ProgressStatus').html(process.d.Status);
	$j('#ProgressBar').css({ 'width': process.d.PercentComplete + '%', 'display': 'block' });
}

PowerTools2011.Popups.Example.prototype._handleStatusResponse = function (response, context)
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

PowerTools2011.Popups.Example.prototype._getStatus = function (id, context)
{
	if (id != "")
	{
		context.properties.proxy.GetProcessStatus(id, this._handleStatusResponse, context);
	}
};

$display.registerView(PowerTools2011.Popups.Example);
