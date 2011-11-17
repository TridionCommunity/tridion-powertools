using System;
using System.Globalization;
using System.IO;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using PowerTools.Model.Services.Exceptions;
using PowerTools.Model.Services.Progress;
using PowerTools.Common.CoreService;
using Tridion.ContentManager.CoreService.Client;
using System.Xml;


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
        //public ServiceProcess Execute(string locationId, string targetUri, bool recursive, bool republish, string priority, bool publishChildren)
        public ServiceProcess Execute(string locationId)
        {
            //PowerTools.Model.Services.PagePublisher.Execute(p.locationId, p.SelectedTarget, p.Recursive, p.Republish, p.Priority, p.PublishChildren);
            if (string.IsNullOrEmpty(locationId))
            {
                throw new ArgumentNullException("locationId");
            }

            PagePublisherParameters arguments = new PagePublisherParameters
            {
                LocationId = locationId,
                TargetUri = "targetUri",
                Recursive = true, //recursive,
                Republish = true, //republish,
                Priority = "priority",
                PublishChildren = true //publishChildren
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
			process.SetCompletePercentage(25);
			process.SetStatus("Initializing");

			using (var coreService = Client.GetCoreService())
			{
				//ItemsFilterData filter = GetFilter(parameters);
				process.SetCompletePercentage(50);
				process.SetStatus("Retrieving count data");

				//XmlElement listXml = coreService.GetListXml(parameters.OrgItemUri, filter);
				process.SetCompletePercentage(75);
				process.SetStatus("Extracting item counts");

				//ProcessCounts(parameters, listXml);
				process.Complete("Done");
			}
		}
    }
}



