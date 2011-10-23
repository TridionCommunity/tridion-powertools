Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.CountItems = function ()
{
    Type.enableInterface(this, "PowerTools.Commands.CountItems");
    this.addInterface("Tridion.Cme.Command", ["CountItems"]);
    this.addInterface("PowerTools.ToolBase", ["CountItems"]);
};

PowerTools.Commands.CountItems.prototype.isAvailable = function (selection)
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

PowerTools.Commands.CountItems.prototype.isEnabled = function (selection)
{
    return this._defineEnabled();
};

PowerTools.Commands.CountItems.prototype._execute = function (selection)
{
    var uriSelection = $url.getHashParam("locationId");  //selection.getItem(0);
    var baseElement = $("#contentsplitter_container");
    var iFrame = $("#CustomPagesFrame");
    var self = this;

    var PopUpUrl = $ptUtils.expandPath("/PowerTools/Client/CountItems/CountItems.aspx") + "#folderId=" + uriSelection;
    var popup = $popup.create(PopUpUrl, "toolbar=no,width=600,height=400,resizable=false,scrollbars=false", null);
    popup.open();
};

PowerTools.Commands.CountItems.prototype._defineEnabled = function ()
{
    var treeView = $controls.getControl($("#DashboardTree"), "Tridion.Controls.FilteredTree");
    var selection = treeView.getSelection().getItem(0);
    var itemType = $models.getItemType(selection);
    if (itemType == $const.ItemType.FOLDER)
    {
        return true;
    }
    return false;
}