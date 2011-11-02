Type.registerNamespace("PowerTools.Tabs");

// Constructs a new tab for AppData Inspector. Adds itself to the current tabs deck
PowerTools.Tabs.AppDataInspector = function (element)
{
    if ($ptUtils.isCurrentUserAdmin())
    {
        Tridion.OO.enableInterface(this, "PowerTools.Tabs.AppDataInspector");
        this.addInterface("Tridion.Controls.DeckPage", [element]);
    }
    else
    {
        $j("#AppDataInspectorTab_switch").hide();
    }
};

// Initialization called by Anguilla. Deffers execution to base.initialize()
PowerTools.Tabs.AppDataInspector.prototype.initialize = function ()
{
    $log.message("Initializing AppDataInspector tab...");
    this.callBase("Tridion.Controls.DeckPage", "initialize");
};

// Upon selection of the tab, calls the updateView()
PowerTools.Tabs.AppDataInspector.prototype.select = function ()
{
    this.callBase("Tridion.Controls.DeckPage", "select");
    this.updateView();
};

// Main method. Entry point for the actual functionality. Calls AppDataInspectorWorker.execute().
// Same class is called from AppDataInspectorPopup.js as well.
PowerTools.Tabs.AppDataInspector.prototype.updateView = function ()
{
    if (this.isSelected())
    {
        var worker = new PowerTools.AppDataInspectorWorker();
        worker.execute();
    }
};

// Register itself with the Tridion.Controls.Deck namespace
Tridion.Controls.Deck.registerPageType(PowerTools.Tabs.AppDataInspector, "AppDataInspectorTab");
