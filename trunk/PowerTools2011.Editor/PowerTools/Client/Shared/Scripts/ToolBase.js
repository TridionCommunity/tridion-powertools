Type.registerNamespace("PowerTools2011");

PowerTools2011.ToolBase = function (id)
{
	Tridion.OO.enableInterface(this, "PowerTools2011.ToolBase");

	if (!id || id.length < 1) $assert.raiseError("Unable to create tool without an ID");

	this.toolId = id;

	$ptRegistry.registerTool(this);
}

PowerTools2011.ToolBase.prototype.getToolId = function ()
{
	return this.toolId;
};