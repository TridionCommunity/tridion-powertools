# How to Use the PowerTools JavaScript Base Class #

Every popup extension has shared functionality including:

  * 'Execute' and 'Close' buttons
  * WCF-call
  * Progressbar via the PowerTools base class.

Become familiar with the Anquilla framework and follow the [nononsenseguide](nononsenseguide.md) to build your own PowerTool.

## Setting up your PowerTool ##
To ensure your popup PowerTools extension is available in the right namespace, use `PowerTools.Popups`.

Start your  code with:
```
Type.registerNamespace("PowerTools.Popups");
```

Next create your constructor:

```
PowerTools.Popups.ImageUploader = function ()
{
    Type.enableInterface(this, "PowerTools.Popups.ImageUploader");
    this.addInterface("Tridion.Cme.View");
    
    //Base class for initializing execute-,close button, and progressbar.
    this.addInterface("PowerToolsBase", [this]); 
    
    var p = this.properties;

    p.processId = null;
    p.folderId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
};
```

Name your PowerTools extension correctly. This name (in this case 'ImageUploader') must match the WCF-class name **exactly!**
For example, the ImageUploader WCF class looks like this:

```
//Attributes...
public class ImageUploader : BaseService
{
      // ....implementation
}                         
```

The base class calls this service class to show and update the progressbar. That's why the name of your PowerTools extension must match in your javascript-constructor and WCF-classname.

Initialize the PowerToosl javascript base-class with the following code in your constructor:

```
this.addInterface("PowerToolsBase", [this]); 
```

`addInterface` is an Anguilla framework JavaScript method that adds all the methods from the (in this case) PowerToolsBase class to the current class (the ImageUploader). This lets the ImageUploader class (object) call methods from the PowerToolsBase class.

Next, your PowerTools extension must implement the following methods:

#### initialize ####

Example:

```
PowerTools.Popups.ImageUploader.prototype.initialize = function () {

    $log.message("initializing ImageUploader popup...");

    this.callBase("Tridion.Cme.View", "initialize");

    var p = this.properties;
    var c = p.controls;
    
    p.folderId = $url.getHashParam("folderId");
    
    c.SchemaControl = $controls.getControl($("#Schema"), "Tridion.Controls.Dropdown");
    $evt.addEventHandler(c.SchemaControl, "loadcontent", this.getDelegate(this.onSchemaLoadContent));
};

```

The Anguilla framework calls the initial method to initialize (...) your PowerTool. Typically you add code to set properties/constants then wire up the controls.

#### Execute and Close button ####
The baseclass wires up the "Execute" and "Close" buttons for you. Simply implement  the following method to determine your extension's actions when the user clicks on the Execute button.

This is achieved by implementing

```
PowerTools.Popups.ImageUploader.prototype._onExecuteButtonClicked = function () {   
   //Do/read some variables/settings/properties...
  var p = this.properties;
  //...'

  //Call the WCF service:
  PowerTools.Model.Services.ImageUploader.Execute(localDirectory, p.folderId, schemaUri, onSuccess, onFailure, context, false);
  
};
```

To excute additional logic after the user clicks the close button, use the following method:

```
PowerTools.Popups.ImageUploader.prototype._onCloseButtonClicked = function ()
{
   //Do stuff
};
```
This event is optional.

#### afterSuccess ####
To return data back to the screen via your WCF Service (like the CountItems PowerTool) optionally implement the following method:

```
PowerTools.Popups.ImageUploader.prototype.afterSuccess = function (processId) {
    //Optional method: called after the service-call was finished (100%). Useful for getting data that was gathered/stored by the service-call
};
```

After the WCF call finishes, the baseclass calls this method (if it exists). You can implement your logic here to get the data from the server and perform your logic. See the CountItems powertool for an example of this functionality.

#### Progress Dialog settings ####
You can influence the behavior of the progress-dialog by setting the following properties in your constructor.

  * showAnimation
Possible values: true or false
This defines if the progress-dialog fades in and out when the user clicks the execute button

  * closeAfterComplete
Possible values: true or false
True means that the progress-dialog automatically closes after the service-call is finished. False means that the 'close' button appears on the progressbar when the
service-call is finished. The user has to click on this button the close the
progress-dialog.

The name of the property to set is: progressDialog.

Example:
```
var p = this.properties;
p.progressDialog = { showAnimation: false, closeAfterComplete: true };
```

Use the Base Class if your tool shows in a popup, has an 'Execute' and 'Close' button, and needs a progressbar while interacting with a WCF service.