Type.registerNamespace("PowerTools2011.Services");

PowerTools2011.Services.ImageUploaderServiceProxy = function () //constructor for the proxy
{
	this._baseURL = $ptUtils.expandPath("/powertools/server/Services/PT_ImageUploader.svc/");
};

PowerTools2011.Services.ImageUploaderServiceProxy.prototype =
{
	Execute: function (success, error, data)
	{
		this._doAjax("Execute", data, success, error);
	},

	GetProcessStatus: function (id, success, state)
	{
		var data = { id: id };

		this._doAjax("GetProcessStatus", data, success, null, state)
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