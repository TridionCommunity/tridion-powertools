Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.Help = function () {
    Type.enableInterface(this, "PowerTools.Commands.Tool");
    this.addInterface("Tridion.Cme.Command", ["Help"]);
    this.addInterface("PowerTools.ToolBase", ["HelpTool"]);
};

PowerTools.Commands.Help.prototype.isAvailable = function (selection) {
    return true;
};

PowerTools.Commands.Help.prototype.isEnabled = function (selection) {
    return true;
};

PowerTools.Commands.Help.prototype._execute = function (selection) {
    var uriSelection = selection.getItem(0);
    var PopUpUrl = $ptUtils.expandPath("/PowerTools/Client/Help/Help.aspx") + "?id=" + uriSelection;
    var popup = $popup.create(PopUpUrl, "toolbar=no,width=600px,height=600px,resizable=true,scrollbars=true", null);
    popup.open();
};

