using System;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Xml;
using PowerTools.Model.Services.Progress;
using Tridion.ContentManager.CoreService.Client;


namespace PowerTools.Model.Services
{
	[ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	[ServiceContract(Namespace = "PowerTools.Model.Services")]
	public class CountItems : BaseService
	{
		class CountItemsParameters
		{
			public string OrgItemUri { get; set; }
		}

		private CountItemsData _countItemsData = null;

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public ServiceProcess Execute(string orgItemUri)
		{
			if (string.IsNullOrEmpty(orgItemUri))
			{
				throw new ArgumentNullException("orgItemId");
			}

			CountItemsParameters arguments = new CountItemsParameters { OrgItemUri = orgItemUri };
			return ExecuteAsync(arguments);
		}

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public override ServiceProcess GetProcessStatus(string id)
		{
			return base.GetProcessStatus(id);
		}

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public CountItemsData GetCountItemsData()
		{
			return _countItemsData;
		}

		public override void Process(ServiceProcess process, object arguments)
		{
			process.SetCompletePercentage(25);
			CountItemsParameters parameters = (CountItemsParameters)arguments;

			using (var client = PowerTools.Common.CoreService.Client.GetCoreService())
			{
				process.SetCompletePercentage(50);
				OrganizationalItemItemsFilterData filter = new OrganizationalItemItemsFilterData();
				filter.Recursive = true;
				XmlElement resultElem = client.GetListXml(parameters.OrgItemUri, filter);
				int items = resultElem.ChildNodes.Count;

				process.SetCompletePercentage(75);
				_countItemsData = new CountItemsData() { Components = items, Folders = 22 };

				process.Complete();
			}
		}
	}
}



