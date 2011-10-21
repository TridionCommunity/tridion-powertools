Type.registerNamespace("UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011");

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.CompSync = function Commands$CompSync() {
    Type.enableInterface(this, "UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.CompSync");
    this.addInterface("Tridion.Cme.Command", ["CompSync"]);
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.CompSync.prototype.isAvailable = function CompSync$isAvailable(selection) {
    return true;
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.CompSync.prototype.isEnabled = function CompSync$isEnabled(selection) {
    //Only returns TRUE if ONE item is selected and it is of type SCHEMA

    if (selection.getCount() == 1) {
        debugger
        var itemType = $models.getItemType(selection.getItem(0));
        var item = $models.getItem(selection.getItem(0))
        console.log('hello');
        alert(item);
        if (itemType == $const.ItemType.SCHEMA) {
            return true;
        }
    }
    return false;
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.CompSync.prototype._execute = function CompSync$_execute(selection) {
c=
    alert("This is the EXECUTE() method in the 'commands.js' file stored in '/powertools/CompSync' directory");
};

