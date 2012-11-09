Type.registerNamespace("PowerTools.Popups");

// Construct new instance of this popup
PowerTools.Popups.WorkflowNotificationSettings = function (element) {
    Type.enableInterface(this, "PowerTools.Popups.WorkflowNotificationSettings");
    this.addInterface("Tridion.Cme.View");
};

// Attach event handling for Refresh button and initiate execution
PowerTools.Popups.WorkflowNotificationSettings.prototype.initialize = function () {
    this.callBase("Tridion.Cme.View", "initialize");
    var p = this.properties;
    var c = p.controls;
    c.SaveButton = $controls.getControl($("#SaveButton"), "Tridion.Controls.Button");
    $evt.addEventHandler(c.SaveButton, "click", this.getDelegate(this._saveAppData));
    var onSuccess = Function.getDelegate(this, this.showCurrentSettings);
    var uriCurrentUser = Tridion.UI.UserSettings.getJsonUserSettings(true).User["@ID"];
    $messages.registerNotification("loading user workflow notification settings");
    PowerTools.Model.Services.AppDataServices.Read("code.google.com/p/tridion-notification-framework", uriCurrentUser, onSuccess, null, null, false);
    c.SaveButton.enable();
};


PowerTools.Popups.WorkflowNotificationSettings.prototype._saveAppData = function () {
    var onSuccess = Function.getDelegate(this, this._handleSave);
    var uriCurrentUser = Tridion.UI.UserSettings.getJsonUserSettings(true).User["@ID"];
    var data = $('#UserSettings').value;
    PowerTools.Model.Services.AppDataServices.Save("code.google.com/p/tridion-notification-framework", uriCurrentUser, data, onSuccess, null, null, false);
};

PowerTools.Popups.WorkflowNotificationSettings.prototype._handleSave = function (result) {
    if (result == "true") {
        $messages.registerGoal("workflow notification settings saved...")
        window.close();
    } else {
        $messages.registerError("workflow notification settings could not be saved")
    }
}


PowerTools.Popups.WorkflowNotificationSettings.prototype.showCurrentSettings = function (result) {
    var userSettingsXML = $xml.getNewXmlDocument(result);
    var userSettingsTextarea = $('#UserSettings');
    var appDataString = '';
    try {
        appDataString = new XMLSerializer().serializeToString(userSettingsXML.firstChild.firstChild);
    } catch (e) {
        //Then we load the default XML
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open("GET", "SampleAppData.xml", false);
        xmlHTTP.send(null);
        appDataString = xmlHTTP.responseText;
    }
    try {
        userSettingsTextarea.value = XML(appDataString).toXMLString();
    } catch (e) {
        userSettingsTextarea.value = appDataString;
    }

};

// Register this popup with the framework
$display.registerView(PowerTools.Popups.WorkflowNotificationSettings);
