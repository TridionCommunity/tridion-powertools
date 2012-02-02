Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.DocumentItem = function () {
    Type.enableInterface(this, "PowerTools.Commands.DocumentItem");
    this.addInterface("Tridion.Cme.Command", ["DocumentItem"]);
    /* Do we really need this?*/
    this.addInterface("PowerTools.ToolBase", ["DocumentItem"]);
};

PowerTools.Commands.DocumentItem.prototype.isAvailable = function (selection)
{
    if (selection.getItems().length > 1)
        return false;
    var itemID = selection.getItem(0);
	if ($models.getItemType(itemID) != $const.ItemType.SCHEMA) {
		return false;
	}
    return true;
};

PowerTools.Commands.DocumentItem.prototype.isEnabled = function (selection)
{    
    return this.isAvailable(selection);
};

PowerTools.Commands.DocumentItem.prototype._execute = function ExportToWord$_execute(selection) {

    var itemID = selection.getItem(0);
    //var itemType = $models.getItemType(itemID);

    window.location = document.location.protocol + "//" + document.location.host + "/WebUI/Editors/PowerTools/PowerTools/Client/DocumentItem/SchemaDefinition.docx?id=" + itemID;
};
