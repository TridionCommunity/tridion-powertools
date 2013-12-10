// setup and initialize interface
Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.Help = function Help$constructor() 
{
    Type.enableInterface(this, "PowerTools.Popups.Help");
    this.addInterface("Tridion.Cme.View");
    this.addInterface("PowerToolsBase", [this]);
};

PowerTools.Popups.Help.prototype.initialize = function Help$initialize() 
{
    this.callBase("Tridion.Cme.View", "initialize");
    this.properties.controls.TabControl = $controls.getControl($("#HelpTabControl"), "Tridion.Controls.TabControl");
};


$display.registerView(PowerTools.Popups.Help);
