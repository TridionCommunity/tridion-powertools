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
    var uriSelection = this._selectedItem(selection); //$url.getHashParam("locationId");  //selection.getItem(0);

    // build the pop up url for the publish dialog and open it
    var PopUpUrl = $ptUtils.expandPath("/PowerTools/Client/PagePublisher/PagePublisher.aspx") + "#locationId=" + uriSelection;
    var popup = $popup.create(PopUpUrl, "toolbar=no,width=750px,height=510px,resizable=false,scrollbars=false", null);
    popup.open();
};

PowerTools.Commands.PagePublisher.prototype._selectedItem = function (selection) {
    switch (selection.getCount()) {
        case 0: // check the Tree selection
            var treeView = $controls.getControl($("#DashboardTree"), "Tridion.Controls.FilteredTree");
            return treeView.getSelection().getItem(0);
            break;

        case 1: // multiple items selected in the main list
            return selection.getItem(0);
            break;

        default:
            return null;
            break;
    }
}

PowerTools.Commands.PagePublisher.prototype._defineEnabled = function (selection) {

    var item = this._selectedItem(selection);
    if (item != null)
    {
        switch ($models.getItemType(item))
        {
            case $const.ItemType.PUBLICATION:
            case $const.ItemType.STRUCTURE_GROUP:
                return true;
                break;
        }
    }
    return false;
}
