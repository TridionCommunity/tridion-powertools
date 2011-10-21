//Type.registerNamespace("PowerTools2011.Services");
var PowerTools2011 = {};
PowerTools2011.Services = {};

PowerTools2011.Services.OverviewServiceProxy = function () //constructor for the proxy
{
	this._baseURL = "http://cms/WebUI/Editors/powertools2011/powertools/server/overview/OverviewService.svc/";
	//$ptUtils.expandPath("/powertools/server/overview/overviewservice.svc/"); 
};

PowerTools2011.Services.OverviewServiceProxy.prototype =
{
	calculate: function (root, success, error)
	{
		var data = { "root": root };

		this._doAjax("Calculate", data, success, error);
	},

	getProcessStatus: function (procId, success, error)
	{
		var data = { "processId": procId };

		this._doAjax("GetCalculateProcessStatus", data, success, error);
	},

	getResult: function(procId, success, error)
	{
		var data = { "processId": procId };

		this._doAjax("GetCalculationResult", data, success, error);
	},

	_defaultErrorHandler: function (xhr, status, error)
	{
		alert(xhr.statusText);
	},

	_doAjax: function (method, data, fnSuccess, fnError, state)
	{
		if (!data) data = {};

		if (!fnError) fnError = this._defaultErrorHandler;

		$j.ajax({
			type: "GET",
			url: this._baseURL + method,
			data: data,
			contentType: "application/json; charset=utf-8",
			context: state,
			dataType: "json",
			success: function (data, textStatus, jqXHR)
			{
				//if (data.hasOwnProperty("d")) data = data.d;
				fnSuccess(data, this); //pass the context to the callback!
			},
			error: fnError
		});
	}
};