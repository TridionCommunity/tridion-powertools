Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.Example = function ExampleCommand$constructor()
{
    Type.enableInterface(this, "PowerTools.Commands.Example");
    this.addInterface("PowerTools.BaseCommand", ["Example"]);
};

PowerTools.Commands.Example.prototype._execute = function ExampleCommand$_execute(selection)
{
    var uriSelection = selection.getItem(0);
    var PopUpUrl = $ptUtils.expandPath("/PowerTools/Client/Example/Example.aspx") + "?id=" + uriSelection;
    var popup = $popup.create(PopUpUrl, "toolbar=no,width=600px,height=600px,resizable=false,scrollbars=false", null);
    popup.open();
};

