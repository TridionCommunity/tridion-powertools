Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.FieldRemover = function ()
{
    Type.enableInterface(this, "PowerTools.Commands.FieldRemover");
    this.addInterface("Tridion.Cme.Command", ["FieldRemover"]);
    this.addInterface("PowerTools.ToolBase", ["FieldRemover"]);
};

PowerTools.Commands.FieldRemover.prototype.isAvailable = function (selection)
{
    if (itemType != undefined)
    {
        console.log('available ' + itemType.toString());
    }
    //Only show the button if a single schema is selected
    if (selection.getCount() == 1)
    {
        var itemType = $models.getItemType(selection.getItem(0));
        var item = $models.getItem(selection.getItem(0))
        if (itemType == $const.ItemType.SCHEMA)
        {
            return true;
        }
    }
    return this._defineEnabled();
    return true;
};

PowerTools.Commands.FieldRemover.prototype.isEnabled = function (selection)
{
    return this._defineEnabled();
};

PowerTools.Commands.FieldRemover.prototype._execute = function (selection)
{
    //var uriSelection = selection.getItem(0);
    //var baseElement = $("#contentsplitter_container");
    //var iFrame = $("#CustomPagesFrame");
    //var self = this;

    var PopUpUrl = $ptUtils.expandPath("/PowerTools/Client/FieldRemover/FieldRemover.aspx");
    var popup = $popup.create(PopUpUrl, "toolbar=no,width=600px,height=400px,resizable=false,scrollbars=false", null);
    popup.open();
};

PowerTools.Commands.FieldRemover.prototype._defineEnabled = function ()
{
    if (itemType != undefined)
    {
        console.log('enabled ' + itemType.toString());
    }
    var treeView = $controls.getControl($("#DashboardTree"), "Tridion.Controls.FilteredTree");
    var selection = treeView.getSelection().getItem(0);
    var itemType = $models.getItemType(selection);
    if (itemType == $const.ItemType.SCHEMA)
    {
        return true;
    }
    return false;
}