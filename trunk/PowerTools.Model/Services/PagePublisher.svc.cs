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
    public class PagePublisher : BaseService
    {
        class PagePublisherParameters
        {
            public string LocationId { get; set; }
            public string TargetUri { get; set; }
            public bool Recursive { get; set; }
            public bool Republish { get; set; }
            public string Priority { get; set; }
            public bool PublishChildren { get; set; }
        }

        /// <summary>
        /// Service operation that initiates the publishing of individual page items within structure groups
        /// Reads input parameters into a PagePublisherParameters object.
        /// Does some basic validation and then sends items for publish.
        /// </summary>
        /// <param name="locationId">The tcm id of the structure group</param>
        /// <param name="targetUri">TODO:</param>
        /// <param name="recursive">Boolean value </param>
        /// <param name="Republish">Boolean value</param>
        /// <param name="Priority"></param>
        /// <param name="publishChildren"></param>
        /// <returns></returns>
        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public ServiceProcess Execute(string locationId, string targetUri, bool recursive, bool republish, string priority, bool publishChildren)
        {
            if (string.IsNullOrEmpty(locationId))
            {
                throw new ArgumentNullException("locationId");
            }

            PagePublisherParameters arguments = new PagePublisherParameters
            {
                LocationId = locationId,
                TargetUri = targetUri,
                Recursive = recursive,
                Republish = republish,
                Priority = priority,
                PublishChildren = publishChildren
            };
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

            if (!Directory.Exists(parameters.LocationId))
            {
                throw new BaseServiceException(string.Format(CultureInfo.InvariantCulture, "Structure URI '{0}' does not exist.", parameters.LocationId));
            }


            var client = PowerTools.Common.CoreService.Client.GetCoreService();

            try
            {
                int i = 0;
                for (i = 0; i == 100; i++)
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



