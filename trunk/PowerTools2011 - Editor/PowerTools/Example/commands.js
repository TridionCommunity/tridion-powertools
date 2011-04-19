Type.registerNamespace("UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011");

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Example = function Commands$Example() {
    Type.enableInterface(this, "UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Example");
    this.addInterface("Tridion.Cme.Command", ["Example"]);
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Example.prototype.isAvailable = function Example$isAvailable(selection) {
    return true;
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Example.prototype.isEnabled = function Example$isEnabled(selection) {

    return true;
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Example.prototype._execute = function Example$_execute(selection) {
        var uriSelection = selection.getItem(0);
        var PopUpUrl = "/WebUI/Editors/PowerTools2011/PowerTools/Example/Main_PopUp.aspx" + "?id=" + uriSelection;
        var popup = $popup.create(PopUpUrl, "toolbar=no,width=600,height=300,resizable=no,scrollbars=yes", null);
        popup.open();
};

