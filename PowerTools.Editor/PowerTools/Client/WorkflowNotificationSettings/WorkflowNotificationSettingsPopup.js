Type.registerNamespace("PowerTools.Popups");

// Construct new instance of this popup
PowerTools.Popups.WorkflowNotificationSettings = function (element) {
    Type.enableInterface(this, "PowerTools.Popups.WorkflowNotificationSettings");
    this.addInterface("Tridion.Cme.View");
};

//Gets the current user, and calls the AppData service to read the Notification AppData
PowerTools.Popups.WorkflowNotificationSettings.prototype.initialize = function () {
    //Initilize the base view
    this.callBase("Tridion.Cme.View", "initialize");
     
    //Get the current user
    var currentUser = Tridion.UI.UserSettings.getJsonUserSettings(true).User; 
       
    //Set the callback function
    var onSuccess = Function.getDelegate(this, this.showCurrentSettings);

    //Place a message in the message center
    $messages.registerNotification("Loading user workflow notification settings for " + currentUser.Data.Description);

    //Call the AppData Web Service Model to read the 'tridion-notification-framework' for the user
    PowerTools.Model.Services.AppDataServices.Read("code.google.com/p/tridion-notification-framework", currentUser["@ID"], onSuccess, null, null, false);
};

//Populates the TextArea field with the Notification AppData, and enable the save button
PowerTools.Popups.WorkflowNotificationSettings.prototype.showCurrentSettings = function (result) {


    //Load the response into an XML document
    var userSettingsXML = $xml.getNewXmlDocument(result);

    //Selectr the text area to populate
    var userSettingsTextarea = $('#UserSettings');
    var appDataString = '';
    try {
        //This works if the service has returned a value
        appDataString = new XMLSerializer().serializeToString(userSettingsXML.firstChild.firstChild);
    } catch (e) {
        //Alternativley we load the default XML from file
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open("GET", "SampleAppData.xml", false);
        xmlHTTP.send(null);
        appDataString = xmlHTTP.responseText;
    }

    //Populate the value of the text box with a Pretty Print formated XML
    try {
        //This works for FireFox
        userSettingsTextarea.value = XML(appDataString).toXMLString();
    } catch (e) {
        //For Chrome and IE we just output the text
        userSettingsTextarea.value = appDataString;
    }


    // Find the Save Button
    var c = this.properties.controls;
    c.SaveButton = $controls.getControl($("#SaveButton"), "Tridion.Controls.Button");

    //Add a onClick handler for the button
    $evt.addEventHandler(c.SaveButton, "click", this.getDelegate(this._saveAppData));

    //Enable the save button
    c.SaveButton.enable();
};

//Function for the Save button
PowerTools.Popups.WorkflowNotificationSettings.prototype._saveAppData = function () {
    //Set the callback function
    var onSuccess = Function.getDelegate(this, this._handleSave);

    //Get the uri of the current user
    var uriCurrentUser = Tridion.UI.UserSettings.getJsonUserSettings(true).User["@ID"];

    //Read the value of the text field
    var data = $('#UserSettings').value;

    //Call the Save() method in the AppData Services Model
    PowerTools.Model.Services.AppDataServices.Save("code.google.com/p/tridion-notification-framework", uriCurrentUser, data, onSuccess, null, null, false);
};

//Handles the Save reponse
PowerTools.Popups.WorkflowNotificationSettings.prototype._handleSave = function (result) {

    if (result == "true") {
    //Updates the message center and closes the window
        $messages.registerGoal("workflow notification settings saved...")
        window.close();
    } else {
    //Notifies the user of an error
        $messages.registerError("workflow notification settings could not be saved")
    }
}

// Register this popup with the framework
$display.registerView(PowerTools.Popups.WorkflowNotificationSettings);
