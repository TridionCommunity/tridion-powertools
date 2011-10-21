Type.registerNamespace("PowerTools2011");

PowerTools2011.Registry = function ()
{
	Tridion.OO.enableInterface(this, "PowerTools2011.Registry");

	this._tools = new Array();
	this._toolIds = new Array();
	this._configClient = null;
};

PowerTools2011.Registry.prototype.registerTool = function(tool)
{
	var tooldId = tool.getToolId();

	if (this._toolIds.indexOf(tooldId) == -1)
	{
		$log.message("[PowerTools2011.Registry]: adding new tool: '{0}' to power tools registry".format(tooldId));

		this._tools.push(tool);
		this._toolIds.push(tooldId);
	}
	else
	{
		$assert.raiseError("[PowerTools2011.Registry]: cannot add tool: '{0}' to registry, a tool with this id already added".format(tooldId));
	}
};

PowerTools2011.Registry.prototype.initializeExtentionsManager = function ()
{
	var extManager = (typeof ($extConfManager) != "undefined" ? $extConfManager : null);

	if (extManager)
	{
		$log.message("[PowerTools2011.Registry]: The Extensions Manager is available.");

		var configClient = null;
		var context = this;

		this._configClient = configClient = new $$ec.Client("PowerTools2011");

		configClient.init(function (definition, loaded)
		{
			if (!loaded)
			{
				$log.message("[PowerTools2011.Registry]: Extensions Manager definition was not loaded from server");

				configClient.setDescription("The Tridion 2011 Power Tools");
				configClient.setTitle("Power Tools 2011");
			}

			var adminOnlyOptions = new Array();

			for (var i = 0; i < context._toolIds.length; i++)
			{
				adminOnlyOptions.push({ "key": context._toolIds[i], "value": context._toolIds[i] });
			};

			configClient.updateField("Admin Only Tools", { "Type": $extConfConsts.Types.OPTION, "AdminOnly": true, "MultipleValue": true, "HelpText": "Tools only shown to administrators" }, adminOnlyOptions);

			configClient.create();
		});
	}
	else
	{
		$log.message("[PowerTools2011.Registry]: The Extensions Manager is not available!");
	}
};

var $ptRegistry = new PowerTools2011.Registry();