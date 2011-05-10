Type.registerNamespace("PowerTools2011.Commands");

PowerTools2011.Commands.Example = function () 
{
	Type.enableInterface(this, "PowerTools2011.Commands.Example");
    this.addInterface("Tridion.Cme.Command", ["Example"]);
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
	var PopUpUrl = $ptUtils.expandPath("/powertools/client/example/example.aspx") + "?id=" + uriSelection;  //"/WebUI/Editors/PowerTools2011/PowerTools/Example/Example.aspx" + "?id=" + uriSelection;
	var popup = $popup.create(PopUpUrl, "toolbar=no,width=600,height=300,resizable=false,scrollbars=false", null);
	popup.open();

};

