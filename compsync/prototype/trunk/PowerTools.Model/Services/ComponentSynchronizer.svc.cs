using System;
using System.Globalization;
using System.IO;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using PowerTools.Model.Services.Exceptions;
using PowerTools.Model.Services.Progress;


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

				foreach (string uri in parameters.SelectedURIs)
				{
					process.SetStatus("Synchronizing Component: " + uri);
                    process.SetCompletePercentage(++i * 100 / parameters.SelectedURIs.Length);
					System.Threading.Thread.Sleep(500); // Temp, until it actually does something :)
				}

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



