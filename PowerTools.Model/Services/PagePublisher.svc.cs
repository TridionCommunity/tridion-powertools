using System;
using System.Globalization;
using System.IO;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using PowerTools.Model.Progress;
using PowerTools.Model.Services.Progress;
using PowerTools.Common.CoreService;
using Tridion.ContentManager.CoreService.Client;
using System.Xml;
using System.Collections.Generic;


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
            public string[] TargetUri { get; set; }
            public bool Recursive { get; set; }
            public bool Republish { get; set; }
            public PublishPriority Priority { get; set; }
            public bool PublishChildren { get; set; }
            public bool IncludeComponentLinks { get; set; }
            public bool IncludeStructureGroups { get; set; }
            public bool IncludeWorkflow { get; set; }
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
			process.SetCompletePercentage(25);
			process.SetStatus("Initializing");		
            using (var coreService = Client.GetCoreService())
			{
                // get a list of the items from the core service
				ItemsFilterData filter = GetFilter(parameters);
				XmlElement listXml = coreService.GetListXml(parameters.LocationId, filter);

                // Get the page id's that will be published
                string[] pageIds = GetPageIds(listXml);

                // Publish pages
                try
                {
                    coreService.Publish(pageIds, GetPublishInstructionData(parameters), parameters.TargetUri, parameters.Priority, new ReadOptions());
                    process.Complete(string.Format("Completed publishing {0} pages", pageIds.Length.ToString()));
                }
                catch (Exception ex)
                {
                    process.Complete(string.Format("Failed to publish, reason: {0}", ex.Message));
                }
			}
		}

        /// <summary>
        /// Extracts a list of page TCMUri from the xml list
        /// </summary>
        /// <param name="listXml"></param>
        /// <returns>A string[] array of TCM ID values</returns>
        private string[] GetPageIds(XmlElement listXml)
        {
            XmlNamespaceManager nsMgr = new XmlNamespaceManager(listXml.OwnerDocument.NameTable);
            nsMgr.AddNamespace("tcm", "http://www.tridion.com/ContentManager/5.0");
            XmlNodeList pageNodes = listXml.SelectNodes("/tcm:Item[@Type='64']", nsMgr);

            List<string> pageIds = new List<string>();
            if (pageNodes != null)
            {
                foreach (XmlNode pageNode in pageNodes)
                {
                    pageIds.Add(pageNode.Attributes["ID"].Value);
                }
            }
            return pageIds.ToArray();
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
    }
}



