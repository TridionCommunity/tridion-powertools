Type.registerNamespace("UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011");

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Default = function Commands$Default() {
    Type.enableInterface(this, "UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Default");
    this.addInterface("Tridion.Cme.Command", ["Default"]);
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Default.prototype.isAvailable = function Default$isAvailable(selection) {
    return true;
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Default.prototype.isEnabled = function Default$isEnabled(selection) {

    return false;
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Default.prototype._execute = function Default$_execute(selection) {
        var uriSelection = selection.getItem(0);
        var PopUpUrl = "/WebUI/Editors/PowerTools2011/PowerTools/Example/Main_PopUp.aspx" + "?id=" + uriSelection;
        var popup = $popup.create(PopUpUrl, "toolbar=no,width=600,height=300,resizable=no,scrollbars=yes", null);
        popup.open();
};

