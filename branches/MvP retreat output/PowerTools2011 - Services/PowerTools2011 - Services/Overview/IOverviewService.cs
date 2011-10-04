using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ServiceModel;
using System.ServiceModel.Web;

namespace PowerTools2011.Services.Overview
{
	[ServiceContract(Namespace = "")]	
	public interface IOverviewService
	{
		[OperationContract, WebGet]
		StatusServiceResponse Calculate(string root);

		[OperationContract, WebGet]
		StatusServiceResponse GetCalculateProcessStatus(string processId);

		[OperationContract, WebGet]
		OverviewServiceResponse GetCalculationResult(string processId);
	}
}