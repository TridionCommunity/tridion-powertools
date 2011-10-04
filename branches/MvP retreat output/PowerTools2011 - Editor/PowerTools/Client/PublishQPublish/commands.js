Type.registerNamespace("UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011");
/*
Borrowd from Bart Koopmans Publish from Publishing Queue eXtension
SOURCE: http://sdltridionworld.com/community/2011_extensions/publishfrompublishingqueue.aspx
*/


/**
* Implements the <c>PublishQueuePublish</c> command
*/
UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.PublishQPublish = function Commands$PublishQPublish() {
    Type.enableInterface(this, "Extensions.PublishFromPublishingQueue.PqPublish");
    this.addInterface("Tridion.Cme.Command", ["PqPublish", $const.AllowedActions.Publish]);

    this.properties.popup = null;
};


/**
* Returns a value indicating whether this command is applicable for the selected item(s)
* @param {Tridion.Core.Selection} selection The current selection
* @returns {Boolean} <c>true</c> if this command is applicable; otherwise false.
*/
UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.PublishQPublish.prototype._isAvailable = function PublishQPublish$_isAvailable(selection) {
    if (selection.getCount() == 1) {
        var itemType = $models.getItemType(selection.getItem(0));
        if (itemType == $const.ItemType.PUBLISH_TRANSACTION) {
            return true;
        }
    }
    return false;
};

/**
* Returns a value indicating whether this command can be executed on selected item(s)
* @param {Tridion.Core.Selection} selection The current selection
* @returns {Boolean} <c>true</c> if this command can be executed; otherwise false.
*/
UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.PublishQPublish.prototype._isEnabled = function PublishQPublish$_isEnabled(selection) {
    return this._isAvailable(selection);
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.PublishQPublish.prototype._execute = function PublishQPublish$_execute(selection) {
    var p = this.properties;

    // there must be at least one item selected
    if (!selection || selection.getCount() == 0) {
        return;
    }

    // popup management
    if (p.popup) {
        p.popup.focus();
    }
    else {
        var items = [];
        var id = selection.getItem(0);
        var item = $models.getItem(id);

        if (Type.isFunction(item.getPublishItemId)) {
            // get item from publish transaction
            id = item.getPublishItemId()
            items.push(id);
            this._openPublishPopup(items);
        }
    }
};

UrbanCherry.SDLTridion.GUIExtensions.PowerTools2011.PublishQPublish.prototype._openPublishPopup = function PublishQPublish$_openPublishPopup(items) {
    var p = this.properties;

    // build params
    var doRepublish = false;
    for (var i = 0, cnt = items.length; i < cnt; i++) {
        var type = $models.getItemType(items[i]);
        if (type == $const.ItemType.PUBLICATION || type == $const.ItemType.STRUCTURE_GROUP) {
            doRepublish = true;
            break;
        }
    }
    var params = { command: "publish", items: items, republish: doRepublish, userWorkflow: false };

    p.popup = $popup.create($cme.Popups.PUBLISH.URL, $cme.Popups.PUBLISH.FEATURES, params);

    $evt.addEventHandler(p.popup, "unload",
		function PqPublish$_execute$_unload(event) {
		    if (p.popup) {
		        p.popup.dispose();
		        p.popup = null;
		    }
		});

    $evt.addEventHandler(p.popup, "error",
		function PqPublish$_execute$_error(event) {
		    $messages.registerError(event.data.error.Message, null, null, null, true);

		    if (p.popup) {
		        p.popup.dispose();
		        p.popup = null;
		    }
		});

    $evt.addEventHandler(p.popup, "publish",
		function PqPublish$_execute$_published(event) {
		    var items = event.data.items;
		    var itemsLength = items.length;
		    var itemList = Type.isArray(items) ? items.join(", ") : "";
		    var msg = $localization.getEditorResource("PublishPopupSentToPublishQueue", itemList);

		    $messages.registerNotification(msg);

		    if (p.popup) {
		        p.popup.dispose();
		        p.popup = null;
		    }
		});

    p.popup.open();
};
