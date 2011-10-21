Type.registerNamespace("PowerTools2011.Commands");

PowerTools2011.Commands.ComponentSynchronizer = function ()
{
    Type.enableInterface(this, "PowerTools2011.Commands.ComponentSynchronizer");
    this.addInterface("Tridion.Cme.Command", ["ComponentSynchronizer"]);
    this.addInterface("PowerTools2011.ToolBase", ["ComponentSynchronizer"]);
};

PowerTools2011.Commands.ComponentSynchronizer.prototype.isAvailable = function (selection) {
    //    //Only show the button if a single FOLDER is selected
    //    if (selection.getCount() == 1) {
    //        var itemType = $models.getItemType(selection.getItem(0));
    //        var item = $models.getItem(selection.getItem(0))
    //        if (itemType == $const.ItemType.FOLDER) {
    //            return true;
    //        }
    //    }
    return this._defineEnabled();
};

PowerTools2011.Commands.ComponentSynchronizer.prototype.isEnabled = function (selection) {
    return this._defineEnabled();
};

PowerTools2011.Commands.ComponentSynchronizer.prototype._execute = function (selection) {
    var uriSelection = selection.getItem(0);
    var baseElement = $("#contentsplitter_container");
    var iFrame = $("#CustomPagesFrame");
    var self = this;

    //We are passing the uri selection. Needed? Maysbe Component Synchronizer can be activated for schemas.
    var PopUpUrl = $ptUtils.expandPath("/PowerTools/Client/ComponentSynchronizer/ComponentSynchronizer.aspx") + "#folderId=" + uriSelection;
    this._popup = $popup.create(PopUpUrl, "toolbar=no,width=600,height=400,resizable=false,scrollbars=false", null);

    $evt.addEventHandler(this._popup, "close", this.getDelegate(this._onPopupClose));

    this._popup.open();
};


PowerTools2011.Commands.ComponentSynchronizer.prototype._onPopupClose = function () {
    $evt.removeAllEventHandlers(this._popup);
    this._popup.dispose();
    this._popup = null;

};



PowerTools2011.Commands.ComponentSynchronizer.prototype._defineEnabled = function () {
    var treeView = $controls.getControl($("#DashboardTree"), "Tridion.Controls.FilteredTree");
    var selection = treeView.getSelection().getItem(0);
    var itemType = $models.getItemType(selection);
    if (itemType == $const.ItemType.FOLDER) {
        return true;
    }
    return false;
}