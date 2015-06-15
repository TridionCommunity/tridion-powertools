using System;
using System.Linq;
using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Xml;
using PowerTools.Model.CoreService;
using PowerTools.Model.Progress;
using Tridion.ContentManager.CoreService.Client;
using System.Xml.Linq;

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
        private Dictionary<string, string> fileNames;
        private List<DuplicateBinariesData> _duplicateData = null; // list returned containing duplicate data

        /// <summary>
        /// DuplicateBinariesParameters
        /// PublicationId - the ID of the publication used to search through the XML
        /// </summary>
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
        public ServiceProcess Execute(string publicationId)
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
            _duplicateData = new List<DuplicateBinariesData>();
            fileNames = new Dictionary<string, string>();
            DuplicateBinariesParameters parameters = (DuplicateBinariesParameters)arguments;
            
            //_duplicateBinariesData = new DuplicateBinariesData();
            //_duplicateBinariesData.PublicationId = parameters.PublicationId;
            
            process.SetCompletePercentage(10);
            process.SetStatus("working");

            using (var coreService = Client.GetCoreService())
            {
                try
                {
                    process.SetCompletePercentage(15);
                    process.SetStatus("Creating publication filter");

                    // Create a filter to only fetch multimedia components from the publication
                    RepositoryItemsFilterData filter = new RepositoryItemsFilterData();
                    filter.ItemTypes = new[] { ItemType.Component };
                    filter.ComponentTypes = new[] { ComponentType.Multimedia };
                    XElement mmComponentsListXml = coreService.GetListXml(parameters.PublicationId, filter);
			        XNamespace tcm = "http://www.tridion.com/ContentManager/5.0";

                    double progressIncrement = mmComponentsListXml.Value.Length == 0 ? 0 : 80 / mmComponentsListXml.Value.Length; //nasty progress calculation
                    int i = 1;

                    // keep a list of all the file names from the items in the publication
                    // the if a file already exists in the filenames, it is considered a 'duplicate file name'
                    foreach(XElement itemElem in mmComponentsListXml.Descendants(tcm + "Item"))
                    {
                        string itemId = itemElem.Attribute("ID").Value;
                        string binaryFileName = GetFileNameFromComponent(coreService, itemId);
                        
                        fileNames.Add(itemId, binaryFileName);

                        int progressPercentage = (int)(20 + i * progressIncrement); // some more nasty progress calculation
                        process.SetCompletePercentage(progressPercentage);
                        i++;
                    }

                    var duplicateValues = fileNames.ToLookup(a => a.Value).
                        Where(b => b.Count() > 1);

                    // todo - refactor this below item to select the id's and values from the file
                    // name list

                    foreach (var group in duplicateValues)
                    {
                        foreach (KeyValuePair<string, string> kvp in group)
                        {
                            _duplicateData.Add(new DuplicateBinariesData
                            {
                                ItemTcmId = kvp.Key,
                                ItemFileName = kvp.Value,
                            });
                        }
                    }

                    process.Complete("Done");
                }
                catch (Exception ex)
                {
                    // TODO: Update the GUI that there has been error - solution below is temporary
                    process.Failed = true;
                    process.Complete(string.Format("Failure finding duplicate items reason: {0}", ex.Message));
                    return;
                    
                }

            }


        }

        /// <summary>
        /// Return the response object with the actual counts in it.
        /// This method returns null if the process has not completed yet.
        /// </summary>
        /// <returns>DuplicateBinaryData object with the actual list of filenames, or null if process is still running</returns>
        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public List<DuplicateBinariesData> GetDuplicateBinaryData()
        {
            return _duplicateData;
        }

        private string GetFileNameFromComponent(SessionAwareCoreServiceClient client, string componentId)
        {
            ComponentData compData = (ComponentData)client.Read(componentId, new ReadOptions());
            return compData.BinaryContent.Filename;
        }
    }
}