Type.registerNamespace("PowerTools");

PowerTools.BaseCommand = function(id)
{
    Tridion.OO.enableInterface(this, "PowerTools.BaseCommand");
	this.addInterface("Tridion.Cme.Command", [id]);

	var p = this.properties;
	p.id = id;
	p.initialized = false;
	p.isConfigured;
}

PowerTools.BaseCommand.prototype.initialize = function()
{
	var p = this.properties;
	
	if (!this.isToolConfigured())
	{
		this.hideToolbarButton();
	}

	p.initialized = true;
};

// If the Power Tool isn't in the configuration, hide the associated toolbar button
// This probably shouldn't be necessary but the CME isn't hiding the buttons automatically based on the .isAvailable method.
PowerTools.BaseCommand.prototype.hideToolbarButton = function()
{
	var p = this.properties;
	
	var toolbar = $display.getView().properties.controls.toolbar;
	if (!toolbar) return;

	var tabPage = toolbar.getPage("Power Tools");
	if (!tabPage) return;

	var groups = tabPage.getGroups();
	for (var i = 0; i < groups.length; i++)
	{
		var group = groups[i];
		for (var n = 0; n < group.items.length; n++)
		{
			var item = group.items[n];
			if (item.getId() == p.id)
			{
				item.hide();
				return;
			}
		}
	}

	$log.warn("No toolbar button found for Power Tool '{0}'. Cannot hide it.".format(p.id));
};

PowerTools.BaseCommand.prototype.isAvailable = function(selection, pipeline)
{
	return this.isEnabled(selection, pipeline);
};

PowerTools.BaseCommand.prototype.isToolConfigured = function() 
{
	var p = this.properties;

	if (p.isConfigured == undefined)
	{
		var editor = $config.Editors["PowerTools"];
		if (!editor) return true;

		var namespaces = { "pt" : "http://code.google.com/p/tridion-2011-power-tools/", "m" : "http://www.sdltridion.com/2009/GUI/Configuration/Merge" };
		var configXml = $xml.getNewXmlDocument(editor.configuration);
		if (!configXml) return true;

		var xpath = "/m:clientconfiguration/pt:availableTools/pt:tool[@id='{0}']".format(p.id);
		var toolNode = $xml.selectSingleNode(configXml, xpath, namespaces);
		p.isConfigured = (toolNode != null);
	}
	
	return p.isConfigured;
};

PowerTools.BaseCommand.prototype.isEnabled = function(selection, pipeline)
{
	var p = this.properties;

	if (!p.initialized)
	{
		this.initialize();
	}

	if (!this.isToolConfigured())
	{
		return false;
	}

	if (this.isValidSelection)
	{
		return this.isValidSelection(selection, pipeline);
	}

    return true;
};