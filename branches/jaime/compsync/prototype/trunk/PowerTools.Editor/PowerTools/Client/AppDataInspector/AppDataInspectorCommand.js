Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.AppDataInspectorPopup = function ()
{
    Type.enableInterface(this, "PowerTools.Commands.AppDataInspectorPopup");
    this.addInterface("Tridion.Cme.Command", ["AppDataInspector"]);
    this.addInterface("PowerTools.ToolBase", ["AppDataInspector"]);
};

PowerTools.Commands.AppDataInspectorPopup.prototype.isAvailable = function (selection)
{
    return this._defineEnabled(selection);
};

PowerTools.Commands.AppDataInspectorPopup.prototype.isEnabled = function (selection)
{
    return this._defineEnabled(selection);
};

PowerTools.Commands.AppDataInspectorPopup.prototype._execute = function (selection)
{
    var itemId = this._selectedItem(selection);
    var popUpUrl = $ptUtils.expandPath("/PowerTools/Client/AppDataInspector/AppDataInspectorPopup.aspx") + "#id=" + itemId;
    var popup = $popup.create(popUpUrl, "toolbar=no,width=700px,height=500px,resizable=false,scrollbars=false", null);
    popup.open();
};

// Get the selected item from either the list selection (main panel) or the tree (left navigation tree).
// Return null if no selection available.
PowerTools.Commands.AppDataInspectorPopup.prototype._selectedItem = function (selection)
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

PowerTools.Commands.AppDataInspectorPopup.prototype._defineEnabled = function (selection)
{
    return true;
}