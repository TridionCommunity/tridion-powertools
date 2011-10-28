Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.PagePublisher = function () {
    Type.enableInterface(this, "PowerTools.Commands.PagePublisher");
    this.addInterface("Tridion.Cme.Command", ["PagePublisher"]);
    this.addInterface("PowerTools.ToolBase", ["PagePublisher"]);
};

PowerTools.Commands.PagePublisher.prototype.isAvailable = function (selection)
{
    return this._defineEnabled();
};

PowerTools.Commands.PagePublisher.prototype.isEnabled = function (selection)
{
    return this._defineEnabled();
};

PowerTools.Commands.PagePublisher.prototype._execute = function (selection)
{
    var uriSelection = selection.getItem(0);
    var baseElement = $("#contentsplitter_container");
    var iFrame = $("#CustomPagesFrame");
    var self = this;

    var PopUpUrl = $ptUtils.expandPath("/PowerTools/Client/PagePublisher/PagePublisher.aspx") + "#locationId=" + uriSelection;
    var popup = $popup.create(PopUpUrl, "toolbar=no,width=600px,height=400px,resizable=false,scrollbars=false", null);
    popup.open();
};

PowerTools.Commands.PagePublisher.prototype._defineEnabled = function ()
{
    var treeView = $controls.getControl($("#DashboardTree"), "Tridion.Controls.FilteredTree");
    var selection = treeView.getSelection().getItem(0);
    var itemType = $models.getItemType(selection);
    if (itemType == $const.ItemType.STRUCTURE_GROUP) {
        return true;
    }
    return false;
}