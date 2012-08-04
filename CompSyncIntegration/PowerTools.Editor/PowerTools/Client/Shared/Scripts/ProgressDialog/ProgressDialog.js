Type.registerNamespace("PowerToolsBase");

PowerTools.ProgressDialog = function()
{
    Tridion.OO.enableInterface(this, "PowerTools.ProgressDialog");

	var p = this.properties;

    // Set up progressDialog behaviour. You can override the default settings in your PowerTool.
	p.progressDialogSettings = { showAnimation: true, closeAfterComplete: false };

    //Initialize closebutton   
    this._initializeCloseButton();
};

PowerTools.ProgressDialog.prototype._initializeProgressWindow = function() 
{
	var p = this.properties;
    var dialog = $j("#dialog");
    var win = $j(window);

    // Get the screen height and width
    var maskHeight = $j(document).height();
    var maskWidth = win.width();

    // Set height and width to mask to fill up the whole screen
    if (p.progressDialogSettings.showAnimation === true) 
	{       
        $j('#mask').css({ 'width': maskWidth, 'height': maskHeight }).fadeIn(1000).fadeTo("slow", 0.8);
    } 
	else 
	{
        $j('#ProgressBar').css({ 'width': '1%', 'display': 'block' });
    }


    //Get the window height and width
    var winH = win.height();
    var winW = win.width();

    //Hide close button  
    $j("#CloseDialog").hide();

    //Set the popup window to center
	var style = { "top": (winH / 2 - dialog.height() / 2), "left": (winW / 2 - dialog.width() / 2)};
    dialog.css(style).fadeIn(2000);
};

// Initializes close button. (Close dialog) and after that it calls the _onCloseButtonClicked from the powertool
PowerTools.ProgressDialog.prototype._initializeCloseButton = function() 
{
	var p = this.properties;
    var c = p.controls;

    c.CloseButton = $controls.getControl($("#CloseDialog"), "Tridion.Controls.Button");
    $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onDialogCloseButtonClicked));
    if (this._onCloseButtonClicked) 
	{
        $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onCloseButtonClicked)); //Call _onCloseButtonClicked from PowerTool also. 
    }
};

PowerTools.ProgressDialog.prototype._onDialogCloseButtonClicked = function() 
{
    // Close progress-dialog
    $j('#mask, .window').hide();
    $j('#ProgressStatus').html("");
    $j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
};

PowerTools.ProgressDialog.prototype._pollStatus = function(id) 
{
    var p = this.properties;
    var onSuccess = Function.getDelegate(this, this._handleStatusResponse);
    var onFailure = null;
    var context = this;

    var callback = function() 
	{
        $log.debug("Checking the status of process with ID: " + id);
		var modelClass = Type.resolveNamespace("PowerTools.Model.Services.{0}".format(context.getPowerToolId()));
		if (modelClass)
		{
			modelClass.GetProcessStatus(id, onSuccess, onFailure, context, false);
		}
    };

    setTimeout(callback, p.pollInterval);
};

PowerTools.ProgressDialog.prototype._handleStatusResponse = function(result)
{
    var p = this.properties;
	var c = p.controls;

    p.processId = result.Id;
    this._updateProgressBar(result);

    if (result.Failed) 
	{
		this._onDialogCloseButtonClicked();
		$messages.registerError(result.Status, null, null, true, true);
		p.processId = "";
		return;
    }

    if (result.PercentComplete < 100) 
	{
        this._pollStatus(p.processId);
		return;
    }

    // Some PowerTools need to get some data from the server after the service-call is finished.
    // Define a method 'afterSuccess' and implement your logic there. (E.g. the '_getCountItemsData' from the CountItems powertool)
    if (this.afterSuccess) 
	{
        this.afterSuccess(p.processId);
    }

    $j('#ProgressStatus').html(result.Status);

    if (p.progressDialogSettings.closeAfterComplete === true) 
	{
        c.CloseButton.fireEvent("click");
    } 
	else 
	{
        $j('#CloseDialog').show();
    }
    p.processId = "";
};

PowerTools.ProgressDialog.prototype._updateProgressBar = function(process)
{
    $j('#ProgressStatus').html(process.Status);
    $j('#ProgressBar').css({ 'width': process.PercentComplete + '%', 'display': 'block' });
};

PowerTools.ProgressDialog.prototype._onExecuteStarted = function(result)
{    
    if (result) 
	{
        this._pollStatus(result.Id);
    }
};
