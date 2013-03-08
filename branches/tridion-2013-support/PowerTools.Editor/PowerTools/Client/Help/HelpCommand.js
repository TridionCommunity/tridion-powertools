Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.Help = function()
{
    Type.enableInterface(this, "PowerTools.Commands.Help");
    this.addInterface("PowerTools.BaseCommand", ["Help"]);
};

PowerTools.Commands.Help.prototype._execute = function(selection) 
{
    var url = $ptUtils.expandPath("/PowerTools/Client/Help/Help.aspx");
    var popup = $popup.create(url, "toolbar=yes,width=600px,height=700px,resizable=true,scrollbars=true", null);
	if (popup) popup.open();
};

