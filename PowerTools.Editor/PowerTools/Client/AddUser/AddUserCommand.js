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
	var onFailure = this.getDelegate(this._handleFailure);
	$messages.registerProgress("Adding user...", userName, false);
	PowerTools.Model.Services.AddUser.CreateUser(userName, onSuccess, onFailure);
};

PowerTools.Commands.AddUser.prototype._handleSuccess = function AddUserCommand$_handleSuccess(result) 
{
    if (result.ErrorMessage) 
	{
        return this._handleFailure(result);
	} 

    $messages.registerGoal("User has been added.", result.UserName);
	$display.getView().refreshList();
};

PowerTools.Commands.AddUser.prototype._handleFailure = function AddUserCommand$_handleFailure(result) 
{
    $messages.registerError("Failed to add user", result.ErrorMessage);
};