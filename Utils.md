# Introduction #

A lot of (power)tools need an itempicker functionality.
Luckily SDL Tridion already build one for us, so we can re-use it.
Here you can find information on how to use it in your code

# Details #

The itempicker needs some info before opening, like which itemtypes are
allowed to be selected, can there be multiple items selected, etc.
Also, after selecting an item (or multiple items at once) it need to know
where to throw the results.

Follow these steps:

1. Define a callback for the itemselector:

```
//Callback for itemselector. After the item is selected, this method is called.
PowerTools.Popups.Example.prototype._onSelected = function (event) {
    var selectedItems = event.data.items;
    $j("#SelectedItem").text(" You selected: {0}".format(selectedItems[0]));
};
```


2. Define a filter to determine which items a user may select (and some more constraints:

```
    //Define filter
    var filterDefinition = new Tridion.ContentManager.ListFilter();
    filterDefinition.conditions.ItemTypes = [$const.ItemType.FOLDER, $const.ItemType.COMPONENT];
```

This filter allows only folders and components to be selected. For more filter options see this file:

%tridion install%\web\webui\Editors\CME\Controls\ItemSelect\.
Function: Tridion.Controls.ItemSelectControl.prototype.setOptions = function ItemSelectControl$setOptions(options)


3. Open your popup

```
    //Open popup
    $ptUtils.getItemSelector(null, null, filterDefinition, true, false, this._onSelected);
```

Parameters:

  1. RootUri
> > The popup opens the treeview with this uri as the rooturi. This should be an organizational-item uri like a Publication, folder, category, etc.
  1. Pre-selected uri.
> > This (item)uri is preselected in the dashboard view from the itemselector.

  1. Your filter definition. (Which items to show, et.)

  1. SingleSelectMode. False means multiple items can be selected at once. True means only one item can be selected at once.

  1. List thumbnails. Determine if you want to show thumbnails for binaries.

  1. onSuccess. Your function to call when the user selected an item.