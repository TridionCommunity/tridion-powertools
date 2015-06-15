using System;
using System.Globalization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using PowerTools.Model.Exceptions;
using PowerTools.Model.Progress;


namespace PowerTools.Model.Services
{
	[ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	[ServiceContract(Namespace = "PowerTools.Model.Services")]
	public class MarkUnpublished : BaseService
	{
		class MarkUnpublishedParameters
		{
			public string OrgItemURI { get; set; }
			public string Recursive { get; set; }
		}

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public ServiceProcess Execute(string orgItemUri, string recursive)
		{
			if (string.IsNullOrEmpty(orgItemUri))
			{
				throw new ArgumentNullException("itemUri");
			}

			if (string.IsNullOrEmpty(recursive))
			{
				throw new ArgumentNullException("recursive");
			}

			MarkUnpublishedParameters arguments = new MarkUnpublishedParameters { OrgItemURI = orgItemUri, Recursive = recursive };
			return ExecuteAsync(arguments);
		}

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public override ServiceProcess GetProcessStatus(string Id)
		{
			return base.GetProcessStatus(Id);
		}

		public override void Process(ServiceProcess process, object arguments)
		{
			MarkUnpublishedParameters parameters = (MarkUnpublishedParameters)arguments;
			if (string.IsNullOrEmpty(parameters.OrgItemURI))
			{
				throw new BaseServiceException(string.Format(CultureInfo.InvariantCulture, "parameters.OrgItemURI is null or empty"));
			}

			var client = CoreService.Client.GetCoreService();

			try
			{

				process.Complete();

			}
			finally
			{
				if (client != null)
				{
					client.Close();
				}
			}
		}
	}
}



