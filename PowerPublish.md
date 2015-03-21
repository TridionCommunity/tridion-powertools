# Introduction #

Suggest by Mihai Cădariu

This tool would allow more functionality on the Publish activity. It provides the possibility to publish Folders, TBBs, CTs/PTs, linked Components of another Component, and in general a 'Where Used' publisher.

# Details #

The tool appears as menu item on a context menu. When a right click is performed on a Folder, TBB, CT, PT, Component, Page the menu item would be visible.

When selection is a:
  * Folder, then Components within that Folder could be published, recursive optional;
  * Schema, then items based on that Schema can be published;
  * TBB, then items using that TBB (CT/PT) can be published;
  * Component, then linked Components can be published;
  * other items, a 'Where Used' option can be selected to publish the items using the current item;

In the tool GUI, the user can select whether to publish the Where Used items, filter on the where used items (by type).

Also the tool user can select the Publication Target(s) to publish to and the Publications to publish to. The tool would also allow the user to select to which child Publications to publish to.