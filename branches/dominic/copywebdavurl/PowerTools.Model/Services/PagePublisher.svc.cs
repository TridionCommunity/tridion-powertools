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
        public ServiceProcess Execute(string locationId, string[] targetUri, bool recursive, bool republish, int priority, bool publishChildren)
        {

            if (string.IsNullOrEmpty(locationId))
            {
                throw new ArgumentNullException("locationId is null");
            }

            // if we are not a structure group kick off!
            if (!locationId.EndsWith("-4"))
            {
                throw new ArgumentNullException("locationId is not a valid structure group");
            }

            PagePublisherParameters arguments = new PagePublisherParameters
            {
                LocationId = locationId,
                TargetUri = targetUri,
                Recursive = recursive,
                Republish = republish,
                Priority = (PublishPriority)priority,
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
                    //process.SetStatus(string.Format("Publishing page: {0} - {1}", pageNode.Attributes["Title"].Value, pageNode.Attributes));
                    pageIds.Add(pageNode.Attributes["ID"].Value);
                }
            }
            return pageIds.ToArray();
        }

        private void ProcessPages(ServiceProcess process, XmlElement listXml)
        {
            XmlNamespaceManager nsMgr = new XmlNamespaceManager(listXml.OwnerDocument.NameTable);
            nsMgr.AddNamespace("tcm", "http://www.tridion.com/ContentManager/5.0");

            XmlNodeList pageNodes = listXml.SelectNodes("/tcm:Item[@Type='64']", nsMgr);

            if (pageNodes != null)
            {
                foreach (XmlNode pageNode in pageNodes)
                {
                    process.SetStatus(string.Format("Publishing page: {0} - {1}", pageNode.Attributes["Title"].Value, pageNode.Attributes));
                }
            }
            else
            {
                process.Complete("There are no pages to publish - process complete");
            }

            string listXMLtest = listXml.OuterXml.Replace("<", "[");
            listXMLtest = listXMLtest.Replace(">", "]");
            process.Complete(listXMLtest);


            /*
            [tcm:ListItems Managed="68" ID="tcm:8-3-4" xmlns:tcm="http://www.tridion.com/ContentManager/5.0"]
             * [tcm:Item ID="tcm:8-15-4" Title="_Sample pages" Type="4" Modified="2011-05-06T15:40:58" FromPub="040 Structure" IsNew="false" Icon="T4L0P0" /]
             * [tcm:Item ID="tcm:8-26-4" Title="010 about" Type="4" Modified="2011-05-24T20:31:20" IsNew="false" Icon="T4L0P0" /]
             * [tcm:Item ID="tcm:8-27-4" Title="020 contact" Type="4" Modified="2011-05-24T20:31:07" IsNew="false" Icon="T4L0P0" /]

             * [tcm:Item ID="tcm:8-79-64" Title="index" Type="64" Modified="2011-10-03T21:52:43" IsNew="false" Icon="T64L0P1" /]
             * [tcm:Item ID="tcm:8-82-64" Title="010 index" Type="64" Modified="2011-09-26T20:40:42" IsNew="false" Icon="T64L0P0" /]
             * [tcm:Item ID="tcm:8-84-64" Title="dynamic" Type="64" Modified="2011-10-18T11:32:53" IsNew="false" Icon="T64L0P1" /]
             * [tcm:Item ID="tcm:8-85-64" Title="010 contact" Type="64" Modified="2011-06-09T02:12:03" IsNew="false" Icon="T64L0P1" /]
             * [tcm:Item ID="tcm:8-104-64" Title="TaxonomyPage" Type="64" Modified="2011-10-19T11:55:21" IsNew="false" Icon="T64L0P1" /]
             * [tcm:Item ID="tcm:8-105-64" Title="Page using new style PT w legacy CT" Type="64" Modified="2011-07-13T15:10:47" IsNew="false" Icon="T64L0P0" /]
             * [/tcm:ListItems]
 
            */


            
        }

        /// <summary>
        /// GetPublishInfoData - Creates a PublishInfoData which is used to obtain a list of publishable items.
        /// </summary>
        /// <param name="parameters">PagePublisherParameters</param>
        /// <returns>GetPublishInfoData object</returns>
        private PublishInstructionData GetPublishInstructionData(PagePublisherParameters parameters)
        {
            ResolveInstructionData resolveInstruction = new ResolveInstructionData();
            resolveInstruction.IncludeComponentLinks = true; // TODO: add an option to specify to include / exclude this option
            resolveInstruction.IncludeChildPublications = parameters.PublishChildren;
            resolveInstruction.StructureResolveOption = StructureResolveOption.OnlyItems;
            resolveInstruction.IncludeWorkflow = false;
            if (parameters.Republish)
            {
                resolveInstruction.Purpose = ResolvePurpose.RePublish;
            }
            else
            {
                resolveInstruction.Purpose = ResolvePurpose.Publish;
            }

            RenderInstructionData renderInstruction = new RenderInstructionData();
            renderInstruction.RenderMode = RenderMode.Publish;

            PublishInstructionData instruction = new PublishInstructionData();

            //instruction.DeployAt = DateTime.Now;
            instruction.RollbackOnFailure = true;

            instruction.MaximumNumberOfRenderFailures = 1;
            //instruction.StartAt = DateTime.Now;
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



