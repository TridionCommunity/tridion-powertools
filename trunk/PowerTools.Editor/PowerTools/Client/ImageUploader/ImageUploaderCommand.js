Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.ImageUploader = function()
{
    Type.enableInterface(this, "PowerTools.Commands.ImageUploader");
    this.addInterface("PowerTools.BaseCommand", ["ImageUploader"]);
};

PowerTools.Commands.ImageUploader.prototype._execute = function(selection)
{
    var uriSelection = $url.getHashParam("locationId");
    var url = $ptUtils.expandPath("/PowerTools/Client/ImageUploader/ImageUploader.aspx") + "#folderId=" + uriSelection;
    var popup = $popup.create(url, "toolbar=no,width=600px,height=400px,resizable=false,scrollbars=false", null);
    if (popup) popup.open();
};

PowerTools.Commands.ImageUploader.prototype.isValidSelection = function ()
{
    var itemType = $models.getItemType($url.getHashParam("locationId"));
    return (itemType == $const.ItemType.FOLDER);
}