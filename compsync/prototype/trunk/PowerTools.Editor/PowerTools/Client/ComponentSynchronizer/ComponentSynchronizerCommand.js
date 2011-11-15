Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.ComponentSynchronizer = function ()
{
    Type.enableInterface(this, "PowerTools.Commands.ComponentSynchronizer");
    this.addInterface("Tridion.Cme.Command", ["ComponentSynchronizer"]);
    this.addInterface("PowerTools.ToolBase", ["ComponentSynchronizer"]);
};

PowerTools.Commands.ComponentSynchronizer.prototype.isAvailable = function (selection)
{   
    return this._defineEnabled(selection);
};

PowerTools.Commands.ComponentSynchronizer.prototype.isEnabled = function (selection)
{
    return this._defineEnabled(selection);
};

PowerTools.Commands.ComponentSynchronizer.prototype._execute = function (selection) {
    var validSelection = this.isValidSelection(selection);

    if (validSelection) {
        var uriSelection = selection.getItem(0);
        var baseElement = $("#contentsplitter_container");
        var iFrame = $("#CustomPagesFrame");
        var self = this;

        //We are passing the uri selection. Needed? Maysbe Component Synchronizer can be activated for schemas.
        var PopUpUrl = $ptUtils.expandPath("/PowerTools/Client/ComponentSynchronizer/ComponentSynchronizer.aspx"); // +"#folderId=" + uriSelection;

        this._popup = $popup.create(PopUpUrl, "toolbar=no,width=750px,height=550px,resizable=false,scrollbars=false", { sel: selection });

        $evt.addEventHandler(this._popup, "unload", this.getDelegate(this._onPopupClose));

        this._popup.open();
        
    }
    else {
        var msg = $messages.createMessage("Tridion.Cme.Model.WarningMessage", "SYNCHRONIZATION", "Invalid selection", true, true);
        $messages.registerMessage(msg);
    }
    
};

PowerTools.Commands.ComponentSynchronizer.prototype.isValidSelection = function (sel) {
    var items = sel.getItems();
    if (items.length > 1) {
        var firstSchema = '';
        for (var i = 0, len = items.length; i < len; i++) {
            var itemId = sel.getItem(i);
            var item = $models.getItem(itemId);

            if (item) {
                if (i == 0) {
                    firstSchema = item.getSchema().getId();                    
                }
                if (i > 0 && item.getSchema().getId() != firstSchema) {
                    return false;
                }
            }
            
        }
    }
    return true;
}



PowerTools.Commands.ComponentSynchronizer.prototype._onPopupClose = function ()
{
    $evt.removeAllEventHandlers(this._popup);
    this._popup.dispose();
    this._popup = null;

};


PowerTools.Commands.ComponentSynchronizer.prototype._defineEnabled = function (selection) {
    if (!selection) {
        return false;
    }
    var items = selection.getItems();
    if (items.length == 0) {
        //Nothing Selected
        return false;
    } else if (items.length == 1) {
        var itemId = selection.getItem(0);
        var item = $models.getItem(itemId);
        if (item) {
            if (item.getItemType() != $const.ItemType.SCHEMA && item.getItemType() != $const.ItemType.COMPONENT) {
                return false;
            }
        }
    } else {
        for (var i = 0, len = items.length; i < len; i++) {
            var itemId = selection.getItem(0);
            var item = $models.getItem(itemId);

            if (item) {
                if (item.getItemType() != $const.ItemType.COMPONENT) {
                    return false;
                }
            }
        }
    }
    return true;

}