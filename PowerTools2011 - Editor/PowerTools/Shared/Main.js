/// --------------------------------------------------
/// mainScreen object
/// --------------------------------------------------
var mainScreen =
{
    result : null
}

mainScreen.Init = function() {
    /// <summary>
    /// Initializes mainScreen variables
    /// </summary>
    setTimeout("mHandlers.GetStatuses();", 500);
};
mainScreen.ExecuteCommand = function (methodName, targetMethod, parameters) {
    /// <summary>
    /// Executes method on the server
    /// </summary>
    /// <param name="methodName">
    /// Page method name
    /// </param>
    /// <param name="targetMethod">
    /// Javascript method name that will be executed on 
    /// client browser, when server returns result
    /// </param>
    /// <param name="parameters">
    /// Data to pass to the page method
    /// </param>
    PageMethods.GetStatuses(targetMethod, parameters, mainScreen.ExecuteCommandCallback, mainScreen.ExecuteCommandFailed);
};
mainScreen.DoSomething = function () {
    PageMethods.DoSomething("test", mainScreen.ExecuteCommandCallback, mainScreen.ExecuteCommandFailed);
}

mainScreen.ExecuteCommandCallback = function (result) {
    /// <summary>
    /// Is called when server sent result back
    /// </summary>
    /// <param name="result">Result of calling server command</param>
    if(result) {
        try {
            mainScreen.result = result[0];
            eval(result[1]+"(mainScreen.result);");
        } catch(err) {
            ; // TODO: Add error handling
        }
    }
};
mainScreen.ExecuteCommandFailed = function (error, userContext, methodName) {
    /// <summary>
    /// Callback function invoked on failure of the page method 
    /// </summary>
    /// <param name="error">error object containing error</param>
    /// <param name="userContext">userContext object</param>
    /// <param name="methodName">methodName object</param>
    if(error) {
        ;// TODO: add error handling, and show it to the user
    }
};


/// --------------------------------------------------
/// Page events processing
/// --------------------------------------------------

Sys.Application.add_load(applicationLoadHandler);
Sys.WebForms.PageRequestManager.getInstance().add_endRequest(endRequestHandler);
Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(beginRequestHandler);

function applicationLoadHandler() {
    /// <summary>
    /// Raised after all scripts have been loaded and 
    /// the objects in the application have been created 
    /// and initialized.
    /// </summary>

    mainScreen.Init()
}

function endRequestHandler() {
    /// <summary>
    /// Raised before processing of an asynchronous 
    /// postback starts and the postback request is 
    /// sent to the server.
    /// </summary>
    
    // TODO: Add your custom processing for event
}

function beginRequestHandler() {
    /// <summary>
    /// Raised after an asynchronous postback is 
    /// finished and control has been returned 
    /// to the browser.
    /// </summary>

    // TODO: Add your custom processing for event
}
