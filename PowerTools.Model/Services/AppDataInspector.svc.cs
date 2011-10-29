using System;
using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Xml;
using PowerTools.Common.CoreService;
using PowerTools.Model.Services.Progress;
using Tridion.ContentManager.CoreService.Client;


namespace PowerTools.Model.Services
{
	/// <summary>
	/// Service counting items inside a Publication, Folder or Structure Group.
	/// It gets item counts for individual item types: Folders, Components, Structure Groups, and/or Pages.
	/// </summary>
	[ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	[ServiceContract(Namespace = "PowerTools.Model.Services")]
	public class AppDataInspector : BaseService
	{
		class AppDataInspectorParameters
		{
			public string ItemUri { get; set; }
		}

		private AppDataInspectorData _appDataInspectorData = null;

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public ServiceProcess Execute(string itemUri)
		{
			if (string.IsNullOrEmpty(itemUri))
			{
				throw new ArgumentNullException("orgItemId has to be a valid Publication, Folder or Structure Group TCMURI");
			}

			AppDataInspectorParameters arguments = new AppDataInspectorParameters
			{
				ItemUri = itemUri
			};

			return ExecuteAsync(arguments);
		}

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public override ServiceProcess GetProcessStatus(string id)
		{
			return base.GetProcessStatus(id);
		}

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public AppDataInspectorData GetAppDataInspectorData()
		{
			return _appDataInspectorData;
		}

		public override void Process(ServiceProcess process, object arguments)
		{
			AppDataInspectorParameters parameters = (AppDataInspectorParameters)arguments;
			process.SetCompletePercentage(25);
			process.SetStatus("Initializing");

			using (var coreService = Client.GetCoreService())
			{
				process.SetCompletePercentage(50);
				process.SetStatus("Retrieving count data");

				process.Complete("Done");
			}
		}
	}
}



