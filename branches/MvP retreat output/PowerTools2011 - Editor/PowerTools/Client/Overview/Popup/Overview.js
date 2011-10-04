Type.registerNamespace("PowerTools2011.Popups");

PowerTools2011.Popups.Overview = function ()
{
	Type.enableInterface(this, "PowerTools2011.Popups.Overview");
	this.addInterface("PowerTools2011.Popups.TreeViewBase");

	var p = this.properties;
	var c = p.controls;

	p.contextUri = "";
	c.closeButton = null;
	c.calculateButton = null;
	c.container = $j("#overviewContainer");
};

PowerTools2011.Popups.Overview.prototype.initialize = function ()
{
	$log.message("initializing Overview popup...");

	this.callBase("PowerTools2011.Popups.TreeViewBase", "initialize");

	var c = this.properties.controls;

	c.closeButton = $controls.getControl($("#CloseButton"), "Tridion.Controls.Button");
	c.calculateButton = $controls.getControl($("#CalculateButton"), "Tridion.Controls.Button");

	$evt.addEventHandler(c.closeButton, "click", this.getDelegate(this.onClosePopup));
	//$evt.addEventHandler(c.SaveButton, "click", this.getDelegate(function (e) { this._onSaveButtonClicked(e, controller); }));
};


PowerTools2011.Popups.Overview.prototype.onTreeSelection = function (event)
{
	var p = this.properties;
	var c = p.controls;

	this.callBase("PowerTools2011.Popups.TreeViewBase", "onTreeSelection", [event]);

	var treeControl = event.source;
	var selection = new Tridion.Cme.Selection(treeControl.getSelection(), null, null);
	var itemUri = this.properties.contextUri = selection.getItem(0);

	//c.container.text("youve chosen: '{0}'".format(itemUri));
	c.container.find("#containerMessage").text("Item selected ({0}), click \"Calculate\" to proceed".format(itemUri));
};

PowerTools2011.Popups.Overview.prototype.onClosePopup = function ()
{
	$log.message("closing overview popup window");

	this.callBase("PowerTools2011.Popups.TreeViewBase", "onClosePopup");	
};

$display.registerView(PowerTools2011.Popups.Overview);