Type.registerNamespace("UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011");

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Toolbox = function Commands$Toolbox() {
    Type.enableInterface(this, "UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Toolbox");
    this.addInterface("Tridion.Cme.Command", ["Toolbox"]);
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Toolbox.prototype.isAvailable = function Toolbox$isAvailable(selection) {
    return true;
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Toolbox.prototype.isEnabled = function Toolbox$isEnabled(selection) {

    return true;
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Toolbox.prototype._execute = function Toolbox$_execute(selection) {
    var iframe = $("#CustomPagesFrame");
    iframe.src = "/WebUI/Editors/PowerTools2011/PowerTools/Toolbox/index.aspx";
};

