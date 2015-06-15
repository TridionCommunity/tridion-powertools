using System;
using System.Globalization;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Xml.Linq;
using PowerTools.Model.Progress;
using PowerTools.Model.CoreService;
using Tridion.ContentManager.CoreService.Client;
using System.Xml;
using System.Collections.Generic;
using System.Runtime.Serialization;


namespace PowerTools.Model.Services
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    [ServiceContract(Namespace = "PowerTools.Model.Services")]
    public class PagePublisher : BaseService
    {
        /// <summary>
        /// PagePublisherData - keeps a list of all the items that either published or failed
        /// </summary>
        [DataContract]
        public class PagePublisherData
        {
            [DataMember]
            public string SuccessMessage = "";

            [DataMember]
            public string  FailedMessage = "";
        }
        
        class PagePublisherParameters
        {
            public string LocationId { get; set; }
            public string[] TargetUri { get; set; }
            public bool Recursive { get; set; }
            public bool Republish { get; set; }
            public PublishPriority Priority { get; set; }
            public bool PublishChildren { get; set; }
            public bool IncludeComponentLinks { get; set; }
            public bool IncludeStructureGroups { get; set; }
            public bool IncludeWorkflow { get; set; }
        }

        private PagePublisherData _pagePublisherData = null;

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
        public ServiceProcess Execute(string locationId, string[] targetUri, bool recursive, bool republish, int priority, bool publishChildren, bool includeComponentLinks, bool includeStructureGroups, bool includeWorkflow)
        {

            if (string.IsNullOrEmpty(locationId))
            {
                throw new ArgumentNullException("locationId is null");
            }

            PagePublisherParameters arguments = new PagePublisherParameters
            {
                LocationId = locationId,
                TargetUri = targetUri,
                Recursive = recursive,
                Republish = republish,
                Priority = (PublishPriority)priority,
                PublishChildren = publishChildren,
                IncludeComponentLinks = includeComponentLinks,
                IncludeStructureGroups = includeStructureGroups,
                IncludeWorkflow = includeWorkflow
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
			process.SetCompletePercentage(0);
            process.SetStatus("Initializing");

            using (var coreService = Client.GetCoreService())
			{
                _pagePublisherData = new PagePublisherData();
                // get a list of the items from the core service
				ItemsFilterData filter = GetFilter(parameters);
				XElement listXml = coreService.GetListXml(parameters.LocationId, filter);

                // Get the page id's that will be published
                string[] pageIds = GetPageIds(listXml);
                int batchSize = 5;
                int currentBatch = 0;
              
                // Publish pages
                try
                {
                    double ratio = pageIds.Count() /batchSize;
                    double percentage = 100/ratio;
                    double currperc = 0;
                    while (currentBatch * batchSize < pageIds.Count())
                    {
                        string[] nextBatch = pageIds.Skip(currentBatch * batchSize)
                            .Take(batchSize).ToArray();
                        coreService.Publish(nextBatch, GetPublishInstructionData(parameters), parameters.TargetUri, parameters.Priority, new ReadOptions());
                        currentBatch++;
                        currperc += percentage;
                        if (currperc >= 1)
                        {
                            process.IncrementCompletePercentage();
                            currperc = 0;
                        }
                    }
                    _pagePublisherData.SuccessMessage = string.Format("{0} Pages published successfully", pageIds.Length.ToString());
                }
                catch (Exception ex)
                {
                    //process.Complete(string.Format("Failed to publish, reason: {0}", ex.Message));
                    _pagePublisherData.FailedMessage = string.Format("Page publishing failed, reason {0}", ex.Message);
                }

                process.Complete("done");
			}
		}

        /// <summary>
        /// Extracts a list of page TCMUri from the xml list
        /// </summary>
        /// <param name="listXml"></param>
        /// <returns>A string[] array of TCM ID values</returns>
        private static string[] GetPageIds(XElement listXml)
        {
			XNamespace tcm = "http://www.tridion.com/ContentManager/5.0";

			var result = from item in listXml.Descendants(tcm + "Item")
						 let itemType = item.Attribute("Type")
						 let itemId = item.Attribute("ID")
						 where itemType != null && itemType.Value.Equals("64")
						 where itemId != null
						 select itemId.Value;

			return result.ToArray();
        }

        /// <summary>
        /// GetPublishInfoData - Creates a PublishInfoData which is used to obtain a list of publishable items.
        /// </summary>
        /// <param name="parameters">PagePublisherParameters</param>
        /// <returns>GetPublishInfoData object</returns>
        private PublishInstructionData GetPublishInstructionData(PagePublisherParameters parameters)
        {
            ResolveInstructionData resolveInstruction = new ResolveInstructionData();
            resolveInstruction.IncludeChildPublications = parameters.PublishChildren;
            resolveInstruction.IncludeComponentLinks = parameters.IncludeComponentLinks ? true : false; 
            resolveInstruction.StructureResolveOption = parameters.IncludeStructureGroups ? StructureResolveOption.ItemsAndStructure : StructureResolveOption.OnlyItems;
            resolveInstruction.IncludeWorkflow = parameters.IncludeWorkflow ? true : false;
            resolveInstruction.Purpose = parameters.Republish ? ResolvePurpose.RePublish : ResolvePurpose.Publish;

            RenderInstructionData renderInstruction = new RenderInstructionData();
            renderInstruction.RenderMode = RenderMode.PreviewDynamic;
 

            PublishInstructionData instruction = new PublishInstructionData();
            instruction.RollbackOnFailure = true;
            instruction.MaximumNumberOfRenderFailures = 1;
            instruction.ResolveInstruction = resolveInstruction;
            instruction.RenderInstruction = renderInstruction;
            return instruction;
        }

        /// <summary>
        /// GetFilter - Creates a ItemFilter which is used to obtain a list of publishable items.
        /// </summary>
        /// <param name="parameters">PagePublisherParameters</param>
        /// <returns>ItemsFilterData object</returns>
        private ItemsFilterData GetFilter(PagePublisherParameters parameters)
        {
            ItemsFilterData filter = null;
            if (parameters.LocationId.EndsWith("-1")) // is Publication
            {
                filter = new RepositoryItemsFilterData();
            }
            else // is Folder or Structure Group
            {
                filter = new OrganizationalItemItemsFilterData();
            }

            filter.Recursive = parameters.Recursive;
            List<ItemType> itemTypesList = new List<ItemType>();
            itemTypesList.Add(ItemType.Page);
            filter.ItemTypes = itemTypesList.ToArray();
            return filter;
        }

        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public PagePublisherData GetPublisherData()
        {
            return _pagePublisherData;
        }
    }
}



