Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.Example = function Example$constructor() 
{
    Type.enableInterface(this, "PowerTools.Popups.Example");
    this.addInterface("Tridion.Cme.View");
	this.addInterface("PowerToolsBase", [this]);
    
    var p = this.properties;
    p.processId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
};

PowerTools.Popups.Example.prototype.initialize = function Example$initialize() 
{
    this.callBase("Tridion.Cme.View", "initialize");

    var p = this.properties;
    var c = p.controls;

    c.TabControl = $controls.getControl($("#ContactTabs"), "Tridion.Controls.TabControl");
    c.UserButton = $controls.getControl($("#UserButton"), "Tridion.Controls.Button");
    c.ExampleExecuteButton = $controls.getControl($("#ExampleExecuteButton"), "Tridion.Controls.Button");
    c.SelectButton = $controls.getControl($("#SelectItem"), "Tridion.Controls.Button");
    c.CloseButton = $controls.getControl($("#CloseDialog"), "Tridion.Controls.Button");
    c.PublicationsDropDown = $controls.getControl($("#Publications"), "Tridion.Controls.Dropdown");

    $evt.addEventHandler(c.UserButton, "click", this.getDelegate(this._onGetUserInfoClicked));
    $evt.addEventHandler(c.ExampleExecuteButton, "click", this.getDelegate(this._validateInput));
    $evt.addEventHandler(c.SelectButton, "click", this.getDelegate(this._onSelectButtonClicked));
    $evt.addEventHandler(c.PublicationsDropDown, "loadcontent", this.getDelegate(this._onPublicationsDropdownLoad));
    $evt.addEventHandler(c.PublicationsDropDown, "change", this.getDelegate(this._onPublicationsDropdownChange));
};

PowerTools.Popups.Example.prototype._onGetUserInfoClicked = function Example$_onGetUserInfoClicked() 
{
    var onSuccess = this.getDelegate(this._handleUserInfo);
    PowerTools.Model.Services.Example.GetUserInfo(onSuccess, this.getErrorHandler());
};


PowerTools.Popups.Example.prototype._handleUserInfo = function Example$_handleUserInfo(response) 
{
    alert("Your username is: " + response.UserName);
};

PowerTools.Popups.Example.prototype._onPublicationsDropdownChange = function Example$_onPublicationsDropdownChange() 
{
    var p = this.properties;
	$dom.setInnerText($("#selectedPublication"), " You selected: {0}".format(p.controls.PublicationsDropDown.getValue()));
};

PowerTools.Popups.Example.prototype._onPublicationsDropdownLoad = function Example$_onPublicationsDropdownLoad() 
{
    var publicationsList = this.getPublications();
    if (publicationsList) 
	{
        var dropdown = this.properties.controls.PublicationsDropDown;

        function Component$onPublicationsDropdownLoad$listLoaded() 
		{
            $evt.removeEventHandler(publicationsList, "load", Component$onPublicationsDropdownLoad$listLoaded);
            dropdown.setContent(publicationsList.getXml());
        }

        if (publicationsList.isLoaded(true)) 
		{
            Component$onPublicationsDropdownLoad$listLoaded();
        }
        else 
		{
            $evt.addEventHandler(publicationsList, "load", Component$onPublicationsDropdownLoad$listLoaded);
            publicationsList.load();
        }
    }
};

// Returns a list with publications
PowerTools.Popups.Example.prototype.getPublications = function Example$getPublications() 
{
    return $models.getItem($const.TCMROOT).getListPublications();
};


// Callback for itemselector. After the item is selected, this method is called.
PowerTools.Popups.Example.prototype._onSelected = function Example$_onSelected(event) 
{
    var selectedItems = event.data.items;
    alert("You selected item: {0}".format(selectedItems[0]));
};

PowerTools.Popups.Example.prototype._onSelectButtonClicked = function Example$_onSelectButtonClicked() 
{
    //Define filter
    var filterDefinition = new Tridion.ContentManager.ListFilter();
    filterDefinition.conditions.ItemTypes = [$const.ItemType.COMPONENT, $const.ItemType.COMPONENT_TEMPLATE];

    //Open popup
    $ptUtils.getItemSelector(null, null, filterDefinition, true, false, this._onSelected);
};

PowerTools.Popups.Example.prototype._onExecuteButtonClicked = function Example$_oExecuteButtonClicked()
{
    var onSuccess = this.getDelegate(this._onExecuteStarted);
    PowerTools.Model.Services.Example.Execute(onSuccess, this.getErrorHandler());
};

PowerTools.Popups.Example.prototype.afterSuccess = function Example$afterSuccess(processId) 
{
	if (processId)
	{
		// Do something
	}
};

$display.registerView(PowerTools.Popups.Example);
