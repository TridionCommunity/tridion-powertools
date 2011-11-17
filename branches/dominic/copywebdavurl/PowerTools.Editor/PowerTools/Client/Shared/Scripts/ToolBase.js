Type.registerNamespace("PowerTools");

PowerTools.ToolBase = function (id)
{
    Tridion.OO.enableInterface(this, "PowerTools.ToolBase");

    if (!id || id.length < 1) $assert.raiseError("Unable to create tool without an ID");

    this.toolId = id;

    $ptRegistry.registerTool(this);
}

PowerTools.ToolBase.prototype.getToolId = function ()
{
    return this.toolId;
};