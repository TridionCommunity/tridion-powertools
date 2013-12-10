Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.ItemCommenting = function ItemCommentingCommand$constructor()
{
    Type.enableInterface(this, "PowerTools.Commands.ItemCommenting");
    this.addInterface("PowerTools.BaseCommand", ["ItemCommenting"]);
};

PowerTools.Commands.ItemCommenting.prototype.isValidSelection = function ItemCommentingCommand$isValidSelection(selection)
{
	//Use the existing Save command from the CME
	return $cme.getCommand("Save")._isEnabled(selection);
};

PowerTools.Commands.ItemCommenting.prototype._execute = function ItemCommentingCommand$_execute(selection) 
{
    var item = $display.getItem();
    $evt.addEventHandler(item, "save", this.getDelegate(this._onItemSaved));
    $cme.getCommand("SaveClose")._execute(selection);
};

PowerTools.Commands.ItemCommenting.prototype._onItemSaved = function ItemCommentingCommand$_onItemSaved(eventitem) 
{
    var comment = prompt("Please enter a comment", "");
    $messages.registerNotification("Saving user comments...");

	var item = eventitem.source;

    var commentitemid = item.getId();
    var usersettings = Tridion.UI.UserSettings.getJsonUserSettings(true);
    var commenterdescription = usersettings.User.Data.Description;

    var commentdate = item.getLastModifiedDate().toString("MM/dd/yyyy HH:mm");
    var commentversion = item.getVersion();

    //Call the service to update
	var onFailure = this.getDelegate(this._onError);
    PowerTools.Model.Services.AppDataServices.Append("ext:ItemCommenting", commentitemid, "<comment><user>" + commenterdescription + "</user><message>" + comment + "</message><datetime>" + commentdate + "</datetime><version>" + commentversion + "</version></comment>", null, onFailure);
};


PowerTools.Commands.ItemCommenting.prototype._onError = function ItemCommentingCommand$_onError(result)
{
	$messages.registerError("Failed to save comment", result.Message || result);
};