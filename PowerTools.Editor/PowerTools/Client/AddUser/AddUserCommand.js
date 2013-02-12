Type.registerNamespace("PowerTools.Commands");

PowerTools.Commands.AddUser = function () {
    Type.enableInterface(this, "PowerTools.Commands.AddUser");
    this.addInterface("PowerTools.BaseCommand", ["AddUser"]);
};

PowerTools.Commands.AddUser.prototype.isValidSelection = function (selection) {
    return Tridion.Cme.Commands.New.prototype._canCreateUser(selection);
}

PowerTools.Commands.AddUser.prototype._execute = function (selection) {
    var userName = prompt("Please enter a username e.g. 'DOMAIN\\USER'", "");
    var onFailure = Function.getDelegate(this, this._handleFailure);
    var onSuccess = Function.getDelegate(this, this._handleSuccess);
    var context = null;
    $messages.registerNotification("AddUser Powertool: Attempting to create new user '" + userName + "'");
    PowerTools.Model.Services.AddUser.CreateUser(userName, onSuccess, onFailure, context, false);
};

PowerTools.Commands.AddUser.prototype._handleSuccess = function (result) {
    if (result.ErrorMessage == undefined) {
        $messages.registerGoal("AddUser Powertool: created " + result.UserName);
        $display.getView().refreshList()
        //$cme.getCommand("Refresh")._execute();
        
    } else {
        $messages.registerError("AddUser Powertool: "+ result.ErrorMessage);
    }
};

PowerTools.Commands.AddUser.prototype._handleFailure = function (result) {
    $messages.registerError("AddUser Powertool: " + result.ErrorMessage);
};