Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.ItemCommentingMenu = function ()
{
    Type.enableInterface(this, "PowerTools.Commands.ItemCommentingMenu");
    this.addInterface("PowerTools.BaseCommand", ["ItemCommentingMenu"]);
};

PowerTools.Commands.ItemCommentingMenu.prototype.isValidSelection = function (selection) {
    //Use the existing Save command from the CME
    return true;
}

PowerTools.Commands.ItemCommentingMenu.prototype._execute = function (selection) {
    $evt.addEventHandler(item, "open", this.getDelegate(this._onItemOpened));
    $cme.getCommand("Open")._execute(selection);
};

PowerTools.Commands.ItemCommentingMenu.prototype._onItemOpened = function (item) {
    var response = item;
};


