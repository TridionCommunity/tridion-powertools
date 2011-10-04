Type.registerNamespace("PowerTools2011.Commands");

PowerTools2011.Commands.ImageUploader = function ()
{
    Type.enableInterface(this, "PowerTools2011.Commands.ImageUploader");
    this.addInterface("Tridion.Cme.Command", ["ImageUploader"]);
    this.addInterface("PowerTools2011.ToolBase", ["ImageUploader"]);
};

PowerTools2011.Commands.ImageUploader.prototype.isAvailable = function (selection)
{
    //Only show the button if a single FOLDER is selected
    if (selection.getCount() == 1) {
        var itemType = $models.getItemType(selection.getItem(0));
        var item = $models.getItem(selection.getItem(0))
        if (itemType == $const.ItemType.FOLDER) {
            return true;
        }
    }
    return false;
};

PowerTools2011.Commands.ImageUploader.prototype.isEnabled = function (selection) {
   
    if (selection.getCount() == 1) {
        var itemType = $models.getItemType(selection.getItem(0));
        //var item = $models.getItem(selection.getItem(0))
        if (itemType == $const.ItemType.FOLDER) {
            return true;
        }
    }
    return false;
};

PowerTools2011.Commands.ImageUploader.prototype._execute = function (selection)
{
    var uriSelection = selection.getItem(0);
    var baseElement = $("#contentsplitter_container");
    var iFrame = $("#CustomPagesFrame");
    var self = this;

    var PopUpUrl = $ptUtils.expandPath("/powertools/client/PT_ImageUploader/ImageUploader.aspx") + "?id=" + uriSelection;
    var popup = $popup.create(PopUpUrl, "toolbar=no,width=600,height=400,resizable=false,scrollbars=false", null);
    popup.open();
};

