using System;
using System.Globalization;
using System.IO;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
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
			public string[] SelectedURIs { get; set; }
			public string ReferenceCompoenntURI { get; set; }
			
		}

        private IList _processedItems = new ArrayList();

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public ServiceProcess Execute(string selectedURIs, string referenceComponentURI)
		{
            if (string.IsNullOrEmpty(selectedURIs))
			{
                throw new ArgumentNullException("selectedURIs");
			}

            if (string.IsNullOrEmpty(referenceComponentURI))
			{
                throw new ArgumentNullException("referenceComponentURI");
			}

            selectedURIs = selectedURIs.Replace("[", "");
            selectedURIs = selectedURIs.Replace("]", "");
            selectedURIs = selectedURIs.Replace("\"", "");
            CompSyncParameters arguments = new CompSyncParameters { SelectedURIs = selectedURIs.Split(','), ReferenceCompoenntURI =referenceComponentURI };
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
			if (parameters.SelectedURIs == null)
			{
				throw new BaseServiceException(string.Format(CultureInfo.InvariantCulture, "List '{0}' is null.", parameters.SelectedURIs));
			}

			var client = PowerTools.Common.CoreService.Client.GetCoreService();

			try
			{

				int i = 0;
                ComponentData ReferenceComponentData = client.Read(parameters.ReferenceCompoenntURI,new ReadOptions()) as ComponentData;
				
                foreach (string uri in parameters.SelectedURIs)
				{
                    ComponentData currentComponent = client.Read(uri, new ReadOptions()) as ComponentData;
					process.SetStatus("Synchronizing: " + currentComponent.Title);
                    _processedItems.Add(uri);
                    process.SetCompletePercentage(++i * 100 / parameters.SelectedURIs.Length);
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



