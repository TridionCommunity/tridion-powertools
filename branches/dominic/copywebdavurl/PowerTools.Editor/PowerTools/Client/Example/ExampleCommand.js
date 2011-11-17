Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.Example = function () {
    $log.message("PowerTools.Commands.Example.ctor");
    Type.enableInterface(this, "PowerTools.Commands.Example");
    this.addInterface("Tridion.Cme.Command", ["ExampleTool"]);
    this.addInterface("PowerTools.ToolBase", ["ExampleTool"]);
};

PowerTools.Commands.Example.prototype.isAvailable = function (selection) {
    $log.message("PowerTools.Commands.Example.prototype.isAvailable");
    return true;
};

PowerTools.Commands.Example.prototype.isEnabled = function (selection) {
    $log.message("PowerTools.Commands.Example.prototype.isAvailale");
    return true;
};

PowerTools.Commands.Example.prototype._execute = function (selection) {
    $log.message("PowerTools.Commands.Example.prototype._execute");
    var uriSelection = selection.getItem(0);
    var PopUpUrl = $ptUtils.expandPath("/PowerTools/Client/Example/Example.aspx") + "?id=" + uriSelection;
    var popup = $popup.create(PopUpUrl, "toolbar=no,width=600px,height=400px,resizable=false,scrollbars=false", null);
    popup.open();
};

