Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.PagePublisher = function()
{
    Type.enableInterface(this, "PowerTools.Commands.PagePublisher");
    this.addInterface("PowerTools.BaseCommand", ["PagePublisher"]);
};

PowerTools.Commands.PagePublisher.prototype._execute = function(selection) 
{
    // Get the ID of the selected item
    var uriSelection = this._getSelectedItemId(selection);

    // Build the pop up url for the publish dialog and open it
    var url = $ptUtils.expandPath("/PowerTools/Client/PagePublisher/PagePublisher.aspx") + "#locationId=" + uriSelection;
    var popup = $popup.create(url, "toolbar=no,width=750px,height=510px,resizable=false,scrollbars=false", null);
    if (popup) popup.open();
};

PowerTools.Commands.PagePublisher.prototype._getSelectedItemId = function(selection) 
{
    switch (selection.getCount()) 
	{
        case 0:
            var treeView = $controls.getControl($("#DashboardTree"), "Tridion.Controls.FilteredTree");
            return treeView.getSelection().getItem(0);
        case 1:
            return selection.getItem(0);
    }

    return null;
}

PowerTools.Commands.PagePublisher.prototype.isValidSelection = function(selection)
{
    var itemId = this._getSelectedItemId(selection);
    if (itemId != null)
    {
		var itemType = $models.getItemType(itemId);
		return (itemType == $const.ItemType.PUBLICATION || itemType == $const.ItemType.STRUCTURE_GROUP);
    }

    return false;
}
