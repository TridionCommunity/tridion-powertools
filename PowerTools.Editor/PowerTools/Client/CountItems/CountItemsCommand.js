Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.CountItems = function CountItemsCommand$constructor()
{
    Type.enableInterface(this, "PowerTools.Commands.CountItems");
    this.addInterface("PowerTools.BaseCommand", ["CountItems"]);
};

PowerTools.Commands.CountItems.prototype._execute = function CountItemsCommand$_execute(selection)
{
    var itemId = this._selectedItem(selection);
    var popUpUrl = $ptUtils.expandPath("/PowerTools/Client/CountItems/CountItems.aspx") + "#orgItemId=" + itemId;
    var popup = $popup.create(popUpUrl, "toolbar=no,width=600px,height=400px,resizable=false,scrollbars=false", null);
    popup.open();
};

PowerTools.Commands.CountItems.prototype._selectedItem = function CountItemsCommand$_selectedItem(selection)
{
    switch (selection.getCount())
    {
        case 0: // check the Tree selection
            var treeView = $controls.getControl($("#DashboardTree"), "Tridion.Controls.FilteredTree");
            return treeView.getSelection().getItem(0);
        case 1: // single item selected in the main list
            return selection.getItem(0);
        default:
            return null;
    }
};

PowerTools.Commands.CountItems.prototype.isValidSelection = function CountItemsCommand$isValidSelection(selection)
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
        }
    }

    return false;
};