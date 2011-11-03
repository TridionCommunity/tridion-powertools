Type.registerNamespace("PowerToolsBase");

//Constructor. Pass the current powertool as the context parameter
ProgressDialog = function (context) {
    Tridion.OO.enableInterface(this, "PowerToolsBase.ProgressDialog");

    //Load HTML from progressDialog and append it to the page. 
    //    var htmlProgressDialogUrl = $ptUtils.expandPath("PowerTools/Client/Shared/Views/ProgressDialog.htm");
    //    var htmlDialog = $ptUtils.getTemplate(htmlProgressDialogUrl);
    //    //Add HTML just before the </body> tag
    //    $j("#container").append(htmlDialog);

    //Set the context. Context is the PowerTool implementing the PowerTool baseclass
    this.powerToolContext = context;

    //Set up progressDialog behaviour. You can override the default settings in your PowerTool.
    var progressDialogProperties = {};
    progressDialogProperties.showAnimation = true; //Show animation by default
    progressDialogProperties.closeAfterComplete = false; //Don't close progressDialog after complete
    var customProgressProperties = this.powerToolContext.properties.progressDialog;
    if (customProgressProperties) {
        if (customProgressProperties.showAnimation) {
            progressDialogProperties.showAnimation = customProgressProperties.showAnimation;
        }
        if (customProgressProperties.closeAfterComplete) {
            progressDialogProperties.closeAfterComplete = customProgressProperties.closeAfterComplete;
        }
    }
    this.properties.progressDialog = progressDialogProperties;

    //Initialize closebutton   
    this._initializeCloseButton();

};

ProgressDialog.prototype._initializeProgressWindow = function () {
    var dialog = $j("#dialog");
    var win = $j(window);

    //Get the screen height and width
    var maskHeight = $j(document).height();
    var maskWidth = win.width();

    //Set height and width to mask to fill up the whole screen
    if (this.properties.progressDialog.showAnimation === true) {
        $j('#mask').css({ 'width': maskWidth, 'height': maskHeight }).fadeIn(1000).fadeTo("slow", 0.8);
    } else {
        $j('#ProgressBar').css({ 'width': '1%', 'display': 'block' });
    }


    //Get the window height and width
    var winH = win.height();
    var winW = win.width();

    //Hide close button  
    $j("#CloseDialog").hide();

    //Set the popup window to center
    dialog.css({ "top": (winH / 2 - dialog.height() / 2),
        "left": (winW / 2 - dialog.width() / 2)
    }).fadeIn(2000);
};

//Initializes close button. (Close dialog) and after that it calls the _onCloseButtonClicked from the powertool
ProgressDialog.prototype._initializeCloseButton = function () {
    var c = this.powerToolContext.properties.controls;

    c.CloseButton = $controls.getControl($("#CloseDialog"), "Tridion.Controls.Button");
    $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onDialogCloseButtonClicked));
    if (this.powerToolContext._onCloseButtonClicked) {
        $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this.powerToolContext._onCloseButtonClicked)); //Call _onCloseButtonClicked from PowerTool also. 
    }
};

ProgressDialog.prototype._onDialogCloseButtonClicked = function () {
    //Close progress-dialog
    $j('#mask, .window').hide();
    $j('#ProgressStatus').html("");
    $j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
};

ProgressDialog.prototype._pollStatus = function (id) {
    var onSuccess = Function.getDelegate(this, this._handleStatusResponse);
    var onFailure = null;
    var context = this; 

    var callback = function () {
        $log.debug("Checking the status of process #" + id);
        
        var powerToolName = context._getPowerToolName();        
        var ServiceCall = "PowerTools.Model.Services.{0}.GetProcessStatus(id, onSuccess, onFailure, context, false);".format(powerToolName);
        eval(ServiceCall); //TODO: Use a better eval method (Browser build-in or jQuery.)

    };

    var p = this.powerToolContext.properties;
    setTimeout(callback, p.pollInterval);
};

ProgressDialog.prototype._handleStatusResponse = function (result) {

    var p = this.powerToolContext.properties;
    p.processId = result.Id;
    this._updateProgressBar(result);

    if (result.PercentComplete < 100) {
        this._pollStatus(p.processId);
    }
    else {
        //Some PowerTools need to get some data from the server after the service-call is finished.
        //Define a method 'afterSuccess' and implement your logic there. (E.g. the '_getCountItemsData' from the CountItems powertool)
        if (this.powerToolContext.afterSuccess) {
            this.powerToolContext.afterSuccess(p.processId);
        }

        $j('#ProgressStatus').html(result.Status);

        if (this.properties.progressDialog.closeAfterComplete === true) {           
            this.powerToolContext.properties.controls.CloseButton.fireEvent("click");
        } else {
            $j('#CloseDialog').show();
        }
        p.processId = "";
    }
};

ProgressDialog.prototype._updateProgressBar = function (process) {
    $j('#ProgressStatus').html(process.Status);
    $j('#ProgressBar').css({ 'width': process.PercentComplete + '%', 'display': 'block' });
};

ProgressDialog.prototype._onExecuteStarted = function (result) {    
    if (result) {
        this._pollStatus(result.Id);
    }
};
