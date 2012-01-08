Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.PagePublisher = function () {

    Type.enableInterface(this, "PowerTools.Popups.PagePublisher");
    this.addInterface("Tridion.Cme.View");
    this.addInterface("PowerToolsBase", [this]);     //Base class for initializing execute-,close button, and progressbar.

    var p = this.properties;

    p.processId = null;
    p.locationId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
    p.targetTypesListId; // Target types domain list
    p.progressDialog = { showAnimation: false, closeAfterComplete: true }; // turn off the dialog after complete
};

PowerTools.Popups.PagePublisher.TARGETTYPE_HEAD_PATH = $config.expandEditorPath("/Xml/ListDefinitions/TargetTypeList-head.xml", $const.CMEEditorName);

PowerTools.Popups.PagePublisher.prototype.initialize = function ()
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
    $controls.getControl($("#StackElement"), "Tridion.Controls.Stack");
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

PowerTools.Popups.PagePublisher.prototype._onExecuteButtonClicked = function () {

    $log.message("Page publisher execute button clicked");
    var p = this.properties;
    var c = p.controls;
    p.SelectedTarget = this._getSelectedTargetTypes();
    alert(p.locationId);
    //TODO: if the p.locationId value is a publication id - enable recursing, if you don't it will fail!
    p.Recursive = $j("#RecursiveChk").attr('checked');
    p.Republish = $j("#RepublishChk").attr('checked');
    p.PublishChildren = $j("#PublishChildrenChk").attr('checked');
    p.IncludeComponentLinks = $j("#includeComponentLinksChk").attr('checked');
    p.PublishStructureGroupInfo = $j("#resolveStructureGroupInfoChk").attr('checked');
    p.IncludeWorkflow = $j("#includeWorkFlowChk").attr('checked');
    p.Priority = parseInt($j("#Priority").val());
    var onSuccess = Function.getDelegate(this, this._onExecuteStarted);
    var onFailure = null;
    var context = null;

    // pass in structure uri, publishing target uri
    $log.message("Page publisher publish : Recursive = [" + p.Recursive + "] | Republish in children = [" + p.PublishChildren + "] | Republish only = [" + p.Republish + "] |  Priority = [" + p.Priority + "]");
    PowerTools.Model.Services.PagePublisher.Execute(p.locationId, p.SelectedTarget, p.Recursive, p.Republish, p.Priority,
        p.PublishChildren, p.IncludeComponentLinks, p.PublishStructureGroupInfo,
        p.IncludeWorkflow, onSuccess, onFailure, context, false);
};

/**
* TODO: When the publishing is completed, close the dialog and update the message center 
*/

PowerTools.Popups.PagePublisher.prototype.afterSuccess = function (processId) {
    //alert("everything is completed!");
};

///**
//* When the overlayer close button is clicked the div is faded out
//*/
//PowerTools.Popups.PagePublisher.prototype._onCloseButtonClicked = function () {
//    $j('#mask, .window').hide();
//    $j('#ProgressStatus').html("");
//    $j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
//};

///**
//* Updates the overlayer progress bar with the current percentage of the process
//* @process - the service process:
//*/
//PowerTools.Popups.PagePublisher.prototype._updateProgressBar = function (process) {

//    $j('#ProgressStatus').html(process.Status);
//    $j('#ProgressBar').css({ 'width': process.PercentComplete + '%', 'display': 'block' });
//}

///**
//* Manages the responses from the status
//* @result:
//*/

//PowerTools.Popups.PagePublisher.prototype._handleStatusResponse = function (result) {
//    var p = this.properties;
//    p.processId = result.Id;
//    this._updateProgressBar(result);
//    if (result.PercentComplete < 100) {
//        this._pollStatus(p.processId);
//    }
//    else {
//        $j('#ProgressStatus').html(result.Status);
//        $j('#CloseDialog').show();
//        p.processId = ""
//    }
//}

///**
//* Gets the process status from the page publisher webservice
//* @id - the id of the process:
//*/

//PowerTools.Popups.PagePublisher.prototype._pollStatus = function (id) {
//    var onFailure = null;
//    var onSuccess = Function.getDelegate(this, this._handleStatusResponse);
//    var context = null;
//    var callback = function () {
//        $log.debug("Checking the status of process #" + id);
//        PowerTools.Model.Services.PagePublisher.GetProcessStatus(id, onSuccess, onFailure, context, false);
//    };
//    setTimeout(callback, this.properties.pollInterval);
//}

///**
//* While the tool is processing polls the status
//* @result - the process 
//*/

//PowerTools.Popups.PagePublisher.prototype._onExecuteStarted = function (result) {
//    if (result) {
//        this._pollStatus(result.Id);
//    }
//};


/**
* Sets the publish button to disabled and loads the drop down header xml
*/

PowerTools.Popups.PagePublisher.prototype._setupControls = function _setupControls() {
    $log.message("Page publisher setting up controls");

    var p = this.properties;
    var c = p.controls;

    // Disable the execute button
    c.ExecuteButton.disable();

    var publishLabel = $localization.getEditorResource("Publish");
    document.title = publishLabel;
    c.ExecuteButton.setText(publishLabel);

    // set the PublishTab to visible
    var page = c.TabControl.getPage("PublishTab");
    if (page) {
        c.TabControl.showItem(page);
        c.TabControl.selectItem(page);
    }


}


/* ============================================
*  Publishing target checkbox related functions
============================================ */

/**
* Handles the list selection change event.
* @param {Tridion.Core.Event} event. The event is the event fired from the list.
* @private
*/
PowerTools.Popups.PagePublisher.prototype._onTargetTypeListSelectionChanged = function _onTargetTypeListSelectionChanged(e) {
    var p = this.properties;
    var c = p.controls;
    var eventName = e.name;
    var selection = (e && e.data) ? e.data.items : null;
    var enable = false;

    // Update selected tt array	
    var checkBoxes = p.checkBoxView.getSelection();
    for (var checkboxKey in checkBoxes) {
        var tcmId = checkBoxes[checkboxKey];
        if (tcmId) {
            enable = true;
            break;
        }
    }

    if (enable) {
        c.ExecuteButton.enable();
    }
    else {
        c.ExecuteButton.disable();
    }
};


/**
* Handles the definitions XML document load event.
* @param {XMLDocument} headXml Definitions XML document.
*/
PowerTools.Popups.PagePublisher.prototype._ttListHeadLoaded = function _ttListHeadLoaded(headXml) {
    // Save target type list header
    this.properties.ttListHeadXml = headXml;
    // Load target type list
    this._asyncLoadTargetTypeList();
};


/**
* Handles the definitions XML document load faild event.
*/
PowerTools.Popups.PagePublisher.prototype._ttListHeadLoadFailed = function _ttListHeadLoadFailed() {
    $log.message("PowerTools.Popups.PagePublisher._ttListHeadLoadFailed");
};



/**
* Asynchronously load Target types list header.
*/
PowerTools.Popups.PagePublisher.prototype._asyncLoadTargetTypeListHeader = function _asyncLoadTargetTypeListHeader() {
    var p = this.properties;
    // Continue loading target types list header
    var ttListHeadPath = $config.expandBasePath(PowerTools.Popups.PagePublisher.TARGETTYPE_HEAD_PATH + "?forView=" + Tridion.Core.Configuration.CurrentView + "&forControl=" + this.properties.controls.TargetTypeList.getId());
    // Async load
    $xml.loadXmlDocument(ttListHeadPath, this.getDelegate(this._ttListHeadLoaded), this.getDelegate(this._ttListHeadLoadFailed));
};


/**
* Asynchronously load target types list header.
*/
PowerTools.Popups.PagePublisher.prototype._asyncLoadTargetTypeList = function _asyncLoadTargetTypeList() {
    var p = this.properties;
    var c = p.controls;

    // Show loading
    c.TargetTypeList.setLoading(true);

    // Async handler
    var self = this;

    var populateList = function _asyncLoadTargetTypeList$listLoaded(event) {
        var ttList = self.getListTargetTypes();
        $evt.removeEventHandler(ttList, "load", populateList);
        // Get a local threaded xml document
        var xml = $xml.getNewXmlDocument(ttList.getXml());

        // Add Icon attribute if it's not there
        var nodes = $xml.selectNodes(xml, "/tcm:*/tcm:Item");
        if (nodes) {
            for (var i = 0, cnt = nodes.length; i < cnt; i++) {
                if (!nodes[i].getAttribute("Icon")) {
                    nodes[i].setAttribute("Icon", $const.ItemType.TARGET_TYPE.replace(/tcm:/i, "T"));
                }
                else {
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
    if (ttList) {
        if (ttList.isLoaded(true)) {
            populateList();
        }
        else {
            $evt.addEventHandler(ttList, "load", populateList);
            ttList.load();
        }
    }
};


/**
* Gets Target Types List. 
* @returns {Object} Target Types  List. 
*/
PowerTools.Popups.PagePublisher.prototype.getListTargetTypes = function getListTargetTypes() {

    var p = this.properties;
    if (!p.targetTypesListId) {
        var publication = this._getPublicationFromParams();
        if (publication) {
            var list = publication.getListTargetTypes($const.ColumnFilter.ID);
            p.targetTypesListId = list.getId();
            return list;
        }
    }
    else {
        return $models.getItem(p.targetTypesListId);
    }
};

/**
* _getSelectedTargetTypes 
* @returns {Object} Target Types  List. 
*/

PowerTools.Popups.PagePublisher.prototype._getSelectedTargetTypes = function _getSelectedTargetTypes() {
    var p = this.properties;
    var selection = p.checkBoxView.getSelection();
    return selection.getItems();
};


/**
* Gets item publication.
* @returns {Tridion.ContentManager.Publication} Using item <c>Tridion.ContentManager.Publication</c>.
* @private 
*/
PowerTools.Popups.PagePublisher.prototype._getPublicationFromParams = function _getPublicationFromParams() {
    var p = this.properties;
    var itemId = p.locationId;
    if (itemId) {
        var item = $models.getItem(itemId);
        if (item) {
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
PowerTools.Popups.PagePublisher.prototype._onPublishRadioChanged = function _onPublishRadioChanged(e) {
    var p = this.properties;
    var c = p.controls;
    var source = e.source || $e.srcElement(e);
    switch (source) {
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
PowerTools.Popups.PagePublisher.prototype._onGenerateContentRadioChanged = function _onGenerateContentRadioChanged(e) {
    var p = this.properties;
    var c = p.controls;
    var source = e.source || $e.srcElement(e);
    switch (source) {
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
PowerTools.Popups.PagePublisher.prototype._onPlaceContentRadioChanged = function _onPlaceContentRadioChanged(e) {
    var p = this.properties;
    var c = p.controls;
    var source = e.source || $e.srcElement(e);
    switch (source) {
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
PowerTools.Popups.PagePublisher.prototype._onBtnCancelClicked = function Publish$_onBtnCancelClicked() {
    window.close();
};

/**
* Gets today.
* @returns {Date} Today.
*/
PowerTools.Popups.PagePublisher.prototype._getToday = function _getToday() {
    var now = Tridion.UI.ServerTime.getInstance().getDate();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
};

$display.registerView(PowerTools.Popups.PagePublisher);