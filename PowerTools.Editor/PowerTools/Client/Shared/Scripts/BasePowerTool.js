Type.registerNamespace("PowerToolsBase");

var $ptConst;

//Constructor. Pass the current powertool as the context parameter
PowerToolsBase = function (context) {
    //Initialize base-class by adding some default Tridion properties/methods like 'getDelegate', 'getInterface', 'addInterface', etc. 
    Tridion.OO.enableInterface(this, "PowerToolsBase.BaseClass");    
    var p = this.properties;

    //Constants
    constants = {};
    constants.POWERTOOLS_POPUP_NS = "PowerTools.Popups";
    constants.EXECUTE_BUTTON_ID = "ExecuteButton";
    constants.CLOSE_BUTTON_ID = "CloseDialog";
    p.constants = constants;

    //Shorthand for the constants
    $ptConst = p.constants;

    //Set the context
    this.PowerToolContext = context;
    
    //Initialize Execute- and Close button
    this._initializeExecuteButton();
    this._initializeCloseButton();

};

//Initializes excecutebutton. Initializes/shows progressbar and after that it calls the _onExecuteButtonClicked method from the powertool itself.
PowerToolsBase.prototype._initializeExecuteButton = function () {
    var c = this.PowerToolContext.properties.controls;

    c.ExecuteButton = $controls.getControl($("#" + $ptConst.EXECUTE_BUTTON_ID), "Tridion.Controls.Button");
    $evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._initializeProgressWindow));
    $evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this.PowerToolContext._onExecuteButtonClicked));
};

PowerToolsBase.prototype._initializeProgressWindow = function () {

    var dialog = $j("#dialog");
    var win = $j(window);

    //Get the screen height and width
    var maskHeight = $j(document).height();
    var maskWidth = win.width();

    //Set height and width to mask to fill up the whole screen
    $j('#mask').css({ 'width': maskWidth, 'height': maskHeight }).fadeIn(1000).fadeTo("slow", 0.8);

    //Get the window height and width

    var winH = win.height();
    var winW = win.width();

    //Set the popup window to center
    dialog.css({ "top": (winH / 2 - dialog.height() / 2),
        "left": (winW / 2 - dialog.width() / 2)
    }).fadeIn(2000);
}

//Initializes close button. (Close dialog) and after that it calls the _onCloseButtonClicked from the powertool
PowerToolsBase.prototype._initializeCloseButton = function () {
    var c = this.PowerToolContext.properties.controls;
    c.CloseButton = $controls.getControl($("#" + $ptConst.CLOSE_BUTTON_ID), "Tridion.Controls.Button");
    $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onCloseButtonClicked));
    $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this.PowerToolContext._onCloseButtonClicked));
};

PowerToolsBase.prototype._onCloseButtonClicked = function () {
    $j('#mask, .window').hide();
    $j('#ProgressStatus').html("");
    $j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
};

PowerToolsBase.prototype._pollStatus = function (id) {
    var onSuccess = Function.getDelegate(this, this._handleStatusResponse);
    var onFailure = null;
    var context = this; 

    var callback = function () {
        $log.debug("Checking the status of process #" + id);

        //PowerTools.Model.Services.CountItems.GetProcessStatus(id, onSuccess, onFailure, context, false);
        //eval("PowerTools.Model.Services.CountItems.GetProcessStatus(id, onSuccess, onFailure, context, false);");
        var powerToolName = context._getPowerToolName();        
        var ServiceCall = "PowerTools.Model.Services.{0}.GetProcessStatus(id, onSuccess, onFailure, context, false);".format(powerToolName);
        eval(ServiceCall); //TODO: Use a better eval method (Browser build-in or jQuery.)

    };

    var p = this.PowerToolContext.properties;
    setTimeout(callback, p.pollInterval);
};

PowerToolsBase.prototype._handleStatusResponse = function (result) {

    var p = this.PowerToolContext.properties;
    p.processId = result.Id;
    this._updateProgressBar(result);

    if (result.PercentComplete < 100) {
        this._pollStatus(p.processId);
    }
    else {
        //Some PowerTools need to get some data from the server after the service-call is finished.
        //Define a method 'afterSuccess' and implement your logic there. (E.g. the '_getCountItemsData' from the CountItems powertool)
        if (this.PowerToolContext.afterSuccess) {
            this.PowerToolContext.afterSuccess(p.processId);
        }

        $j('#ProgressStatus').html(result.Status);
        //$j('#CloseDialog').show();
        //this._onCloseButtonClicked();
        p.processId = "";
    }
};

PowerToolsBase.prototype._updateProgressBar = function (process) {
    $j('#ProgressStatus').html(process.Status);
    $j('#ProgressBar').css({ 'width': process.PercentComplete + '%', 'display': 'block' });
};

PowerToolsBase.prototype._onExecuteStarted = function (result) {    
    if (result) {
        this._pollStatus(result.Id);
    }
};


//Find the powertool name from the namespace.
//Currently it's convention over configuration. 
//We need to decide if we want this.
PowerToolsBase.prototype._getPowerToolName = function () {
    var powerToolName;
    for (var p in this.PowerToolContext.interfaces) {
        if (p.toString().startsWith($ptConst.POWERTOOLS_POPUP_NS)) {
            var constructor = Type.resolveNamespace(p.toString());
            if (constructor) {
                powerToolName = p.toString().substring(18);
                break;
            }
        }
    }

    return powerToolName;

};

//PowerToolsBase.prototype._registerView = function () {
//    alert(" hieroot ");
//    for (var p in this.PowerToolContext.interfaces) {
//        if (p.toString().startsWith("PowerTools.Popups")) {
//            var constructor = Type.resolveNamespace(p.toString());
//            if (constructor) {
//                $display.registerView(constructor);
//                console.log("View '{0}' registered".format(p.toString()));
//                break;
//            }
//        }
//    }
//};