Type.registerNamespace("UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011");

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.BatchImageUploader = function Commands$BatchImageUploader() {
    Type.enableInterface(this, "UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.BatchImageUploader");
    this.addInterface("Tridion.Cme.Command", ["BatchImageUploader"]);
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.BatchImageUploader.prototype.isAvailable = function BatchImageUploader$isAvailable(selection) {
    return true;
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.BatchImageUploader.prototype.isEnabled = function BatchImageUploader$isEnabled(selection) {

    return true;
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.BatchImageUploader.prototype._execute = function BatchImageUploader$_execute(selection) {
        var uriSelection = selection.getItem(0);
        var PopUpUrl = "/WebUI/Editors/PowerTools2011/PowerTools/BatchImageUploader/BatchImageUploader.aspx" + "?id=" + uriSelection;
        var popup = $popup.create(PopUpUrl, "toolbar=no,width=600,height=300,resizable=no,scrollbars=yes", null);
        popup.open();
};

