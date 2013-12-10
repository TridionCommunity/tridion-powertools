Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.DuplicateBinaries = function DuplicateBinariesCommand$constructor()
{
    Type.enableInterface(this, "PowerTools.Commands.DuplicateBinaries");
    this.addInterface("PowerTools.BaseCommand", ["DuplicateBinaries"]);
};

PowerTools.Commands.DuplicateBinaries.prototype._execute = function DuplicateBinariesCommand$_execute(selection) 
{
    var itemId = this._selectedItem(selection);
    var publicationId;

    // If the item is already the publication use that as the id, otherwise get the item publication id
	if ($models.getItemType(itemId) == $const.ItemType.PUBLICATION)
	{
		publicationId = itemId;
	} 
	else
	{
		publicationId = $models.getItem(itemId).getPublicationId();
	}

	var popUpUrl = $ptUtils.expandPath("/PowerTools/Client/DuplicateBinaries/DuplicateBinaries.aspx") + "#orgItemId=" + publicationId;
    var popup = $popup.create(popUpUrl, "toolbar=no,width=600px,height=470px,resizable=false,scrollbars=false", null);
    popup.open();
};

PowerTools.Commands.DuplicateBinaries.prototype._selectedItem = function DuplicateBinariesCommand$_selectedItem(selection)
{
	switch (selection.getCount())
	{
		case 0:
			// check the Tree selection
			var treeView = $controls.getControl($("#DashboardTree"), "Tridion.Controls.FilteredTree");
			return treeView.getSelection().getItem(0);
		case 1:
			// single item selected in the main list
			return selection.getItem(0);
	}

	return null;
};

PowerTools.Commands.DuplicateBinaries.prototype.isValidSelection = function DuplicateBinariesCommand$isValidSelection(selection)
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
}