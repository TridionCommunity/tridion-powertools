using System.IO;
using PowerTools2011.Model.Services.Exceptions;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using PowerTools2011.Model.Services.Progress;
using System.Globalization;
using System;


namespace PowerTools2011.Model.Services
{
	[ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    [ServiceContract(Namespace = "PowerTools2011.Model.Services")]
	public class PagePublisher : BaseService
	{
        class PagePublisherParameters
        {
            public string StructureUri { get; set; }
            public string TargetUri { get; set; }
        }

        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public ServiceProcess Execute(string structureUri, string targetUri)
        {
            if (string.IsNullOrEmpty(structureUri))
            {
                throw new ArgumentNullException("directory");
            }

            if (string.IsNullOrEmpty(targetUri))
            {
                throw new ArgumentNullException("targetUri");
            }

            PagePublisherParameters arguments = new PagePublisherParameters { StructureUri = structureUri, TargetUri = targetUri };
            return ExecuteAsync(arguments);
        }

        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public override ServiceProcess GetProcessStatus(string Id)
        {
            return base.GetProcessStatus(Id);
        }

		public override void Process(ServiceProcess process, object arguments)
		{
            PagePublisherParameters parameters = (PagePublisherParameters)arguments;
            
            if (!Directory.Exists(parameters.StructureUri))
            {
                throw new BaseServiceException(string.Format(CultureInfo.InvariantCulture, "Structure URI '{0}' does not exist.", parameters.StructureUri));
            }

            if (!Directory.Exists(parameters.TargetUri))
            {
                throw new BaseServiceException(string.Format(CultureInfo.InvariantCulture, "Publishing Target URI '{0}' does not exist.", parameters.TargetUri));
            }

		    var client = PowerTools2011.Common.CoreService.Client.GetCoreService();

		    try
		    {
		        int i = 0;
                for(i=0; i==100; i++)
                {
                    process.SetStatus(string.Format("Publishing Page: {0} of 100", i.ToString()));
                    process.SetCompletePercentage(i);
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



