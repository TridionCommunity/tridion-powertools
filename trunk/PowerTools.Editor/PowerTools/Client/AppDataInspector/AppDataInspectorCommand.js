Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.AppDataInspector = function()
{
    Type.enableInterface(this, "PowerTools.Commands.AppDataInspector");
    this.addInterface("PowerTools.BaseCommand", ["AppDataInspector"]);
};

PowerTools.Commands.AppDataInspector.prototype.isValidSelection = function AppDataInspector$isValidSelection(selection)
{
	return !!this._getSelectedItemId(selection);
};

PowerTools.Commands.AppDataInspector.prototype._execute = function AppDataInspector$_execute(selection)
{
    var itemId = this._getSelectedItemId(selection);
	if (!itemId) return;

    var popUpUrl = $ptUtils.expandPath("/PowerTools/Client/AppDataInspector/AppDataInspectorPopup.aspx") + "#id=" + itemId;
    var popup = $popup.create(popUpUrl, "toolbar=no,width=800px,height=600px,resizable=yes", null);
    popup.open();
};

// Get the selected item from either the list selection (main panel) or the tree (left navigation tree).
// Return null if no selection available.
PowerTools.Commands.AppDataInspector.prototype._getSelectedItemId = function AppDataInspector$_getSelectedItemId(selection)
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
		default:
			return null;
	}
};