Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.FieldRemover = function()
{
    Type.enableInterface(this, "PowerTools.Commands.FieldRemover");
    this.addInterface("PowerTools.BaseCommand", ["FieldRemover"]);
};

PowerTools.Commands.FieldRemover.prototype._execute = function(selection)
{
    var PopUpUrl = $ptUtils.expandPath("/PowerTools/Client/FieldRemover/FieldRemover.aspx");
    var popup = $popup.create(PopUpUrl, "toolbar=no,width=600px,height=400px,resizable=false,scrollbars=false", null);
    popup.open();
};

PowerTools.Commands.FieldRemover.prototype.isValidSelection = function(selection)
{
    var treeView = $controls.getControl($("#DashboardTree"), "Tridion.Controls.FilteredTree");
    var selectedItem = treeView.getSelection().getItem(0);
    var itemType = $models.getItemType(selectedItem);
    return (itemType == $const.ItemType.SCHEMA);
}