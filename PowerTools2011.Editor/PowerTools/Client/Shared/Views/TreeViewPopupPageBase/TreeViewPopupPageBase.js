Type.registerNamespace("PowerTools2011.Popups");

PowerTools2011.Popups.TreeViewBase = function ()
{
	Type.enableInterface(this, "PowerTools2011.Popups.TreeViewBase");
	this.addInterface("Tridion.Cme.View");

	var p = this.properties;

	p.navigationTrees = {};
	p.activeTree;
};

PowerTools2011.Popups.TreeViewBase.prototype.initialize = function ()
{
	$log.message("initializing TreeViewBase popup...");

	var p = this.properties;
	var c = p.controls;

	p.rootUri = "tcm:0";

	this.callBase("Tridion.Cme.View", "initialize");

	c.tree = $controls.getControl($("#DashboardTree"), "Tridion.Controls.FilteredTree");

//	$evt.addEventHandler(c.tree, "paste", this.getDelegate(this.onListItemPaste));
//	$evt.addEventHandler(c.tree, "copy", this.getDelegate(this.onTreeItemCopy));
//	$evt.addEventHandler(c.tree, "cut", this.getDelegate(this.onTreeItemCut));
//	$evt.addEventHandler(c.tree, "delete", this.getDelegate(this.onTreeDelete));

	this.registerNavigationTree(c.tree, p.rootUri, this.getDataFilter(p.rootUri, null, true));

	$controls.getControl($("#LayoutWrapper"), "Tridion.Controls.Stack");
	$controls.getControl($("#DashboardSplitter"), "Tridion.Controls.Splitter");
	//$controls.getControl($("#ComponentsContent"), "Tridion.Controls.Splitter");
	//$controls.getControl($("#DialogTaskBar"), "Tridion.Controls.TaskBar");
	$controls.getControl($("#MessageCenter"), "Tridion.Controls.ActiveMessageCenter");

	this.startLoadingData();
};

PowerTools2011.Popups.TreeViewBase.prototype.registerNavigationTree = function (treeControl, rootUri, filter)
{
	var treeProvider = $models.getItem(rootUri);
	if (treeProvider && Tridion.OO.implementsInterface(treeProvider, "Tridion.ContentManager.TreeProvider"))
	{
		var tree = treeProvider.getTree(filter);
		if (tree)
		{
			$evt.addEventHandler(treeControl, "expand", this.getDelegate(this.onTreeExpand));
			$evt.addEventHandler(treeControl, "contextmenu", this.getDelegate(this.onTreeContextMenu));
			$evt.addEventHandler(treeControl, "select", this.getDelegate(this.onTreeSelection));

			var self = this;
			var treeEventHandler = function registerNavigationTree$TreeEventHandler(event)
			{
				self._handleTreeEvent(event, event.data.itemId, event.data.id, event.source, treeControl);
			}
			$evt.addEventHandler(tree, "itemadd", treeEventHandler);
			$evt.addEventHandler(tree, "itemremove", treeEventHandler);
			$evt.addEventHandler(tree, "itemupdate", treeEventHandler);
			$evt.addEventHandler(tree, "unload", treeEventHandler);
			$evt.addEventHandler(tree, "load", treeEventHandler);

			this.properties.navigationTrees[Object.getUniqueId(treeControl)] = { treeControl: treeControl, rootUri: rootUri, treeSourceId: tree.getId() };
		}
	}
};

PowerTools2011.Popups.TreeViewBase.prototype.startLoadingData = function ()
{
	// initialize the domain model tree
	var p = this.properties;
	var c = p.controls;

	if (p.rootUri)
	{
		var root = $models.getItem(p.rootUri);
		if (root)
		{
			var rootIcon = $config.getIconPath(root.getItemIcon(), 16);
			var rootTitle = root.getStaticTitle() || root.getTitle();
			
			if (rootTitle == undefined)
			{
				rootTitle = "...";
				root.staticLoad();
			}

			c.tree.setRootUri(p.rootUri);
			c.tree.setRootTitle(rootTitle);
			c.tree.setRootIcon(rootIcon);
			
			c.tree.populateNode(p.rootUri, $xml.getNewXmlDocument("<empty />"), false);
			c.tree.setLoading(true, p.rootUri);
			c.tree.expandNode(p.rootUri);
		}
	}
};

PowerTools2011.Popups.TreeViewBase.prototype.getDataFilter = function (itemId, itemTypes, isTreeFilter)
{
	var filter = new Tridion.ContentManager.ListFilter();

	if (isTreeFilter)
	{
		filter.conditions.ItemTypes = [$const.ItemType.PUBLICATION]; //$models.getContainerItemTypes(itemTypes, true);
		filter.columns = $const.ColumnFilter.DEFAULT | $const.ColumnFilter.ALLOWED_ACTIONS;
	}
	else
	{
		// Special filtering for a VF
		if ($models.getItemType(itemId) == $const.ItemType.VIRTUAL_FOLDER)
		{
			// In the dashboard we don't filter the items shown by a VF
			filter.conditions.ItemTypes = [];
		}
		else if (itemTypes && itemTypes.length > 0)
		{
			itemTypes = Array.clone(itemTypes);
			var organizationalItemTypes = $models.getContainerItemTypes(itemTypes, true);

			for (var i = 0, j = organizationalItemTypes.length; i < j; i++)
			{
				itemTypes.push(organizationalItemTypes[i]);
			}
			filter.conditions.ItemTypes = itemTypes.normalize();
		}
		else
		{
			filter.conditions.ItemTypes = $models.getContainedItemTypes($models.getItemType(itemId));
			filter.conditions.ShowNewItems = true;
		}
		filter.columns = $const.ColumnFilter.EXTENDED | $const.ColumnFilter.ALLOWED_ACTIONS | $const.ColumnFilter.CHECK_OUT_USER;
	}

	return filter;
};

PowerTools2011.Popups.TreeViewBase.prototype.onTreeExpand = function (event)
{
	var itemId = event.data.itemID;
	var populated = event.data.populated;
	if (!populated)
	{
		this.populateTreeNode(event.source, itemId);
	}
};

PowerTools2011.Popups.TreeViewBase.prototype.populateTreeNode = function (treeControl, itemId)
{
	var navTreeRegistry = this.getNavigationTreeEntry(treeControl);
	var tree = $models.getItem(navTreeRegistry.treeSourceId);
	if (tree.isLoaded(itemId))
	{
		this.onTreeLoaded(treeControl, itemId);
	}
	else
	{
		this.startLoadTreeControl(treeControl, itemId);
	}
};

PowerTools2011.Popups.TreeViewBase.prototype.startLoadTreeControl = function DashboardBase$startLoadTreeControl(treeControl, itemId)
{
	treeControl.setLoading(true, itemId);

	var treeRegistryEntry = this.getNavigationTreeEntry(treeControl);
	if (treeRegistryEntry)
	{
		var tree = $models.getItem(treeRegistryEntry.treeSourceId);
		if (tree)
		{
			if (!tree.isLoaded(itemId, undefined, true))
			{
				tree.load(itemId, undefined, true);
			}
			else
			{
				this.onTreeLoaded(treeControl, itemId);
			}
		}
	}
};

PowerTools2011.Popups.TreeViewBase.prototype.getNavigationTreeEntry = function DashboardBase$getNavigationTreeEntry(treeControl)
{
	return this.properties.navigationTrees[Object.getUniqueId(treeControl)];
};

PowerTools2011.Popups.TreeViewBase.prototype.onTreeContextMenu = function (event)
{
//	$log.event("CME:DASHBOARD_CONTEXTMENU", "SHOW");
//	var p = this.properties;
//	var treeControl = event.source;

//	var contextMenu = p.contextMenus[$models.getItemType(event.data.contextItem)] || p.contextMenus[""];
//	p.contextSource = treeControl;
//	contextMenu.show(event.data.sourceEvent, this.getTreeSelection(treeControl));
//	treeControl.setContextMenu(contextMenu);
};

PowerTools2011.Popups.TreeViewBase.prototype.onTreeSelection = function (event)
{
	var treeControl = event.source;
	this.setActiveTree(treeControl);

	var selection = new Tridion.Cme.Selection(treeControl.getSelection(), null, null);
	var itemUri = this.properties.contextUri = selection.getItem(0);
	$url.setHashParam("locationId", itemUri);
	//this.startLoadListControl(itemUri);
	//this.updateAddressBar();
};

PowerTools2011.Popups.TreeViewBase.prototype.onTreeLoaded = function (treeControl, itemId, event)
{
	var p = this.properties;
	if (event && p.locationUri && event.data.toIds && event.data.toIds.contains(p.locationUri))
	{
		this.navigateTo(p.locationUri, true, p.navigatingFrom);
	}
	else if (treeControl.isExpanded(itemId) && !treeControl.isPopulated(itemId))
	{
		var treeRegistryEntry = this.getNavigationTreeEntry(treeControl);
		if (treeRegistryEntry)
		{
			var tree = $models.getItem(treeRegistryEntry.treeSourceId);
			if (tree)
			{
				var list = tree.getList(itemId);
				treeControl.populateNode(itemId, $xml.getNewXmlDocument(list ? list.getXml() : "<empty />"));
				if (p.locationUri && treeControl.selectNode(p.locationUri))
				{
					p.locationUri = undefined;
				}
			}
		}
	}
};

PowerTools2011.Popups.TreeViewBase.prototype.setActiveTree = function (treeControl)
{
	var p = this.properties;
	if (p.activeTree != treeControl)
	{
		if (p.activeTree)
		{
			p.activeTree.invalidateSelection();
		}
		p.activeTree = treeControl;
	}
};

PowerTools2011.Popups.TreeViewBase.prototype._handleTreeEvent = function (event, itemId, parentId, tree, treeControl)
{
	var p = this.properties;

	switch (event.name)
	{
		case "itemadd":
			var xmlData = $xml.getNewXmlDocument(tree.getXml(parentId, [itemId]));
			var listIems = $xml.selectSingleNode(xmlData, "/tcm:Item/*");
			if (listIems)
			{
				var xml = $xml.getNewXmlDocument($xml.getOuterXml(listIems));
				treeControl.populateNode(parentId, xml, false);
				treeControl.expandNode(parentId);
				listIems = null;
			}
			xmlData = null;
			break;
		case "itemremove":
			treeControl.removeNode(itemId);

			if (p.contextUri == itemId)
			{
				treeControl.selectNode(parentId);
			}
			else
			{
				// Determine the path of the selected node and see if the current selected node is a decendent of the removed node.
				var selectedPath = tree.getPath($models.getItem(p.contextUri));

				// Make selected node to be element at index 0 to allow for simplification of the next 'if' condition, 
				// since reversing the path makes explicitly testing for -1 is no longer necessary
				selectedPath.reverse();

				if (selectedPath.indexOf(itemId) > 0)
				{
					// The selected node is a decendent of the removed node, invalidating the current selection, select the parent of the removed node to fix this
					treeControl.selectNode(parentId);
				}
				else
				{
					treeControl.highlightNode(parentId, false);
				}
			}
			break;
		case "itemupdate":
			var item = $models.getItem(itemId);
			if (item)
			{
				treeControl.renameNode(itemId, (item.getStaticTitle() || item.getTitle()));
			}
			break;
		case "load":
			this.onTreeLoaded(treeControl, parentId, event);
			break;
		case "unload":
			this.startLoadTreeControl(treeControl, parentId);
			var toNavigate = p.contextUri && (p.contextUri != parentId) && (this.getActiveTree() == treeControl);
			if (toNavigate)
			{
				if (treeControl.containsItem(p.contextUri, parentId))
				{
					var navigateTo = p.contextUri;
					p.contextUri = undefined;
					this.navigateTo(navigateTo, true);
				}
				else if (treeControl.containsItem(parentId, p.contextUri))
				{
					p.contextUri = undefined;
					this.navigateTo(parentId, true);
				}
			}
			break;
	}
};

PowerTools2011.Popups.TreeViewBase.prototype.onClosePopup = function ()
{
	this.fireEvent("close");

	window.close();
};