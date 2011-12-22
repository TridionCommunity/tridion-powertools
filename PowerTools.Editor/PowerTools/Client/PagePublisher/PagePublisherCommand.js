Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.PagePublisher = function ()
{
    Type.enableInterface(this, "PowerTools.Commands.PagePublisher");
    this.addInterface("Tridion.Cme.Command", ["PagePublisher"]);
    this.addInterface("PowerTools.ToolBase", ["PagePublisher"]);
};

PowerTools.Commands.PagePublisher.prototype.isAvailable = function (selection)
{
    return this._defineEnabled(selection);
};

PowerTools.Commands.PagePublisher.prototype.isEnabled = function (selection)
{
    return this._defineEnabled(selection);
};

PowerTools.Commands.PagePublisher.prototype._execute = function (selection) {

    // get the id of the selected item
    var uriSelection = $url.getHashParam("locationId");  //selection.getItem(0);

    // build the pop up url for the publish dialog and open it
    var PopUpUrl = $ptUtils.expandPath("/PowerTools/Client/PagePublisher/PagePublisher.aspx") + "#locationId=" + uriSelection;
    var popup = $popup.create(PopUpUrl, "toolbar=no,width=750px,height=510px,resizable=false,scrollbars=false", null);
    popup.open();
};

PowerTools.Commands.PagePublisher.prototype._defineEnabled = function (selection) {

/*
    var selected;

    switch (selection.getCount()) {
        case 0: // check the Tree selection
            var treeView = $controls.getControl($("#DashboardTree"), "Tridion.Controls.FilteredTree");
            selected = treeView.getSelection().getItem(0);
            break;

        case 1: // multiple items selected in the main list
            selected = selection.getItem(0);
            break;

        default:
            return null;
            break;
    }

*/

    var itemType = $models.getItemType($url.getHashParam("locationId"));

    if (itemType == $const.ItemType.STRUCTURE_GROUP || itemType == $const.ItemType.PUBLICATION) {
        return true;
    }
    return false;
}