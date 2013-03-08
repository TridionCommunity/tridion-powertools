Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.ItemCommenting = function ()
{
    Type.enableInterface(this, "PowerTools.Commands.ItemCommenting");
    this.addInterface("PowerTools.BaseCommand", ["ItemCommenting"]);
};

PowerTools.Commands.ItemCommenting.prototype.isValidSelection = function (selection) {
    //Use the existing Save command from the CME
    return $cme.getCommand("Save")._isEnabled(selection);
}

PowerTools.Commands.ItemCommenting.prototype._execute = function (selection) {
    var item = $display.getItem();
    $evt.addEventHandler(item, "save", this.getDelegate(this._onItemSaved));
    $cme.getCommand("SaveClose")._execute(selection);
};

PowerTools.Commands.ItemCommenting.prototype._onItemSaved = function (eventitem) {

    var comment = prompt("Please enter a comment", "");

    $messages.registerNotification("Saving user comments...");

    var commentitemid = eventitem.source.getId();
    var usersettings = Tridion.UI.UserSettings.getJsonUserSettings(true);

    commenteruri = usersettings.User["@ID"];
    commentername = usersettings.User.Data.Name;
    commenterdescription = usersettings.User.Data.Description;

    var commentdate = eventitem.source.getLastModifiedDate().toString("MM/dd/yyyy HH:mm");
    var commentversion = eventitem.source.getVersion();

    //Call the service to update 
    PowerTools.Model.Services.AppDataServices.Append("ext:ItemCommenting", commentitemid, "<comment><user>" + commenterdescription + "</user><message>" + comment + "</message><datetime>" + commentdate + "</datetime><version>" + commentversion + "</version></comment>");

};

