# Item Commenting tool #

The Item Commenting tool is an additional save button which allows editors of any item to "Save and Comment" on the changes they have made. The comments are saved in the AppData of the object, and visible through a new tab on the item window.


# Details #

The tool is currently configured for Components and Pages, but can be extended to support any  item type by modifying the configuration

![https://tridion-2011-power-tools.googlecode.com/svn/wiki/images/ItemCommenting.png](https://tridion-2011-power-tools.googlecode.com/svn/wiki/images/ItemCommenting.png)

There are two parts to the tool

  1. The "Save and Comment" button: this button is enabled using the existing out-of-the-box command for the "Save" button, meaning that it is only enabled once a change has actually been made. When a user clicks the button, a dialog window appears allowing the editor to leave a not on their change.
> 2) The "Change History" tab: this is an additional tab on the item window that shows the history of all the comments for an item. It shows the User, the version, the comment and the date/time the comment was left. The version number is clickable allowing you to see specific version.