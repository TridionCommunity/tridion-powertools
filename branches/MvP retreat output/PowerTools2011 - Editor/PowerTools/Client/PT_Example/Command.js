Type.registerNamespace("PowerTools2011.Commands");

PowerTools2011.Commands.Example = function ()
{
	Type.enableInterface(this, "PowerTools2011.Commands.Example");
	this.addInterface("Tridion.Cme.Command", ["Example"]);
	this.addInterface("PowerTools2011.ToolBase", ["ExampleTool"]);
};

PowerTools2011.Commands.Example.prototype.isAvailable = function (selection)
{
    return true;
};

PowerTools2011.Commands.Example.prototype.isEnabled = function (selection)
{
    return true;
};

PowerTools2011.Commands.Example.prototype._execute = function (selection)
{
	var uriSelection = selection.getItem(0);
	var PopUpUrl = $ptUtils.expandPath("/powertools/client/PT_Example/PopUp.aspx") + "?id=" + uriSelection; 
	var popup = $popup.create(PopUpUrl, "toolbar=no,width=600,height=400,resizable=false,scrollbars=false", null);
	popup.open();
};

