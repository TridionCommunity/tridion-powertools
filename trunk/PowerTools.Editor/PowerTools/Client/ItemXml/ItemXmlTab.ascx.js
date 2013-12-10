Type.registerNamespace("ItemXmlTab");

ItemXmlTab.ItemXmlTab = function ItemXmlTab$constructor(element)
{
    if ($ptUtils.isCurrentUserAdmin()) 
    {
        Tridion.OO.enableInterface(this, "ItemXmlTab.ItemXmlTab");
        this.addInterface("Tridion.Controls.DeckPage", [element]);
    }
    else
    {
        $css.undisplay($("#ItemXmlTab_switch"));
    }
};

ItemXmlTab.ItemXmlTab.prototype.initialize = function ItemXmlTab$initialize()
{
    this.callBase("Tridion.Controls.DeckPage", "initialize");
    $evt.addEventHandler($display.getItem(), "load", this.getDelegate(this.updateView));
};

ItemXmlTab.ItemXmlTab.prototype.select = function ItemXmlTab$select()
{
    this.callBase("Tridion.Controls.DeckPage", "select");
    this.updateView();
};

ItemXmlTab.ItemXmlTab.prototype.updateView = function ItemXmlTab$updateView()
{
    if (this.isSelected()) 
    {
        var xslPath = $ptUtils.expandPath("/PowerTools/Client/ItemXml/ItemXmlTab.xslt", true);

        $xml.loadXsltProcessor(xslPath, function (value) 
        {
            var xmlSource = $display.getItem().getXml();

            // Filter out all spacing characters
            xmlSource = xmlSource.replace(/\t|\n|\r/g, "");

            var html = $xml.xsltTransform(value, $xml.getNewXmlDocument(xmlSource), null);

            $dom.setOuterHTML($("#itemXml"), html);
        });        
    }
};

Tridion.Controls.Deck.registerPageType(ItemXmlTab.ItemXmlTab, "ItemXmlTab");