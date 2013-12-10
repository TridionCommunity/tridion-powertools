Type.registerNamespace("PowerTools.Tabs");

// Constructs a new tab for Change History. Adds itself to the current tabs deck
PowerTools.Tabs.ItemCommentingTab = function ItemCommentingTab$constructor(element) 
{
    Tridion.OO.enableInterface(this, PowerTools.Tabs.ItemCommentingTab);
    this.addInterface("Tridion.Controls.DeckPage", [element]);
};

// Initialization called by Anguilla. Defers execution to base.initialize()
PowerTools.Tabs.ItemCommentingTab.prototype.initialize = function ItemCommentingTab$initialize() 
{
    this.callBase("Tridion.Controls.DeckPage", "initialize");
};

// Upon selection of the tab, calls the updateView()
PowerTools.Tabs.ItemCommentingTab.prototype.select = function ItemCommentingTab$select()
{
    this.callBase("Tridion.Controls.DeckPage", "select");
    this.updateView();
};

PowerTools.Tabs.ItemCommentingTab.prototype.updateView = function ItemCommentingTab$updateView()
{
    var onSuccess = this.getDelegate(this.showChangeHistory);
    var onFailure = this.getDelegate(this.onError);
    PowerTools.Model.Services.AppDataServices.Read("ext:ItemCommenting", $url.getHashParam("id"), onSuccess, onFailure);
};

PowerTools.Tabs.ItemCommentingTab.prototype.showChangeHistory = function ItemCommentingTab$showChangeHistory(result)
{
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

PowerTools.Tabs.ItemCommentingTab.prototype.onError = function ItemCommentingTab$onError(error)
{
	$messages.registerError(error);
};

// Register itself with the Tridion.Controls.Deck namespace
Tridion.Controls.Deck.registerPageType(PowerTools.Tabs.ItemCommentingTab, "ItemCommentingTab");
