Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.ImageUploader = function ()
{
    Type.enableInterface(this, "PowerTools.Commands.ImageUploader");
    this.addInterface("Tridion.Cme.Command", ["ImageUploader"]);
    this.addInterface("PowerTools.ToolBase", ["ImageUploader"]);

   
};

PowerTools.Commands.ImageUploader.prototype.isAvailable = function (selection)
{
    return this._defineEnabled();
};

PowerTools.Commands.ImageUploader.prototype.isEnabled = function (selection)
{
    return this._defineEnabled();
};

PowerTools.Commands.ImageUploader.prototype._execute = function (selection) {
    var uriSelection = $url.getHashParam("locationId");  //selection.getItem(0);
    var baseElement = $("#contentsplitter_container");
    var iFrame = $("#CustomPagesFrame");
    var self = this;

    var PopUpUrl = $ptUtils.expandPath("/PowerTools/Client/ImageUploader/ImageUploader.aspx") + "#folderId=" + uriSelection;
    var popup = $popup.create(PopUpUrl, "toolbar=no,width=600px,height=400px,resizable=false,scrollbars=false", null);
    popup.open();
};

PowerTools.Commands.ImageUploader.prototype._defineEnabled = function ()
{
    var itemType = $models.getItemType($url.getHashParam("locationId"));
    if (itemType == $const.ItemType.FOLDER)
    {
        return true;
    }
    return false;
}