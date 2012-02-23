using System;
using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Xml;
using PowerTools.Common.CoreService;
using PowerTools.Model.Progress;
using Tridion.ContentManager.CoreService.Client;

namespace PowerTools.Model.Services
{
    /// <summary>
    /// service to find duplicate binary file names within multimedia
    /// components that exist in a single SDL Tridion publication.
    /// </summary>
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    [ServiceContract(Namespace = "PowerTools.Model.Services")]
    public class DuplicateBinaries : BaseService
    {
        private IDictionary<string, string> fileNames = new Dictionary<string, string>();
        private IDictionary<string, string> badFileNames = new Dictionary<string, string>();
        class DuplicateBinariesParameters
        {
            public string PublicationId { get; set; }
        }

        /// <summary>
        /// Service operation that searches all the binary components to check if some items contain the same file names.
        /// </summary>
        /// <param name="publicationId">The tcm id of the publication</param>
        /// <param name="includeBlueprinting">Boolean value </param>
        /// <returns></returns>
        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public ServiceProcess Execute(string publicationId, bool includeBlueprinting)
        {

            if (string.IsNullOrEmpty(publicationId))
            {
                throw new ArgumentNullException("Publication ID is null");
            }

            DuplicateBinariesParameters arguments = new DuplicateBinariesParameters
            {
                PublicationId = publicationId
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
            DuplicateBinariesParameters parameters = (DuplicateBinariesParameters)arguments;
			process.SetCompletePercentage(10);
            process.SetStatus("working");

            using (var coreService = Client.GetCoreService())
            {
                try
                {
                    process.SetCompletePercentage(15);
                    process.SetStatus("Creating publication filter");

                    // Create a filter to only fetch multimedia components from the publication
                    ItemsFilterData filter = new ItemsFilterData();
                    filter.ItemTypes = new[] { ItemType.Component };
                    filter.ComponentTypes = new[] { ComponentType.Multimedia };

                    XmlElement mmComponentsListXml = coreService.GetListXml(parameters.PublicationId, filter);

                    XmlNamespaceManager nsMgr = new XmlNamespaceManager(mmComponentsListXml.OwnerDocument.NameTable);
                    nsMgr.AddNamespace("tcm", "http://www.tridion.com/ContentManager/5.0");

                    foreach (XmlNode itemElem in mmComponentsListXml.SelectNodes("/tcm:item", nsMgr))
                    {
                        string itemId = itemElem.Attributes["ID"].InnerText;
                        string binaryFileName = GetFileNameFromComponent(coreService, itemId);
                        if (!fileNames.ContainsKey(binaryFileName))
                        {
                            fileNames.Add(binaryFileName, itemId);
                            //Console.WriteLine(GetFileNameFromComponent(client, itemElem.Attribute("ID").Value));
                        }
                        else
                        {
                            badFileNames.Add(binaryFileName, itemId);
                            Console.WriteLine(binaryFileName);
                        }
                    }

                    process.SetCompletePercentage(75);
                    process.SetStatus("Extracting item counts");

                    process.Complete("hi"); //mmComponentsListXml.OuterXml);
                }
                catch (Exception ex)
                {
                    process.Complete(ex.Message);
                }
            
            }


        }

        private string GetFileNameFromComponent(SessionAwareCoreService2010Client client, string componentId)
        {
            ComponentData compData = (ComponentData)client.Read(componentId, new ReadOptions());
            return "comp data = " + compData.BinaryContent.Filename;
        }
    }
}



