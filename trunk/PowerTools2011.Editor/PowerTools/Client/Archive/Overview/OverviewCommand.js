Type.registerNamespace("PowerTools2011.Commands");

PowerTools2011.Commands.Overview = function ()
{
	Type.enableInterface(this, "PowerTools2011.Commands.Overview");
	this.addInterface("Tridion.Cme.Command", ["Overview"]);

	this.addInterface("PowerTools2011.ToolBase", ["Overview"]);

	this.properties.popup = null;
};

PowerTools2011.Commands.Overview.prototype.isAvailable = function (selection)
{
	return true;
};

PowerTools2011.Commands.Overview.prototype.isEnabled = function (selection)
{
	return true;
};

PowerTools2011.Commands.Overview.prototype._execute = function (selection)
{
	var p = this.properties;

	if (p.popup)
	{
		p.popup.focus();
		return;
	}

	var PopUpUrl = $ptUtils.expandPath("/powertools/client/overview/popup/overview.aspx");
	p.popup = $popup.create(PopUpUrl, "toolbar=no,width=900,height=470,resizable=1", null);

	$evt.addEventHandler(p.popup, "unload", function ()
	{
		if (p.popup)
		{
			p.popup.dispose();
			p.popup = null;
		}
	});

	p.popup.open();
};



