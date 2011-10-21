Type.registerNamespace("PowerTools2011.Commands");

PowerTools2011.Commands.FieldRemover = function ()
{
    Type.enableInterface(this, "PowerTools2011.Commands.FieldRemover");
    this.addInterface("Tridion.Cme.Command", ["FieldRemover"]);
    this.addInterface("PowerTools2011.ToolBase", ["FieldRemover"]);
};

PowerTools2011.Commands.FieldRemover.prototype.isAvailable = function (selection) {
    if (itemType != undefined) {
        console.log('available ' + itemType.toString());
    }
    //Only show the button if a single schema is selected
    if (selection.getCount() == 1) {
        var itemType = $models.getItemType(selection.getItem(0));
        var item = $models.getItem(selection.getItem(0))
        if (itemType == $const.ItemType.SCHEMA) {
            return true;
        }
    }
    return this._defineEnabled();
    return true;
};

PowerTools2011.Commands.FieldRemover.prototype.isEnabled = function (selection) {
    return this._defineEnabled();
};

PowerTools2011.Commands.FieldRemover.prototype._execute = function (selection)
{
    //var uriSelection = selection.getItem(0);
    //var baseElement = $("#contentsplitter_container");
    //var iFrame = $("#CustomPagesFrame");
    //var self = this;

    var PopUpUrl = $ptUtils.expandPath("/PowerTools/Client/FieldRemover/FieldRemover.aspx");
    var popup = $popup.create(PopUpUrl, "toolbar=no,width=600,height=400,resizable=false,scrollbars=false", null);
    popup.open();
};

PowerTools2011.Commands.FieldRemover.prototype._defineEnabled = function () {
    if (itemType != undefined) {
        console.log('enabled ' + itemType.toString());
    }
    var treeView = $controls.getControl($("#DashboardTree"), "Tridion.Controls.FilteredTree");
    var selection = treeView.getSelection().getItem(0);
    var itemType = $models.getItemType(selection);
    if (itemType == $const.ItemType.SCHEMA) {
        return true;
    }
    return false;
}