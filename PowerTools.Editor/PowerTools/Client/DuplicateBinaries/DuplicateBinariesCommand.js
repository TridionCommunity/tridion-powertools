Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.DuplicateBinaries = function ()
{
    Type.enableInterface(this, "PowerTools.Commands.DuplicateBinaries");
    this.addInterface("Tridion.Cme.Command", ["DuplicateBinaries"]);
    this.addInterface("PowerTools.ToolBase", ["DuplicateBinaries"]);
};

PowerTools.Commands.DuplicateBinaries.prototype.isAvailable = function (selection)
{
    return this._defineEnabled(selection);
};

PowerTools.Commands.DuplicateBinaries.prototype.isEnabled = function (selection)
{
    return this._defineEnabled(selection);
};

PowerTools.Commands.DuplicateBinaries.prototype._execute = function (selection) {
    var itemId = this._selectedItem(selection);
    var publicationId = "";

    // if the item is already the publication use that as the id, otherwise get the item publication id
    if ($models.getItemType(itemId) == $const.ItemType.PUBLICATION)
        publicationId = itemId;
    else
        publicationId = $models.getItem(itemId).getPublicationId();

    var popUpUrl = $ptUtils.expandPath("/PowerTools/Client/DuplicateBinaries/DuplicateBinaries.aspx") + "#orgItemId=" + publicationId;
    var popup = $popup.create(popUpUrl, "toolbar=no,width=600px,height=400px,resizable=false,scrollbars=false", null);
    popup.open();
};

PowerTools.Commands.DuplicateBinaries.prototype._selectedItem = function (selection)
{
    switch (selection.getCount())
    {
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

PowerTools.Commands.DuplicateBinaries.prototype._defineEnabled = function (selection)
{
    var item = this._selectedItem(selection);
    if (item != null)
    {
        switch ($models.getItemType(item))
        {
            case $const.ItemType.FOLDER:
            case $const.ItemType.PUBLICATION:
            case $const.ItemType.STRUCTURE_GROUP:
            case $const.ItemType.CATEGORY:
            case $const.ItemType.CATMAN:
                return true;
                break;
        }
    }

    return false;
}