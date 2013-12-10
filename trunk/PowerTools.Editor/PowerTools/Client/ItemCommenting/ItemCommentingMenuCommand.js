Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.ItemCommentingMenu = function ItemCommentingMenuCommand$constructor()
{
    Type.enableInterface(this, "PowerTools.Commands.ItemCommentingMenu");
    this.addInterface("PowerTools.BaseCommand", ["ItemCommentingMenu"]);
};

PowerTools.Commands.ItemCommentingMenu.prototype.isValidSelection = function ItemCommentingMenuCommand$isValidSelection(selection)
{
	return true;
};

PowerTools.Commands.ItemCommentingMenu.prototype._execute = function ItemCommentingMenuCommand$_execute(selection) 
{
    $evt.addEventHandler(item, "open", this.getDelegate(this._onItemOpened));
    $cme.getCommand("Open")._execute(selection);
};

PowerTools.Commands.ItemCommentingMenu.prototype._onItemOpened = function ItemCommentingMenuCommand$_onItemOpened(item) 
{
    var response = item;
};


