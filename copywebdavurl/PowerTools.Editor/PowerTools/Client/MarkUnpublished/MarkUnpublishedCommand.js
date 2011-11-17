Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.MarkUnpublished = function ()
{
    Type.enableInterface(this, "PowerTools.Commands.MarkUnpublished");
    this.addInterface("Tridion.Cme.Command", ["MarkUnpublished"]);
    this.addInterface("PowerTools.ToolBase", ["MarkUnpublished"]);
};

PowerTools.Commands.MarkUnpublished.prototype.isAvailable = function (selection)
{
    //    //Only show the button if a single FOLDER is selected
    //    if (selection.getCount() == 1) {
    //        var itemType = $models.getItemType(selection.getItem(0));
    //        var item = $models.getItem(selection.getItem(0))
    //        if (itemType == $const.ItemType.FOLDER) {
    //            return true;
    //        }
    //    }
    return this._defineEnabled();
};

PowerTools.Commands.MarkUnpublished.prototype.isEnabled = function (selection)
{
    return this._defineEnabled();
};

PowerTools.Commands.MarkUnpublished.prototype._execute = function (selection)
{
    var uriSelection = selection.getItem(0);
    var baseElement = $("#contentsplitter_container");
    var iFrame = $("#CustomPagesFrame");
    var self = this;

    var PopUpUrl = $ptUtils.expandPath("/PowerTools/Client/MarkUnpublished/MarkUnpublished.aspx") + "#folderId=" + uriSelection;
    var popup = $popup.create(PopUpUrl, "toolbar=no,width=600px,height=400px,resizable=false,scrollbars=false", null);
    popup.open();
};

PowerTools.Commands.MarkUnpublished.prototype._defineEnabled = function ()
{
    var treeView = $controls.getControl($("#DashboardTree"), "Tridion.Controls.FilteredTree");
    var selection = treeView.getSelection().getItem(0);
    //raise error if >1 item selected
    var itemType = $models.getItemType(selection);
    if (itemType == $const.ItemType.FOLDER || itemType == $const.ItemType.STRUCTURE_GROUP)
    {
        return true;
    }
    return false;
}