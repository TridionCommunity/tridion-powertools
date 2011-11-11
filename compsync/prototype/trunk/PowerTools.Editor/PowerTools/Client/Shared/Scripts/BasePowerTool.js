Type.registerNamespace("PowerToolsBase");

//Constructor. Pass the current powertool as the context parameter
PowerToolsBase = function (context) {
    //Initialize base-class by adding some default Tridion properties/methods like 'getDelegate', 'getInterface', 'addInterface', etc. 
    Tridion.OO.enableInterface(this, "PowerToolsBase.BaseClass");
   
    //Set the context. Context is the PowerTool implementing this baseclass
    this.powerToolContext = context;

    //Add progressDialog methods
    this.addInterface("ProgressDialog", [this.powerToolContext]);

    var p = this.properties;
   
    //Constants
    //        var consts = {};
    //        consts.POWERTOOLS_POPUP_NS = "PowerTools.Popups";
    //        consts.EXECUTE_BUTTON_ID = "ExecuteButton";
    //        p.const = constants;
    
    var constants = {
        POWERTOOLS_POPUP_NS: "PowerTools.Popups",
        EXECUTE_BUTTON_ID: "ExecuteButton"
    };
    cc = constants;
    

    //Initialize Execute- and Close button
    this._initializeExecuteButton();

};

//Initializes excecutebutton. Initializes/shows progressbar and after that it calls the _onExecuteButtonClicked method from the powertool itself.
PowerToolsBase.prototype._initializeExecuteButton = function () {
    var c = this.powerToolContext.properties.controls;
    var controlSelector = "#ExecuteButton";
    c.ExecuteButton = $controls.getControl($(controlSelector), "Tridion.Controls.Button");
    $evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._initializeProgressWindow));
    if (this.powerToolContext._onExecuteButtonClicked) {
        $evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this.powerToolContext._onExecuteButtonClicked));
    } else {
        $assert.raiseError("Powertool '{0}' does not implement method '_onExecuteButtonClicked'. Implement this method in your PowerTool".format(this._getPowerToolName()));
    }


};

//Find the powertool name from the namespace.
//Currently it's convention over configuration. 
//We need to decide if we want this.
PowerToolsBase.prototype._getPowerToolName = function () {
    console.log("Finding powertoolname...");
    var powerToolName;
    for (var p in this.powerToolContext.interfaces) {
        if (p.toString().startsWith(cc.POWERTOOLS_POPUP_NS)) {
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
//    for (var p in this.powerToolContext.interfaces) {
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