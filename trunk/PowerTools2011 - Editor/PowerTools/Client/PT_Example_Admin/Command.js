Type.registerNamespace("PowerTools2011.Commands");

PowerTools2011.Commands.AdminExample = function ()
{
	Type.enableInterface(this, "PowerTools2011.Commands.AdminExample");
	this.addInterface("Tridion.Cme.Command", ["ExampleAdminTool"]);
	this.addInterface("PowerTools2011.ToolBase", ["ExampleAdminTool"]);
};

PowerTools2011.Commands.AdminExample.prototype.isAvailable = function (selection) {
    //Only show the button if a single Schema is selected
    if (selection.getCount() == 1) {
        debugger
        var itemType = $models.getItemType(selection.getItem(0));
        var item = $models.getItem(selection.getItem(0))
        console.log('hello');
        if (itemType == $const.ItemType.SCHEMA) {
            return true;
        }
    }
    return false;
};

PowerTools2011.Commands.AdminExample.prototype.isEnabled = function (selection) {
    //Only enable the button if the user is a memmber of the group called "PowerTools - Administrator"
    return PowerTools2011.Utilities.prototype.isCurrentUserInGroup("PowerTools - Administrator");
};

PowerTools2011.Commands.AdminExample.prototype._execute = function (selection) {

    var uriSelection = selection.getItem(0);
    var baseElement = $("#contentsplitter_container");
    //chris
    var iFrame = $("#CustomPagesFrame");
    var self = this;

    $css.undisplay(baseElement);
    $css.display(iFrame);


    iFrame.src = $ptUtils.expandPath("/powertools/client/PT_Example_Admin/Page.aspx") + "?id=" + uriSelection ;




    //Open a popup with an attribute with the selected item ID
//    var uriSelection = selection.getItem(0);
//    var PopUpUrl = $ptUtils.expandPath("/powertools/client/PT_Example_Admin/Page.aspx") + "?id=" + uriSelection;
//    var popup = $popup.create(PopUpUrl, "toolbar=no,width=600,height=400,resizable=false,scrollbars=false", null);
//    popup.open();
};

