Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.Help = function ()
{
    Type.enableInterface(this, "PowerTools.Commands.Tool");
    this.addInterface("Tridion.Cme.Command", ["Help"]);
    //this.addInterface("PowerTools.ToolBase", ["HelpTool"]);
    

};

PowerTools.Commands.Help.prototype.isAvailable = function (selection)
{
    return true;
};

PowerTools.Commands.Help.prototype.isEnabled = function (selection)
{
    return true;
};

PowerTools.Commands.Help.prototype._execute = function (selection) {
    //var uriSelection = selection.getItem(0);
    var PopUpUrl = $ptUtils.expandPath("/PowerTools/Client/Help/Help.aspx");
    $log.message("Help Pop-up executing with scrollbars=true");
    var popup = $popup.create(PopUpUrl, "toolbar=yes,width=600px,height=700px,resizable=true,scrollbars=true", null);
    popup.open();
};

