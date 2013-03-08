Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.WorkflowNotificationSettings = function ()
{
    Type.enableInterface(this, "PowerTools.Commands.WorkflowNotificationSettings");
    this.addInterface("PowerTools.BaseCommand", ["WorkflowNotificationSettings"]);
};

PowerTools.Commands.WorkflowNotificationSettings.prototype.isValidSelection = function (selection) {
    //Use the existing Save command from the CME
    return true;
}

PowerTools.Commands.WorkflowNotificationSettings.prototype._execute = function (selection) {
    var popUpUrl = $ptUtils.expandPath("/PowerTools/Client/WorkflowNotificationSettings/WorkflowNotificationSettingsPopup.aspx");
    var popup = $popup.create(popUpUrl, "toolbar=no,width=700px,height=500px,resizable=false,scrollbars=false", null);
    popup.open();
};

