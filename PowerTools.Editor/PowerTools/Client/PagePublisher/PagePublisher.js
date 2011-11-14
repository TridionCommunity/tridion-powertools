Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.PagePublisher = function () {
    Type.enableInterface(this, "PowerTools.Popups.PagePublisher");
    this.addInterface("Tridion.Cme.View");
    this.callBase("Tridion.Cme.View", "initialize");

    var p = this.properties;
    p.processId = null;
    p.locationId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process

    p.params = null;
    p.isPddLoaded = false;
    // Target types domain list
    p.targetTypesListId;

};

PowerTools.Popups.PagePublisher.TARGETTYPE_HEAD_PATH = $config.expandEditorPath("/Xml/ListDefinitions/TargetTypeList-head.xml", $const.CMEEditorName);

PowerTools.Popups.PagePublisher.prototype.initialize = function () {

    this.callBase("Tridion.Cme.View", "initialize");

    var p = this.properties;
    var c = p.controls;

    p.params = window.dialogArguments ? window.dialogArguments : null;
    p.locationId = $url.getHashParam("locationId");

    $log.message("Initializing page publisher for item: " + p.locationId);

    // Publish target select list
    c.TargetTypeList = $controls.getControl($("#TargetTypeList"), "Tridion.Controls.List");
    $evt.addEventHandler(c.TargetTypeList, "select", this.getDelegate(this._onTargetTypeListSelectionChanged));
    $evt.addEventHandler(c.TargetTypeList, "deselect", this.getDelegate(this._onTargetTypeListSelectionChanged));

    // Exe and close
    c.ExecuteButton = $controls.getControl($("#ExecuteButton"), "Tridion.Controls.Button");
    c.CloseButton = $controls.getControl($("#CloseDialog"), "Tridion.Controls.Button");
    $evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._onExecuteButtonClicked));
    $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onCloseButtonClicked));

    // Init controls
    this._setupControls();

    $log.message("Page publisher control loading processed");

    // Start loading data
    this._asyncLoadTargetTypeListHeader();
};


/**
* When the publish button is clicked the form values are checked and sent to publishpage service
*/

PowerTools.Popups.PagePublisher.prototype._onExecuteButtonClicked = function () {

    $j('#CloseDialog').hide();
    alert($j("#Priority").val());
    var p = this.properties;
    var c = p.controls;
    p.SelectedTarget = this._getSelectedTargetTypes();
    p.Recursive = $j("#RecursiveChk").attr('checked');
    p.Republish = $j("#RepublishChk").attr('checked');
    p.PublishChildren = $j("#PublishChildrenChk").attr('checked');
    //p.Priority = parseInt(c.Priority.getValue());
    p.Priority = parseInt($j("#Priority").val());
    $log.message("Page publisher publish : Recursive = [" + p.Recursive + "] | Republish in children = [" + p.PublishChildren + "] | Republish only = [" + p.Republish + "] |  Priority = [" + p.Priority + "]");

    var onSuccess = Function.getDelegate(this, this._onExecuteStarted);
    var onFailure = null;
    var context = null;

    // pass in structure uri, publishing target uri
    PowerTools.Model.Services.PagePublisher.Execute(p.locationId, p.SelectedTarget, p.Recursive, p.Republish, p.Priority, p.PublishChildren, onSuccess, onFailure, context, false);
    var dialog = $j("#dialog");
    var win = $j(window);

    //Get the screen height and width
    var maskHeight = $j(document).height();
    var maskWidth = win.width();

    //Set height and width to mask to fill up the whole screen
    $j('#mask').css({ 'width': maskWidth, 'height': maskHeight }).fadeIn(1000).fadeTo("slow", 0.8);

    //Get the window height and width

    var winH = win.height();
    var winW = win.width();

    //Set the popup window to center
    dialog.css({ "top": (winH / 2 - dialog.height() / 2),
        "left": (winW / 2 - dialog.width() / 2)
    }).fadeIn(2000);
};

/**
* When the overlayer close button is clicked the div is faded out
*/
PowerTools.Popups.PagePublisher.prototype._onCloseButtonClicked = function () {
    $j('#mask, .window').hide();
    $j('#ProgressStatus').html("");
    $j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
};

/**
* Updates the overlayer progress bar with the current percentage of the process
* @process - the service process:
*/
PowerTools.Popups.PagePublisher.prototype._updateProgressBar = function (process) {

    $j('#ProgressStatus').html(process.Status);
    $j('#ProgressBar').css({ 'width': process.PercentComplete + '%', 'display': 'block' });
}

/**
* Manages the responses from the status
* @result:
*/

PowerTools.Popups.PagePublisher.prototype._handleStatusResponse = function (result) {
    var p = this.properties;
    p.processId = result.Id;
    this._updateProgressBar(result);
    if (result.PercentComplete < 100) {
        this._pollStatus(p.processId);
    }
    else {
        $j('#ProgressStatus').html(result.Status);
        $j('#CloseDialog').show();
        p.processId = ""
    }
}

/**
* Gets the process status from the page publisher webservice
* @id - the id of the process:
*/

PowerTools.Popups.PagePublisher.prototype._pollStatus = function (id) {
    var onFailure = null;
    var onSuccess = Function.getDelegate(this, this._handleStatusResponse);
    var context = null;
    var callback = function () {
        $log.debug("Checking the status of process #" + id);
        PowerTools.Model.Services.PagePublisher.GetProcessStatus(id, onSuccess, onFailure, context, false);
    };
    setTimeout(callback, this.properties.pollInterval);
}

/**
* While the tool is processing polls the status
* @result - the process 
*/

PowerTools.Popups.PagePublisher.prototype._onExecuteStarted = function (result) {
    if (result) {
        this._pollStatus(result.Id);
    }
};


/**
* Set the publish button to disabled and loads the drop down header xml
*/

PowerTools.Popups.PagePublisher.prototype._setupControls = function _setupControls() {
    var p = this.properties;
    var c = p.controls;

    // Disable the execute button
    c.ExecuteButton.disable();

    var publishLabel = $localization.getEditorResource("Publish");
    document.title = publishLabel;
    c.ExecuteButton.setText(publishLabel);
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
    var checkBoxes = p.checkBoxView.getSelectedCheckBoxes();
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

$display.registerView(PowerTools.Popups.PagePublisher);


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
    var checkBoxes = p.checkBoxView.getSelectedCheckBoxes();
    var targets = [];

    for (var checkboxKey in checkBoxes) {
        if (checkBoxes[checkboxKey]) {
            targets[targets.length] = checkBoxes[checkboxKey];
        }
    }

    return targets;
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