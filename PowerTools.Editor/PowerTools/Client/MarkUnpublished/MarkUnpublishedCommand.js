Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.MarkUnpublished = function ()
{
    Type.enableInterface(this, "PowerTools.Commands.MarkUnpublished");
    this.addInterface("PowerTools.BaseCommand", ["MarkUnpublished"]);
};

PowerTools.Commands.MarkUnpublished.prototype._execute = function(selection)
{
    var uriSelection = selection.getItem(0);
    var url = $ptUtils.expandPath("/PowerTools/Client/MarkUnpublished/MarkUnpublished.aspx") + "#folderId=" + uriSelection;
    var popup = $popup.create(url, "toolbar=no,width=600px,height=400px,resizable=false,scrollbars=false", null);
    if (popup) popup.open();
};

PowerTools.Commands.MarkUnpublished.prototype.isValidSelection = function(selection)
{
    var treeView = $controls.getControl($("#DashboardTree"), "Tridion.Controls.FilteredTree");
    var selectedItem = treeView.getSelection().getItem(0);
    var itemType = $models.getItemType(selectedItem);
    return (itemType == $const.ItemType.FOLDER || itemType == $const.ItemType.STRUCTURE_GROUP);
}