/*
***		Helper methods for 2011 GUI Extension
***		By: Yoav Niran (SDL Tridion)
***		Vesion: 0.6 GA
*/
Type.registerNamespace("PowerTools");

PowerTools.Utilities = function Utilities()
{
    this.EDITOR_NAME = "PowerTools";

    this._tridionGroups = null;
    this._userSettings = null;
};

PowerTools.Utilities.prototype.getItem = function (itemId, handler, errHandler, reload)
{
    var item = $models.getItem(itemId);
    if (!reload) reload = false;

    var clearEvents = function ()
    {
        $evt.removeEventHandler(item, "load", gotItem);
        $evt.removeEventHandler(item, "loadfailed", failedToLoad);
    };

    if (item)
    {
        if (!item.isLoaded() || reload)
        {
            var gotItem = function ()
            {
                $log.message("[ExtensionsUtils.getItem]: item: '{0}' finished loading successfully".format(itemId));

                clearEvents();
                if (handler) handler(item);
            };

            var failedToLoad = function (error)
            {
                $log.message("[ExtensionsUtils.LoadItem]: item: '{0}' failed to load");

                clearEvents();
                if (errHandler) errHandler(error);
            };

            $evt.addEventHandler(item, "load", gotItem);
            $evt.addEventHandler(item, "loadfailed", failedToLoad);

            item.load(reload);
        }
        else
        {
            gotItem();
        }
    }
    else
    {
        if (errHandler) errHandler();
    }
}

PowerTools.Utilities.prototype.getStaticItem = function (itemId, handler, errHandler, reload)
{
    if (!reload) reload = false;

    var item = $models.getItem(itemId);

    var clearEvents = function ()
    {
        $evt.removeEventHandler(item, "staticload", gotItem);
        $evt.removeEventHandler(item, "staticloadfailed", failedToLoad);
    };

    if (item)
    {
        var gotItem = function ()
        {
            //$log.message("[ExtensionsUtils.getStaticItem]: item: '{0}' finished loading successfully".format(itemId));

            clearEvents();
            if (handler) handler(item);
        };

        var failedToLoad = function (error)
        {
            clearEvents();
            if (errHandler) errHandler(error);
        };

        if (!item.isStaticLoaded() || reload)
        {
            //$log.message(String.format("[ExtensionsUtils.getStaticItem]: about to statically load item: '{0}' reload: '{1}'", itemId, reload));

            $evt.addEventHandler(item, "staticload", gotItem);
            $evt.addEventHandler(item, "staticloadfailed", failedToLoad);

            item.staticLoad(reload);
        }
        else
        {
            gotItem();
        }
    }
    else
    {
        if (errHandler) errHandler();
    }
};

PowerTools.Utilities.prototype.getTemplate = function (url)
{
    var template = null;

    $j.ajax({
        url: url,
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "html",
        success: function (result)
        {
            template = result;
        }
    });

    return template;
};

PowerTools.Utilities.prototype.doAjax = function (url, type, success, fail, data)
{
    if (!data) data = {};

    $j.ajax({				//asynchronously make the call
        url: url,
        type: type,
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: success,
        error: fail,
        dataFilter: function (data)
        {
            var response;

            if (typeof (JSON) !== "undefined" && typeof (JSON.parse) === "function")
                response = JSON.parse(data);
            else
                response = eval("(" + data + ")");

            return response;
        }
    });
};

PowerTools.Utilities.prototype.getItemLink = function (itemId)
{
    return String.format("/{0}/{1}/{2}#id={3}", $config.CurrentEditor,
												$config.EditorPath,
												$config.Editors.CME.edittypes[$models.getItemType(itemId)],
												itemId);
};

PowerTools.Utilities.prototype.getIconPath = function (item, size)
{
    return $config.getIconPath(item.getItemIcon(), size);
};

PowerTools.Utilities.prototype.openInEditor = function (itemId)
{
    $ptUtils.getStaticItem(itemId, function (item)
    {
        if (item)
        {
            var openItem = function (openItemId) //open the item editor in a new window
            {
                $log.message("[ExtensionsUtils.openInEditor]: about to open item: " + openItemId);

                var itemToOpen = $models.getItem(openItemId);

                if (!itemToOpen.openInEditor($display.getItemEditorUrl(itemToOpen.getItemType())))
                {
                    $messages.registerError($localization.getCoreResource("IsPopupBlocker"), null, null, null, true);
                }
            };

            var itemBpInfoLoaded = function ()
            {
                $evt.removeEventHandler(item, "loadblueprintinfo", itemBpInfoLoaded);

                var args = { "item": item, "baseItemUri": item.getParentId(),
                    "isLocalizable": item.isLocalizable(),
                    "popupType": Tridion.Controls.Popup.Type.MODAL_IFRAME
                };

                if (item.isShared() && (args.baseItemUri || args.isLocalizable))
                {
                    var popup = $popup.create($cme.Popups.OPEN_ITEM_OPTIONS.URL, $cme.Popups.OPEN_ITEM_OPTIONS.FEATURES, args);

                    $evt.addEventHandler(popup, "cancel", function popupCancelled()
                    {
                        $evt.removeEventHandler(popup, "cancel", popupCancelled);
                        popup.close();
                        return;
                    });

                    $evt.addEventHandler(popup, "submit", function popupSubmitted(event)
                    {
                        $evt.removeEventHandler(popup, "submit", popupSubmitted);

                        popup.close();

                        var uriToOpen = itemId;

                        switch (event.data.value)
                        {
                            case "editparent":
                                if (args.baseItemUri) uriToOpen = args.baseItemUri;
                                break;
                            case "localizeedit":
                                if (args.isLocalizable) item.localize(true);
                                break;
                        }

                        openItem(uriToOpen);
                    });

                    $log.message("utils$openInEditor: about to show shared item popup");
                    popup.open();
                }
            };

            if (Tridion.OO.implementsInterface(item, "Tridion.ContentManager.RepositoryLocalItem"))
            {
                $log.message(String.format("utils$openInEditor: item is repository local item. shared? '{0}', isbploaded? '{1}'", item.isShared(), item.isBlueprintInfoLoaded()));

                $evt.addEventHandler(item, "loadblueprintinfo", itemBpInfoLoaded);

                if (item.isShared())
                {
                    if (!item.isBlueprintInfoLoaded())
                    {
                        item.loadBlueprintInfo();
                    }
                    else
                    {
                        itemBpInfoLoaded();
                    }
                }
                else
                    openItem(itemId);
            }
            else
                openItem(itemId);
        }
    });
};

PowerTools.Utilities.prototype.browseItem = function (itemId)
{
    var gotoCommand = $cme.getCommand("Goto");

    if (gotoCommand != null)
    {
        var selection = new Tridion.Cme.Selection();
        selection.addItem(itemId);
        $cme.executeCommand("Goto", selection);
    }
};

PowerTools.Utilities.prototype.getTridionGroups = function (callback, reload)
{
    $log.message("[Utilities.getTridionGroups]: About to retrieve system groups (refresh: '{0}')".format(reload));

    if (!this._tridionGroups || this._tridionGroups.length == 0 || reload)
    {
        var context = this;
        var listGroups = $models.getItem($const.TCMROOT).getListGroups();
        var listData = $models.getItem(listGroups.getId());

        var dataLoaded = function (error)
        {
            context._tridionGroups = new Array();

            //$log.message("[Utilities.getTridionGroups]: data loaded event handler has been called");

            $evt.removeEventHandler(listData, "load", dataLoaded);
            $evt.removeEventHandler(listData, "loadfailed", dataLoaded);

            var xml;

            if (error && error.Message)
            {
                $log.error("[Utilities.getTridionGroups]:There was an error loading tridion groups: '{0}'".format(error.Message));

                xml = $xml.getNewXmlDocument("<tcm:ListItems xmlns:tcm=\"{0}\" />".format($const.Namespaces.tcm));
            }
            else
            {
                xml = $xml.getNewXmlDocument(listData.getXml());
            }

            var xpath = "/tcm:*/tcm:Item";
            var nodes = $xml.selectNodes(xml, xpath);
            var itemCount = nodes.length || 0;

            $log.message("[Utilities.getTridionGroups]: retrieved {0} groups from Tridion".format(itemCount));

            for (var i = 0; i < itemCount; i++)
            {
                var node = nodes[i];

                var group = {
                    "GroupId": node.getAttribute("ID"),
                    "GroupTitle": node.getAttribute("Title")
                };

                context._tridionGroups.push(group);
            }

            callback(context._tridionGroups);
        };

        $evt.addEventHandler(listData, "load", dataLoaded);
        $evt.addEventHandler(listData, "loadfailed", dataLoaded);

        //$log.message("[Utilities.getTridionGroups]: About to call load method on list object");

        listData.load(true);
    }
    else
    {
        callback(context._tridionGroups);
    }
    //return this._tridionGroups;
};

PowerTools.Utilities.prototype.getUserSettings = function ()
{
    if (!this._userSettings)
    {
        this._userSettings = Tridion.UI.UserSettings.getJsonUserSettings(true);
    }

    return this._userSettings;
};

PowerTools.Utilities.prototype.isCurrentUserInGroup = function (groupId)
{
    var settings = this.getUserSettings();

    if (settings)
    {
        var groups = settings.User.Data.GroupMemberships;

        for (var i in groups)
        {
            var group = groups[i];

            if (group["@title"] == groupId) //stupid IE cant handle properties starting with '@'
            {
                $log.message("[Utilities.isCurrentUserInGroup]: current user is member of group: '{0}'".format(groupId));
                return true;
            }
        }

        $log.message("[Utilities.isCurrentUserInGroup]: current user is NOT member of group: '{0}'".format(groupId));
    }
    else
    {
        $log.warn("[Utilities.isCurrentUserInGroup]: Couldnt load user settings!");

        return false;
    }
};

PowerTools.Utilities.prototype.isCurrentUserAdmin = function ()
{
    var settings = this.getUserSettings();

    if (settings)
    {
        var priv = settings.User.Data.Privileges;

        return (priv == "1");
    }
    else
        $log.warn("[Utilities.isCurrentUserAdmin]: Couldnt load user settings!");

    return false;
};

PowerTools.Utilities.prototype.registerProgress = function (msg, successMsg, cancelMsg, finishEvents, modal)
{
    modal = modal || false;

    var msg = $messages.registerProgress(msg, null, false, false, modal);

    msg.setOnSuccessMessage(successMsg);

    if (cancelMsg) msg.setOnCancelMessage(cancelMsg);

    if (finishEvents)
    {
        for (var i in finishEvents)
        {
            msg.addFinishEvent(finishEvents[i].ItemId, finishEvents[i].EventName, finishEvents[i].IsSuccess);
        }
    }

    return msg;
};

PowerTools.Utilities.prototype.isVersionedItem = function (item)
{
    return (Tridion.OO.implementsInterface(item, "Tridion.ContentManager.VersionedItem"));
};

PowerTools.Utilities.prototype.expandPath = function (path)
{
    return $config.expandEditorPath(path, $ptUtils.EDITOR_NAME);
};

PowerTools.Utilities.prototype.isTridionType = function (id)
{
    var itemType = $models.getItemType(id);

    //$log.message("[Utilities.isTridionType]: item type is: '{0}'".format(itemType));

    var isType = (itemType.indexOf("tcm:") == 0 || itemType.indexOf("oe:1") == 0);

    return isType;
};

PowerTools.Utilities.prototype.getItemSelector = function (startUri, preSelectedUri, filterDefinition, singleSelectMode, listThumbNails, onSuccess)
{
    //Callback method for ItemSelector 'unload' event.
    var onSelectDialogClosed = function onSelectDialogClosed(event)
    {
        var p = this.properties;
        if (p.popup)
        {
            p.popup.dispose();
            p.popup = null;
        }
    };

    //Construct url to itemselector. 
    //1e param -> RootID. Where to start in the Treeview of the ItemSelector. (Organizational item. E.g.: tcm:1-1-2)
    //2e param -> Which item to pre-select in the dashboard view of the ItemSelector. (E.g. "tcm:1-1-16")
    var dialogUrl = $cme.Popups.ITEM_SELECT.URL.format(startUri, preSelectedUri);
    var dialogFeatures = $cme.Popups.ITEM_SELECT.FEATURES; //Constant. 

    //Initialize filter. (Which itemtypes to show, basedOnSchema, etc). 
    //For a complete list see: ItemSelectControl.js in %tridion install%\web\webui\Editors\CME\Controls\ItemSelect\. Function: Tridion.Controls.ItemSelectControl.prototype.setOptions = function ItemSelectControl$setOptions(options) 
    //var filterDefinition = new Tridion.ContentManager.ListFilter();
    //filterDefinition.conditions.ItemTypes = [$const.ItemType.COMPONENT, $const.ItemType.COMPONENT_TEMPLATE];

    //Some more examples for the filter:
    //var filter = new Tridion.ContentManager.ListFilter();
    //filter.conditions.ItemTypes = [$const.ItemType.CATEGORY, $const.ItemType.KEYWORD];
    //filter.conditions.BasedOnItem = selection.getItems();
    //filter.columns = $const.ColumnFilter.DEFAULT | $const.ColumnFilter.ALLOWED_ACTIONS | $const.ColumnFilter.EXTENDED;

    var popUp = Tridion.Controls.Popup.create(
			dialogUrl,
			dialogFeatures,
			{
			    filter: filterDefinition,
			    isListThumbnails: listThumbNails, //List thumbnails for binaries?
			    singleSelection: singleSelectMode    //Allow multiple selections? 
			});

    $evt.addEventHandler(popUp, "insert", onSuccess); //Bind callback function to 'insert' event. In this event you define what to do with the selected items.
    $evt.addEventHandler(popUp, "unload", onSelectDialogClosed); //Bind callback function to 'unload'. Properly dispose the popup.
    popUp.open();
};

// Helper method for getting a list of items from an organizational item
// Usage: 
// Declare a filter (which items do you want to get back. Also, which columns, etc)
//   var filterDefinition = new Tridion.ContentManager.ListFilter();
//   filterDefinition.conditions.ItemTypes = [$const.ItemType.COMPONENT];
// Define a callback function which takes one param. In this function you can manipulate/list/show the items
// function callBack(jsonObject)
// {
//      if (jsonObject.Item) {
//            for (var j = 0, itemsLength = jsonObject.Item.length; j < itemsLength; j++) {
//                console.log(jsonObject.Item[j]["@ID"]);
//                console.log(jsonObject.Item[j]["@Title"]);
//            }
//        }
//  }
//
// Call the method
// var itemsInFolder = $ptUtils.getListTcmItems("tcm:1-5-2", filterDefinition, this.callBack);
PowerTools.Utilities.prototype.getListTcmItems = function (orgItemUri, filter, callback)
{
    var listResult = $models.getItem(orgItemUri).getList(filter, false, true);

    var filtersListLoaded = function filtersListLoaded()
    {
        $evt.removeEventHandler(listResult, "load", filtersListLoaded);
        $evt.removeEventHandler(listResult, "loadfailed", filtersListLoaded);

        var doc = $xml.getNewXmlDocument(listResult.getXml());

        //Select all items
        var node = $xml.selectSingleNode(doc, "//tcm:ListItems");
        var jsonObject = $xml.toJson(node);

        //Call the callback function with result
        callback(jsonObject);

    };

    if (!listResult.isLoaded(true))
    {
        $evt.addEventHandler(listResult, "load", filtersListLoaded);
        $evt.addEventHandler(listResult, "loadfailed", filtersListLoaded);

        listResult.load();
    }
    else
    {
        filtersListLoaded();
    }
};



var $ptUtils = new PowerTools.Utilities();

/// Useful GUI JS files
///
///	$log					-- Tridion\web\WebUI\Core\Client\Base\MessageLog.js
///	$const					-- Tridion\web\WebUI\Core\Client\Base\Constants.js
///	$xml					-- Tridion\web\WebUI\Core\Client\Base\Utils\Xml.js
/// $messages				-- Tridion\web\WebUI\Models\CME\Client\MessageCenter\MessageCenter.js
/// $popup					-- Tridion\web\WebUI\Core\Controls\Popup\Popup.js
///	$evt					-- Tridion\web\WebUI\Core\Client\Base\EventRegister.js
/// Tridion.Core.Selection	-- Tridion\web\WebUI\Core\Client\Base\Selection.js
///