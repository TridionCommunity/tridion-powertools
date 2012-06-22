Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.DocumentItem = function () 
{
    Type.enableInterface(this, "PowerTools.Commands.DocumentItem");
    this.addInterface("PowerTools.BaseCommand", ["DocumentItem"]);
};

PowerTools.Commands.DocumentItem.prototype.isValidSelection = function (selection)
{
    if (selection.getItems().length > 1)
	{
        return false;
	}

    var itemID = selection.getItem(0);
	return ($models.getItemType(itemID) == $const.ItemType.SCHEMA);
};

PowerTools.Commands.DocumentItem.prototype._execute = function ExportToWord$_execute(selection) 
{
    var itemID = selection.getItem(0);
    window.location = document.location.protocol + "//" + document.location.host + "/WebUI/Editors/PowerTools/PowerTools/Client/DocumentItem/SchemaDefinition.docx?id=" + itemID;
};
