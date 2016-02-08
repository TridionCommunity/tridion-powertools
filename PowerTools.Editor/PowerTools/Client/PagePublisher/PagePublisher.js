Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.PagePublisher = function PagePublisher$constructor() 
{
    Type.enableInterface(this, "PowerTools.Popups.PagePublisher");
    this.addInterface("Tridion.Cme.View");
    this.addInterface("PowerToolsBase", [this]);

    var p = this.properties;

    p.processId = null;
    p.locationId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
    p.targetTypesListId; // Target types domain list
    p.progressDialogSettings.closeAfterComplete = true;
};

PowerTools.Popups.PagePublisher.TARGETTYPE_HEAD_PATH = $config.expandEditorPath("/Xml/ListDefinitions/TargetTypeList-head.xml", $const.CMEEditorName);

PowerTools.Popups.PagePublisher.prototype.initialize = function PagePublisher$initialize()
{
    this.callBase("Tridion.Cme.View", "initialize");

    var p = this.properties;
    var c = p.controls;
    p.today = this._getToday(); // Today - used to populate the date picker text boxes with today's date and time
    p.locationId = $url.getHashParam("locationId");
    $log.message("Initializing page publisher for item: " + p.locationId);


    // the tab control
    c.TabControl = $controls.getControl($("#OptionsTabControl"), "Tridion.Controls.TabControl");

    /* PUBLISH TAB */
    // publish now or later buttons
    c.PublishLaterDate = $controls.getControl($("#PublishLaterDate"), "Tridion.Controls.Date", { popupUrl: $cme.Popups.DATE_PICKER.URL, popupFeatures: $cme.Popups.DATE_PICKER.FEATURES });
    c.publishNow = $("#publishNow");
    c.publishLater = $("#publishLater");
    c.schedulePublish = $("#schedulePublish");
    c.setPublishLater = $("#setPublishLater");
    c.setSchedulePublish = $("#setSchedulePublish");
    c.generateContentNow = $("#generateContentNow");
    c.generateContentLater = $("#generateContentLater");
    c.setGenerateContentLater = $("#setGenerateContentLater");
    c.GenerateContentDate = $controls.getControl($("#GenerateContentDate"), "Tridion.Controls.Date", { popupUrl: $cme.Popups.DATE_PICKER.URL, popupFeatures: $cme.Popups.DATE_PICKER.FEATURES });
    c.placeContentNow = $("#placeContentNow");
    c.placeContentLater = $("#placeContentLater");
    c.setPlaceContentLater = $("#setPlaceContentLater");
    c.PlaceContentDate = $controls.getControl($("#PlaceContentDate"), "Tridion.Controls.Date", { popupUrl: $cme.Popups.DATE_PICKER.URL, popupFeatures: $cme.Popups.DATE_PICKER.FEATURES });
    $evt.addEventHandler(c.publishNow, "click", this.getDelegate(this._onPublishRadioChanged));
    $evt.addEventHandler(c.publishLater, "click", this.getDelegate(this._onPublishRadioChanged));
    $evt.addEventHandler(c.schedulePublish, "click", this.getDelegate(this._onPublishRadioChanged));
    $evt.addEventHandler(c.generateContentNow, "click", this.getDelegate(this._onGenerateContentRadioChanged));
    $evt.addEventHandler(c.generateContentLater, "click", this.getDelegate(this._onGenerateContentRadioChanged));
    $evt.addEventHandler(c.placeContentNow, "click", this.getDelegate(this._onPlaceContentRadioChanged));
    $evt.addEventHandler(c.placeContentLater, "click", this.getDelegate(this._onPlaceContentRadioChanged));

    // Publish target select list
    c.TargetTypeList = $controls.getControl($("#TargetTypeList"), "Tridion.Controls.List");
    $evt.addEventHandler(c.TargetTypeList, "select", this.getDelegate(this._onTargetTypeListSelectionChanged));
    $evt.addEventHandler(c.TargetTypeList, "deselect", this.getDelegate(this._onTargetTypeListSelectionChanged));

    // Auto resizing of stack divs
    $controls.getControl($("#StackElement2"), "Tridion.Controls.Stack");

    // Exe and close
    c.BtnCancel = $controls.getControl($("#BtnCancel"), "Tridion.Controls.Button");
    c.ExecuteButton = $controls.getControl($("#ExecuteButton"), "Tridion.Controls.Button");
    $evt.addEventHandler(c.BtnCancel, "click", this.getDelegate(this._onBtnCancelClicked));

    // Init controls
    this._setupControls();

    // Start loading data
    this._asyncLoadTargetTypeListHeader();
};


/**
* When the publish button is clicked the form values are checked and sent to publishpage service
*/

PowerTools.Popups.PagePublisher.prototype._onExecuteButtonClicked = function PagePublisher$_onExecuteButtonClicked() 
{
    var p = this.properties;
    var c = p.controls;
    p.SelectedTarget = this._getSelectedTargetTypes();

    if ($models.getItemType(p.locationId) == $const.ItemType.PUBLICATION) 
	{
        p.Recursive = true; // if it's a publication, automatically recurse publish
    }
    else 
	{
        p.Recursive = $("#RecursiveChk").checked; // if not check if the checkbox is ticked
    }
    p.Republish = $("#RepublishChk").checked;
    p.PublishChildren = $("#PublishChildrenChk").checked;
    p.IncludeComponentLinks = $("#includeComponentLinksChk").checked;
    p.PublishStructureGroupInfo = $("#resolveStructureGroupInfoChk").checked;
    p.IncludeWorkflow = $("#includeWorkFlowChk").checked;
    p.Priority = parseInt($j("#Priority").val());
    p.schedulePublish = $("#PublishLaterDate_datetime").value;
    
	var onSuccess = this.getDelegate(this._onExecuteStarted);

    // pass in structure uri, publishing target uri
    PowerTools.Model.Services.PagePublisher.Execute(p.locationId, p.SelectedTarget, p.Recursive, p.Republish, p.Priority,
        p.PublishChildren, p.IncludeComponentLinks, p.PublishStructureGroupInfo,
        p.IncludeWorkflow, p.schedulePublish, onSuccess, this.getErrorHandler());
};

PowerTools.Popups.PagePublisher.prototype.afterSuccess = function PagePublisher$afterSuccess(processId) 
{
    if (processId) 
	{
        var onSuccess = this.getDelegate(this._handlePublishingStatus);
        PowerTools.Model.Services.PagePublisher.GetPublisherData(onSuccess, this.getErrorHandler());
    }
};

/**
* When the publishing is completed update the message center 
*/

PowerTools.Popups.PagePublisher.prototype._handlePublishingStatus = function PagePublisher$_handlePublishingStatus(response)
{
	if (response.FailedMessage)
	{
		$messages.registerError(response.FailedMessage, null, null, false, false);
	}

	$messages.registerNotification(response.SuccessMessage, null, null, false, false);
	window.close();
};



/**
* Sets the publish button to disabled and loads the drop down header xml
*/

PowerTools.Popups.PagePublisher.prototype._setupControls = function PagePublisher$_setupControls()
{
	var p = this.properties;
	var c = p.controls;

	// Disable the execute button
	c.ExecuteButton.disable();

	var publishLabel = $localization.getEditorResource("Publish");
	document.title = publishLabel;
	c.ExecuteButton.setText(publishLabel);

	// set the PublishTab to visible
	var page = c.TabControl.getPage("PublishTab");
	if (page)
	{
		c.TabControl.showItem(page);
		c.TabControl.selectItem(page);
	}
};


/* ============================================
*  Publishing target checkbox related functions
============================================ */

/**
* Handles the list selection change event.
* @param {Tridion.Core.Event} event. The event is the event fired from the list.
* @private
*/
PowerTools.Popups.PagePublisher.prototype._onTargetTypeListSelectionChanged = function PagePublisher$_onTargetTypeListSelectionChanged(e) 
{
    var p = this.properties;
    var c = p.controls;
    var enable = false;

    // Update selected tt array	
    var checkBoxes = p.checkBoxView.getSelection();
    for (var checkboxKey in checkBoxes) 
	{
        var tcmId = checkBoxes[checkboxKey];
        if (tcmId) 
		{
            enable = true;
            break;
        }
    }

    if (enable) 
	{
        c.ExecuteButton.enable();
    }
    else 
	{
        c.ExecuteButton.disable();
    }
};


/**
* Handles the definitions XML document load event.
* @param {XMLDocument} headXml Definitions XML document.
*/
PowerTools.Popups.PagePublisher.prototype._ttListHeadLoaded = function PagePublisher$_ttListHeadLoaded(headXml) 
{
    // Save target type list header
    this.properties.ttListHeadXml = headXml;
    // Load target type list
    this._asyncLoadTargetTypeList();
};


/**
* Asynchronously load Target types list header.
*/
PowerTools.Popups.PagePublisher.prototype._asyncLoadTargetTypeListHeader = function PagePublisher$_asyncLoadTargetTypeListHeader() 
{
    var p = this.properties;
    // Continue loading target types list header
    var ttListHeadPath = $config.expandBasePath(PowerTools.Popups.PagePublisher.TARGETTYPE_HEAD_PATH + "?forView=" + Tridion.Core.Configuration.CurrentView + "&forControl=" + this.properties.controls.TargetTypeList.getId());
    // Async load
    $xml.loadXmlDocument(ttListHeadPath, this.getDelegate(this._ttListHeadLoaded), this.getErrorHandler());
};


/**
* Asynchronously load target types list header.
*/
PowerTools.Popups.PagePublisher.prototype._asyncLoadTargetTypeList = function PagePublisher$_asyncLoadTargetTypeList() 
{
    var p = this.properties;
    var c = p.controls;

    // Show loading
    c.TargetTypeList.setLoading(true);

    // Async handler
    var self = this;

    var populateList = function _asyncLoadTargetTypeList$listLoaded(event) 
	{
        var ttList = self.getListTargetTypes();
        $evt.removeEventHandler(ttList, "load", populateList);
        // Get a local threaded xml document
        var xml = $xml.getNewXmlDocument(ttList.getXml());

        // Add Icon attribute if it's not there
        var nodes = $xml.selectNodes(xml, "/tcm:*/tcm:Item");
        if (nodes) 
		{
            for (var i = 0, cnt = nodes.length; i < cnt; i++) 
			{
                if (!nodes[i].getAttribute("Icon")) 
				{
                    nodes[i].setAttribute("Icon", $const.ItemType.TARGET_TYPE.replace(/tcm:/i, "T"));
                }
                else 
				{
                    // If one is there most probably all of them are there
                    break;
                }
            }
        }

        // Draw the list
        c.TargetTypeList.draw(xml, p.ttListHeadXml);
        c.TargetTypeList.setView(Tridion.Controls.List.ViewType.CHECKBOXES);
        p.checkBoxView = c.TargetTypeList.getCurrentView();

        // Stop showing loading
        c.TargetTypeList.setLoading(false);
    };


    // Try load target type list from model
    var ttList = this.getListTargetTypes();
    if (ttList) 
	{
        if (ttList.isLoaded(true)) 
		{
            populateList();
        }
        else 
		{
            $evt.addEventHandler(ttList, "load", populateList);
            ttList.load();
        }
    }
};


/**
* Gets Target Types List. 
* @returns {Object} Target Types  List. 
*/
PowerTools.Popups.PagePublisher.prototype.getListTargetTypes = function PagePublisher$getListTargetTypes() 
{
    var p = this.properties;
    if (!p.targetTypesListId) 
	{
        var publication = this._getPublicationFromParams();
        if (publication) 
		{
            var list = publication.getListTargetTypes($const.ColumnFilter.ID);
            p.targetTypesListId = list.getId();
            return list;
        }
    }
    else 
	{
        return $models.getItem(p.targetTypesListId);
    }
};

/**
* _getSelectedTargetTypes 
* @returns {Object} Target Types  List. 
*/

PowerTools.Popups.PagePublisher.prototype._getSelectedTargetTypes = function PagePublisher$_getSelectedTargetTypes() 
{
    var p = this.properties;
    var selection = p.checkBoxView.getSelection();
    return selection.getItems();
};


/**
* Gets item publication.
* @returns {Tridion.ContentManager.Publication} Using item <c>Tridion.ContentManager.Publication</c>.
* @private 
*/
PowerTools.Popups.PagePublisher.prototype._getPublicationFromParams = function _getPublicationFromParams() 
{
    var p = this.properties;
    var itemId = p.locationId;
    if (itemId) 
	{
        var item = $models.getItem(itemId);
        if (item) 
		{
            return item.getPublication();
        }
    }
    return null;
};

/**
* _onPublishRadioChanged
* Manages what happens when a user clicks on Publish now, later or schedule
* @private 
*/
PowerTools.Popups.PagePublisher.prototype._onPublishRadioChanged = function PagePublisher$_onPublishRadioChanged(e) 
{
    var p = this.properties;
    var c = p.controls;
    var source = e.source || $e.srcElement(e);
    switch (source) 
	{
        case c.publishLater:
            $css.undisplay(c.setSchedulePublish);
            $css.display(c.setPublishLater);
            c.PublishLaterDate.setDate(p.today);
            c.PublishLaterDate.setStartDate(p.today);
            break;
        case c.schedulePublish:
            $css.undisplay(c.setPublishLater);
            $css.display(c.setSchedulePublish);
            c.PublishLaterDate.setDate(null);
            c.PublishLaterDate.setStartDate(null);
            break;
        default:
            $css.undisplay(c.setPublishLater);
            $css.undisplay(c.setSchedulePublish);
            c.PublishLaterDate.setDate(null);
            c.PublishLaterDate.setStartDate(null);
            break;
    }
    // Resize page layout
    Tridion.DisplayController.resize();
};


/**
* _onGenerateContentRadioChanged
* Manages what happens when a user clicks on generate content now
* @private 
*/
PowerTools.Popups.PagePublisher.prototype._onGenerateContentRadioChanged = function PagePublisher$_onGenerateContentRadioChanged(e) 
{
    var p = this.properties;
    var c = p.controls;
    var source = e.source || $e.srcElement(e);
    switch (source) 
	{
        case c.generateContentLater:
            $css.display(c.setGenerateContentLater);
            c.GenerateContentDate.setDate(p.today);
            c.GenerateContentDate.setStartDate(p.today);
            break;
        default:
            $css.undisplay(c.setGenerateContentLater);
            c.GenerateContentDate.setDate(null);
            c.GenerateContentDate.setStartDate(null);
            break;
    }
    // Resize page layout
    Tridion.DisplayController.resize();
};


/**
* _onPlaceContentRadioChanged
* Manages what happens when a user clicks place content now
* @private 
*/
PowerTools.Popups.PagePublisher.prototype._onPlaceContentRadioChanged = function PagePublisher$_onPlaceContentRadioChanged(e) 
{
    var p = this.properties;
    var c = p.controls;
    var source = e.source || $e.srcElement(e);
    switch (source) 
	{
        case c.placeContentLater:
            $css.display(c.setPlaceContentLater);
            c.PlaceContentDate.setDate(p.today);
            c.PlaceContentDate.setStartDate(p.today);
            break;
        default:
            $css.undisplay(c.setPlaceContentLater);
            c.PlaceContentDate.setDate(null);
            c.PlaceContentDate.setStartDate(null);
            break;
    }
    // Resize page layout
    //Tridion.DisplayController.resize();
};

/**
* Reacts to the DOM click event.
* @private
*/
PowerTools.Popups.PagePublisher.prototype._onBtnCancelClicked = function PagePublisher$_onBtnCancelClicked() 
{
    window.close();
};

/**
* Gets today.
* @returns {Date} Today.
*/
PowerTools.Popups.PagePublisher.prototype._getToday = function PagePublisher$_getToday() 
{
    var now = Tridion.UI.ServerTime.getInstance().getDate();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
};

$display.registerView(PowerTools.Popups.PagePublisher);