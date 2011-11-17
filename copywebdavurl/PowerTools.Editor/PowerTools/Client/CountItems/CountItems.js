Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.CountItems = function () {
   
    Type.enableInterface(this, "PowerTools.Popups.CountItems");
    this.addInterface("Tridion.Cme.View");
    this.addInterface("PowerToolsBase", [this]);
    
    var p = this.properties;

    p.processId = null;
    p.folderId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process  
    
    //Optional: set properties for the progressbar/modal dialog
    p.progressDialog = { showAnimation: false, closeAfterComplete: true };

};

// Read parameters and assign callbacks for buttons in the GUI
PowerTools.Popups.CountItems.prototype.initialize = function () {
    $log.message("Initializing CountItems popup...");
    this.enableDefaultCheckboxes();
    this.callBase("Tridion.Cme.View", "initialize");


    var p = this.properties;
    var c = p.controls;

    p.orgItemId = $url.getHashParam("orgItemId");   
};

// Set the enabled status of the Checkboxes depending on the type of the given parent OrgItem
PowerTools.Popups.CountItems.prototype.enableDefaultCheckboxes = function ()
{
    $log.message("Setting checkboxes default enabled status");

    var orgItemId = $url.getHashParam("orgItemId");
    switch ($models.getItemType(orgItemId))
    {
        case $const.ItemType.PUBLICATION:
            $j('#FolderChk').attr('checked', true);
            $j('#ComponentChk').attr('checked', true);
            $j('#StructureGroupChk').attr('checked', true);
            $j('#PageChk').attr('checked', true);
            break;

        case $const.ItemType.FOLDER:
            $j('#FolderChk').attr('checked', true);
            $j('#ComponentChk').attr('checked', true);
            $j('#StructureGroupChk').attr('disabled', true);
            $j('#PageChk').attr('disabled', true);
            $j('#CategoryChk').attr('disabled', true);
            $j('#KeywordChk').attr('disabled', true);
            break;

        case $const.ItemType.STRUCTURE_GROUP:
            $j('#FolderChk').attr('disabled', true);
            $j('#ComponentChk').attr('disabled', true);
            $j('#SchemaChk').attr('disabled', true);
            $j('#ComponentTemplateChk').attr('disabled', true);
            $j('#PageTemplateChk').attr('disabled', true);
            $j('#TemplateBuildingBlockChk').attr('disabled', true);
            $j('#StructureGroupChk').attr('checked', true);
            $j('#PageChk').attr('checked', true);
            $j('#CategoryChk').attr('disabled', true);
            $j('#KeywordChk').attr('disabled', true);
            break;

        case $const.ItemType.CATMAN:
        case $const.ItemType.CATEGORY:
            $j('#FolderChk').attr('disabled', true);
            $j('#ComponentChk').attr('disabled', true);
            $j('#SchemaChk').attr('disabled', true);
            $j('#ComponentTemplateChk').attr('disabled', true);
            $j('#PageTemplateChk').attr('disabled', true);
            $j('#TemplateBuildingBlockChk').attr('disabled', true);
            $j('#StructureGroupChk').attr('disabled', true);
            $j('#PageChk').attr('disabled', true);
            $j('#CategoryChk').attr('checked', true);
            $j('#KeywordChk').attr('checked', true);
            break;
    }
}

// Reads the checkboxes values and initiates a service call to get the item counts
PowerTools.Popups.CountItems.prototype._onExecuteButtonClicked = function ()
{

    var p = this.properties;
    p.countFolders = $j('#FolderChk').attr('checked');
    p.countComponents = $j('#ComponentChk').attr('checked');
    p.countSchemas = $j('#SchemaChk').attr('checked');
    p.countComponentTemplates = $j('#ComponentTemplateChk').attr('checked');
    p.countPageTemplates = $j('#PageTemplateChk').attr('checked');
    p.countTemplateBuildingBlocks = $j('#TemplateBuildingBlockChk').attr('checked');
    p.countStructureGroups = $j('#StructureGroupChk').attr('checked');
    p.countPages = $j('#PageChk').attr('checked');
    p.countCategories = $j('#CategoryChk').attr('checked');
    p.countKeywords = $j('#KeywordChk').attr('checked');

    var onSuccess = Function.getDelegate(this, this._onExecuteStarted);   
    var onFailure = null;
    var context = null;
    PowerTools.Model.Services.CountItems.Execute(p.orgItemId, p.countFolders, p.countComponents, p.countSchemas,
            p.countComponentTemplates, p.countPageTemplates, p.countTemplateBuildingBlocks, p.countStructureGroups,
            p.countPages, p.countCategories, p.countKeywords, onSuccess, onFailure, context, false);
};

// We have a response with data. Fill in the values and visibility for each item type counts.
PowerTools.Popups.CountItems.prototype._handleCountItems = function (response)
{
    var p = this.properties;

    if (p.countFolders)
        $j('#FolderChk ~ span').html(response.Folders);
    else
        $j('#FolderChk ~ span').html('');

    if (p.countComponents)
        $j('#ComponentChk ~ span').html(response.Components);
    else
        $j('#ComponentChk ~ span').html('');

    if (p.countSchemas)
        $j('#SchemaChk ~ span').html(response.Schemas);
    else
        $j('#SchemaChk ~ span').html('');

    if (p.countComponentTemplates)
        $j('#ComponentTemplateChk ~ span').html(response.ComponentTemplates);
    else
        $j('#ComponentTemplateChk ~ span').html('');

    if (p.countPageTemplates)
        $j('#PageTemplateChk ~ span').html(response.PageTemplates);
    else
        $j('#PageTemplateChk ~ span').html('');

    if (p.countTemplateBuildingBlocks)
        $j('#TemplateBuildingBlockChk ~ span').html(response.TemplateBuildingBlocks);
    else
        $j('#TemplateBuildingBlockChk ~ span').html('');

    if (p.countStructureGroups)
        $j('#StructureGroupChk ~ span').html(response.StructureGroups);
    else
        $j('#StructureGroupChk ~ span').html('');

    if (p.countPages)
        $j('#PageChk ~ span').html(response.Pages);
    else
        $j('#PageChk ~ span').html('');

    if (p.countCategories)
        $j('#CategoryChk ~ span').html(response.Categories);
    else
        $j('#CategoryChk ~ span').html('');

    if (p.countKeywords)
        $j('#KeywordChk ~ span').html(response.Keywords);
    else
        $j('#KeywordChk ~ span').html('');
};

PowerTools.Popups.CountItems.prototype.afterSuccess = function (processId) {
    if (processId != "") {
        $log.debug("Retrieving CountItemsData for process #" + processId);
        var onSuccess = Function.getDelegate(this, this._handleCountItems);
        var onFailure = null;
        var context = null;
        PowerTools.Model.Services.CountItems.GetCountItemsData(onSuccess, onFailure, context, false);
    }
}


$display.registerView(PowerTools.Popups.CountItems);
