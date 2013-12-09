Type.registerNamespace("PowerToolsBase");

PowerToolsBase = function()
{
	// Initialize base-class by adding some default Tridion properties/methods like 'getDelegate', 'getInterface', 'addInterface', etc. 
	Tridion.OO.enableInterface(this, "PowerToolsBase.BaseClass");

	// Add progressDialog methods
	this.addInterface("PowerTools.ProgressDialog");

	var p = this.properties;

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
PowerToolsBase.prototype._initializeExecuteButton = function()
{
	var p = this.properties;
	var c = p.controls;

	var controlSelector = "#ExecuteButton";
	c.ExecuteButton = $controls.getControl($(controlSelector), "Tridion.Controls.Button");
	$evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._validateInput));
};

PowerToolsBase.prototype._validateInput = function()
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

PowerToolsBase.prototype._execute = function()
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

// Find the powertool name from the namespace.
// Currently it's convention over configuration. 
PowerToolsBase.prototype.getPowerToolId = function()
{
	var typeName = this.getTypeName();

	if (typeName != null)
	{
		return typeName.substring(typeName.lastIndexOf(".") + 1);
	}

	return "";
};