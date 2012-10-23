Type.registerNamespace("PowerTools.Tabs");

// Constructs a new tab for Chang eHistory. Adds itself to the current tabs deck
PowerTools.Tabs.ItemCommentingTab = function (element) {

    Tridion.OO.enableInterface(this, PowerTools.Tabs.ItemCommentingTab);
    this.addInterface("Tridion.Controls.DeckPage", [element]);
};

// Initialization called by Anguilla. Deffers execution to base.initialize()
PowerTools.Tabs.ItemCommentingTab.prototype.initialize = function () {
    $log.message("Initializing Chage History tab...");
    this.callBase("Tridion.Controls.DeckPage", "initialize");
};

// Upon selection of the tab, calls the updateView()
PowerTools.Tabs.ItemCommentingTab.prototype.select = function ()
{
    this.callBase("Tridion.Controls.DeckPage", "select");
    this.updateView();
};

// Main method. Entry point for the actual functionality. Calls AppDataInspectorWorker.execute().
// Same class is called from AppDataInspectorPopup.js as well.
PowerTools.Tabs.ItemCommentingTab.prototype.updateView = function ()
{
    var onSuccess = Function.getDelegate(this, this.showChangeHistory);
    //$j('#itemCommentingTabDiv').html('hello world');

    PowerTools.Model.Services.AppDataServices.Read("ext:ItemCommenting", $url.getHashParam("id"), onSuccess, null, null, false);
   
};

PowerTools.Tabs.ItemCommentingTab.prototype.showChangeHistory = function (result) {
    var xml = $j(result);

    var output = "";

    var i = 0;
    var rowclass = 'row1';
    xml.find('comment').each(function () {
        if (i == 0) {
            rowclass = 'row0';
            i = 1;
        } else {
            rowclass = 'row1';
            i = 0;
        }
        output = output + "<tr class=\"" + rowclass + "\"><td>" + $j(this).find('user').text() + "</td><td><a href=\"/WebUI/item.aspx?tcm=16#id=tcm:1-46-v4\" target=\"_blank\">" + $j(this).find('version').text() + "</a></td><td>" + $j(this).find('message').text() + "</td><td>" + $j(this).find('datetime').text() + "</td></tr>";
    })
    $j('#itemcommentingbody').html(output);
};

// Register itself with the Tridion.Controls.Deck namespace

Tridion.Controls.Deck.registerPageType(PowerTools.Tabs.ItemCommentingTab, "ItemCommentingTab");
