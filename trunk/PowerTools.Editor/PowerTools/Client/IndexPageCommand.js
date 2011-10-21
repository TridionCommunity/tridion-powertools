Type.registerNamespace("PowerTools2011.Commands");

///
//
//	** this command must be registered last, after all other power tools so it can register to the Extensions Manager
//
///

PowerTools2011.Commands.Index = function ()
{
	Type.enableInterface(this, "PowerTools2011.Commands.Index");
	this.addInterface("Tridion.Cme.Command", ["Index"]);

		
	$ptRegistry.initializeExtentionsManager();	 //use the extensions manager
};

PowerTools2011.Commands.Index.prototype.isAvailable = function (selection)
{
	return true;
};

PowerTools2011.Commands.Index.prototype.isEnabled = function (selection)
{
	return true;
};

PowerTools2011.Commands.Index.prototype._execute = function (selection)
{
	//open a popup with the index page showing information about the different tools registered to the system

//	var uriSelection = selection.getItem(0);
//	var PopUpUrl = $ptUtils.expandPath("/powertools/client/example/example.aspx") + "?id=" + uriSelection;
//	var popup = $popup.create(PopUpUrl, "toolbar=no,width=600,height=300,resizable=false,scrollbars=false", null);
//	popup.open();
};
