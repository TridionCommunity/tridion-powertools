Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.Help = function () {
    Type.enableInterface(this, "PowerTools.Popups.Help");
    this.addInterface("Tridion.Cme.View");

    var p = this.properties;

    p.processId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
};


$display.registerView(PowerTools.Popups.Help);
