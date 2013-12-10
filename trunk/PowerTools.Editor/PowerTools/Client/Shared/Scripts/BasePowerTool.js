Type.registerNamespace("PowerToolsBase");

PowerToolsBase = function PowerToolsBase$constructor()
{
	// Initialize base-class by adding some default Tridion properties/methods like 'getDelegate', 'getInterface', 'addInterface', etc. 
	Tridion.OO.enableInterface(this, "PowerToolsBase.BaseClass");

	// Add progressDialog methods
	this.addInterface("PowerTools.ProgressDialog");

	if ($("#UserNotification"))
	{
		// Initialize User Info Bar (2013+)
		$controls.getControl($("#UserNotification"), "Tridion.Controls.UserInfoBar");
	}
	else
	{
		// Initialize messagecenter (2011)
		$controls.getControl($("#MessageCenter"), "Tridion.Controls.ActiveMessageCenter");
	}

	// Initialize Execute- and Close button
	this._initializeExecuteButton();
};

//Initializes excecutebutton. Initializes/shows progressbar and after that it calls the _onExecuteButtonClicked method from the powertool itself.
PowerToolsBase.prototype._initializeExecuteButton = function PowerToolsBase$_initializeExecuteButton()
{
	var p = this.properties;
	var c = p.controls;

	var button = $("#ExecuteButton");
	if (button)
	{
		c.ExecuteButton = $controls.getControl(button, "Tridion.Controls.Button");
		$evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._validateInput));
	}
};

PowerToolsBase.prototype._validateInput = function PowerToolsBase$_validateInput()
{
	if (this.validateInput)
	{
		if (this.validateInput())
		{
			this._execute();
		}
	}
	else
	{
		//No input validation...
		this._execute();
	}
};

PowerToolsBase.prototype._execute = function PowerToolsBase$_execute()
{
	if (this._onExecuteButtonClicked)
	{
		this._initializeProgressWindow();
		this._onExecuteButtonClicked();
	}
	else
	{
		$assert.raiseError("PowerTool '{0}' does not implement method '_onExecuteButtonClicked'. Implement this method in your PowerTool".format(this.getPowerToolId()));
	}
};

PowerToolsBase.prototype.onError = function PowerToolsBase$onError(result)
{
	var errorMessage = result.ErrorMessage || result;
	$messages.registerError(null, errorMessage, errorMessage, true, false);
};

PowerToolsBase.prototype.getErrorHandler = function PowerToolsBase$getErrorHandler()
{
	return this.getDelegate(this.onError);
};

// Find the powertool name from the namespace.
// Currently it's convention over configuration. 
PowerToolsBase.prototype.getPowerToolId = function PowerToolsBase$getPowerToolId()
{
	var typeName = this.getTypeName();

	if (typeName != null)
	{
		return typeName.substring(typeName.lastIndexOf(".") + 1);
	}

	return "";
};