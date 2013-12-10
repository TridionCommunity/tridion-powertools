Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.AddUser = function AddUserCommand$constructor() 
{
    Type.enableInterface(this, "PowerTools.Commands.AddUser");
    this.addInterface("PowerTools.BaseCommand", ["AddUser"]);
};

PowerTools.Commands.AddUser.prototype.isValidSelection = function AddUserCommand$isValidSelection(selection) 
{
    return Tridion.Cme.Commands.New.prototype._canCreateUser(selection);
}

PowerTools.Commands.AddUser.prototype._execute = function AddUserCommand$_execute(selection) 
{
    var userName = prompt("Please enter a username e.g. 'DOMAIN\\USER'", "");
    var onSuccess = this.getDelegate(this._handleSuccess);
    $messages.registerProgress("Adding user...", userName, false);
    PowerTools.Model.Services.AddUser.CreateUser(userName, onSuccess, this.getErrorHandler());
};

PowerTools.Commands.AddUser.prototype._handleSuccess = function AddUserCommand$_handleSuccess(result) 
{
    if (result.ErrorMessage == undefined) 
	{
        $messages.registerGoal("AddUser Powertool: created " + result.UserName);
	    $display.getView().refreshList();
	    //$cme.getCommand("Refresh")._execute();

	} 
	else 
	{
        $messages.registerError("AddUser Powertool: "+ result.ErrorMessage);
    }
};

PowerTools.Commands.AddUser.prototype._handleFailure = function AddUserCommand$_handleFailure(result) 
{
    $messages.registerError("AddUser Powertool: " + result.ErrorMessage);
};