Type.registerNamespace("PowerTools2011.Commands");

PowerTools2011.Commands.BatchImageUploader = function ()
{
	Type.enableInterface(this, "PowerTools2011.Commands.BatchImageUploader");
	this.addInterface("Tridion.Cme.Command", ["BatchImageUploader"]);

	this.addInterface("PowerTools2011.ToolBase", ["BatchImageUploader"]);
};

PowerTools2011.Commands.BatchImageUploader.prototype.isAvailable = function (selection)
{
	return true;
};

PowerTools2011.Commands.BatchImageUploader.prototype.isEnabled = function (selection)
{
	return true;
};

PowerTools2011.Commands.BatchImageUploader.prototype._execute = function (selection)
{
	var uriSelection = selection.getItem(0);
	
	var PopUpUrl = $ptUtils.expandPath("/powertools/client/BatchImageUploader/BatchImageUploader.aspx") + "?id=" + uriSelection; 
	var popup = $popup.create(PopUpUrl, "toolbar=no,width=600,height=300,resizable=no,scrollbars=yes", null);

	popup.open();
};

