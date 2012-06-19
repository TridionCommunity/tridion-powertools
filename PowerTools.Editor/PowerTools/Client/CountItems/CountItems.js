Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.CountItems = function()
{
    Type.enableInterface(this, "PowerTools.Popups.CountItems");
    this.addInterface("Tridion.Cme.View");
    this.addInterface("PowerToolsBase", [this]);
    
    var p = this.properties;
	var c = p.controls;

    p.processId = null;
    p.folderId = null;
    p.pollInterval = 500; // Milliseconds between each call to check the status of a process  
    
    //Optional: set properties for the progressbar/modal dialog
    p.progressDialog = { showAnimation: false, closeAfterComplete: true };
};

// Read parameters and assign callbacks for buttons in the GUI
PowerTools.Popups.CountItems.prototype.initialize = function() 
{
    var p = this.properties;
    var c = p.controls;

    $log.message("Initializing CountItems popup...");
    this.callBase("Tridion.Cme.View", "initialize");

    p.orgItemId = $url.getHashParam("orgItemId");   
	c.countFolders = $('#FolderChk');
	c.countComponents = $("#ComponentChk");
	c.countSchemas = $("#SchemaChk");
	c.countComponentTemplates = $("#ComponentTemplateChk");
	c.countPageTemplates = $("#PageTemplateChk");
	c.countTbbs = $("#TemplateBuildingBlockChk");
	c.countStructureGroups = $("#StructureGroupChk");
	c.countPages = $("#PageChk");
	c.countCategories = $("#CategoryChk");
	c.countKeywords = $("#KeywordChk");

    this.enableDefaultCheckboxes();
};

// Set the enabled status of the Checkboxes depending on the type of the given parent OrgItem
PowerTools.Popups.CountItems.prototype.enableDefaultCheckboxes = function()
{
    $log.message("Setting checkboxes default enabled status");

	var p = this.properties;
	var c = p.controls;

    var orgItemId = $url.getHashParam("orgItemId");
    switch ($models.getItemType(orgItemId))
    {
        case $const.ItemType.PUBLICATION:
            c.countFolders.checked = true;
            c.countComponents.checked = true;
            c.countStructureGroups.checked = true;
            c.countPages.checked = true;
            break;

        case $const.ItemType.FOLDER:
            c.countFolders.checked = true;
            c.countComponents.checked = true;
            c.countStructureGroups.disabled = true;
            c.countPages.disabled = true;
            c.countCategories.disabled = true;
            c.countKeywords.disabled = true;
            break;

        case $const.ItemType.STRUCTURE_GROUP:
            c.countFolders.disabled = true;
            c.countComponents.disabled = true;
            c.countSchemas.disabled = true;
            c.countComponentTemplates.disabled = true;
            c.countPageTemplates.disabled = true;
            c.countTbbs.disabled = true;
            c.countStructureGroups.checked = true;
            c.countPages.checked = true;
            c.countCategories.disabled = true;
            c.countKeywords.disabled = true;
            break;

        case $const.ItemType.CATMAN:
        case $const.ItemType.CATEGORY:
            c.countFolders.disabled = true;
            c.countComponents.disabled = true;
            c.countSchemas.disabled = true;
            c.countComponentTemplates.disabled = true;
            c.countPageTemplates.disabled = true;
            c.countTbbs.disabled = true;
            c.countStructureGroups.disabled = true;
            c.countPages.disabled = true;
            c.countCategories.checked = true;
            c.countKeywords.checked = true;
            break;
    }
}

// Reads the checkboxes values and initiates a service call to get the item counts
PowerTools.Popups.CountItems.prototype._onExecuteButtonClicked = function()
{
    var p = this.properties;
	var c = p.controls;

    p.countFolders = c.countFolders.checked;
    p.countComponents = c.countComponents.checked;
    p.countSchemas = c.countSchemas.checked;
    p.countComponentTemplates = c.countComponentTemplates.checked;
    p.countPageTemplates = c.countPageTemplates.checked;
    p.countTemplateBuildingBlocks = c.countTbbs.checked;
    p.countStructureGroups = c.countStructureGroups.checked;
    p.countPages = c.countPages.checked;
    p.countCategories = c.countCategories.checked;
    p.countKeywords = c.countKeywords.checked;

    var onSuccess = Function.getDelegate(this, this._onExecuteStarted);   
    var onFailure = null;
    var context = null;

    PowerTools.Model.Services.CountItems.Execute(p.orgItemId, p.countFolders, p.countComponents, p.countSchemas,
            p.countComponentTemplates, p.countPageTemplates, p.countTemplateBuildingBlocks, p.countStructureGroups,
            p.countPages, p.countCategories, p.countKeywords, onSuccess, onFailure, context, false);
};

// We have a response with data. Fill in the values and visibility for each item type counts.
PowerTools.Popups.CountItems.prototype._handleCountItems = function(response)
{
    var p = this.properties;
	$dom.setInnerText($("#FolderChk ~ span"), p.countFolders ? response.Folders : "")
	$dom.setInnerText($("#ComponentChk ~ span"), p.countComponents ? response.Components : "")
	$dom.setInnerText($("#SchemaChk ~ span"), p.countSchemas ? response.Schemas : "")
	$dom.setInnerText($("#ComponentTemplateChk ~ span"), p.countComponentTemplates ? response.ComponentTemplates : "")
	$dom.setInnerText($("#PageTemplateChk ~ span"), p.countPageTemplates ? response.PageTemplates : "")
	$dom.setInnerText($("#TemplateBuildingBlockChk ~ span"), p.countTemplateBuildingBlocks ? response.TemplateBuildingBlocks : "")
	$dom.setInnerText($("#StructureGroupChk ~ span"), p.countStructureGroups ? response.StructureGroups : "")
	$dom.setInnerText($("#PageChk ~ span"), p.countPages ? response.Pages : "")
	$dom.setInnerText($("#CategoryChk ~ span"), p.countCategories ? response.Categories : "")
	$dom.setInnerText($("#KeywordChk ~ span"), p.countKeywords ? response.Keywords : "")
};

PowerTools.Popups.CountItems.prototype.afterSuccess = function(processId) 
{
    if (processId != "") 
	{
        $log.debug("Retrieving CountItemsData for process #" + processId);
        var onSuccess = Function.getDelegate(this, this._handleCountItems);
        var onFailure = null;
        var context = null;
        PowerTools.Model.Services.CountItems.GetCountItemsData(onSuccess, onFailure, context, false);
    }
}


$display.registerView(PowerTools.Popups.CountItems);
