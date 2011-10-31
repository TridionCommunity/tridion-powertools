Type.registerNamespace("BootCamp2011Editor");

BootCamp2011Editor.ItemXmlTab = function BootCamp2011Editor$ItemXmlTab(element)
{
    Tridion.OO.enableInterface(this, "BootCamp2011Editor.ItemXmlTab");
    this.addInterface("Tridion.Controls.DeckPage", [element]);
};

BootCamp2011Editor.ItemXmlTab.prototype.initialize = function ItemXmlTab$initialize()
{
    this.callBase("Tridion.Controls.DeckPage", "initialize");
    $evt.addEventHandler($display.getItem(), "load", this.getDelegate(this.updateView));
};

BootCamp2011Editor.ItemXmlTab.prototype.select = function ItemXmlTab$select()
{
    this.callBase("Tridion.Controls.DeckPage", "select");
    this.updateView();
};

BootCamp2011Editor.ItemXmlTab.prototype.updateView = function ItemXmlTab$updateView()
{
    if (this.isSelected())
    {
        $dom.setInnerText($("#itemXml"), $display.getItem().getXml());
    }
};

Tridion.Controls.Deck.registerPageType(BootCamp2011Editor.ItemXmlTab, "ItemXmlTab");