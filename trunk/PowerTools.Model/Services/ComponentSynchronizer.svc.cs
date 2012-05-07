using System;
using System.Globalization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using PowerTools.Common.CoreService;
using PowerTools.Model.Exceptions;
using PowerTools.Model.Progress;
using Tridion.ContentManager.CoreService.Client;
using System.Collections;


namespace PowerTools.Model.Services
{
	[ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	[ServiceContract(Namespace = "PowerTools.Model.Services")]
	public class ComponentSynchronizer : BaseService
	{
        class CompSyncParameters
		{
			public string[] SelectedUrIs { get; set; }
			public string ReferenceComponentUri { get; set; }
			
		}

        private IList _processedItems = new ArrayList();

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public ServiceProcess Execute(string selectedUrIs, string referenceComponentUri)
		{
            if (string.IsNullOrEmpty(selectedUrIs))
			{
                throw new ArgumentNullException("selectedUrIs");
			}

            if (string.IsNullOrEmpty(referenceComponentUri))
			{
                throw new ArgumentNullException("referenceComponentUri");
			}

            selectedUrIs = selectedUrIs.Replace("[", "");
            selectedUrIs = selectedUrIs.Replace("]", "");
            selectedUrIs = selectedUrIs.Replace("\"", "");
            CompSyncParameters arguments = new CompSyncParameters { SelectedUrIs = selectedUrIs.Split(','), ReferenceComponentUri =referenceComponentUri };
			return ExecuteAsync(arguments);
		}

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public override ServiceProcess GetProcessStatus(string Id)
		{
			return base.GetProcessStatus(Id);
		}

		public override void Process(ServiceProcess process, object arguments)
		{
            CompSyncParameters parameters = (CompSyncParameters)arguments;
			if (parameters.SelectedUrIs == null)
			{
				throw new BaseServiceException(string.Format(CultureInfo.InvariantCulture, "List '{0}' is null.", parameters.SelectedUrIs));
			}

			var client = Client.GetCoreService();

			try
			{

				int i = 0;
                ComponentData ReferenceComponentData = client.Read(parameters.ReferenceComponentUri,new ReadOptions()) as ComponentData;
				
                foreach (string uri in parameters.SelectedUrIs)
				{
                    ComponentData currentComponent = client.Read(uri, new ReadOptions()) as ComponentData;
					process.SetStatus("Synchronizing: " + currentComponent.Title);
                    _processedItems.Add(uri);
                    process.SetCompletePercentage(++i * 100 / parameters.SelectedUrIs.Length);
					System.Threading.Thread.Sleep(500); // Temp, until it actually does something :)
				}
                process.SetStatus("Synchronization succesfully finished!");
                process.Complete();
                _processedItems = new ArrayList();

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



