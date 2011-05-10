Type.registerNamespace("UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011");

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Default = function Commands$Default() {
    Type.enableInterface(this, "UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Default");
    this.addInterface("Tridion.Cme.Command", ["Default"]);
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Default.prototype.isAvailable = function Default$isAvailable(selection) {
    return true;
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Default.prototype.isEnabled = function Default$isEnabled(selection) {

    return true;
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.Default.prototype._execute = function Default$_execute(selection) {
    debugger
    alert("This is the EXECUTE() method in the 'commands.js' file stored in '/powertools/shared' directory");
};

