using System;
using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Xml;
using PowerTools.Common.CoreService;
using PowerTools.Model.Services.Progress;
using Tridion.ContentManager.CoreService.Client;


namespace PowerTools.Model.Services
{
	/// <summary>
	/// Service counting items inside a Publication, Folder or Structure Group.
	/// It gets item counts for individual item types: Folders, Components, Structure Groups, and/or Pages.
	/// </summary>
	[ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	[ServiceContract(Namespace = "PowerTools.Model.Services")]
	public class CountItems : BaseService
	{
		class CountItemsParameters
		{
			public string OrgItemUri { get; set; }
			public bool CountFolders { get; set; }
			public bool CountComponents { get; set; }
			public bool CountSchemas { get; set; }
			public bool CountComponentTemplates { get; set; }
			public bool CountPageTemplates { get; set; }
			public bool CountTemplateBuildingBlocks { get; set; }
			public bool CountStructureGroups { get; set; }
			public bool CountPages { get; set; }
			public bool CountCategories { get; set; }
			public bool CountKeywords { get; set; }
		}

		private CountItemsData _countItemsData = null;

		/// <summary>
		/// Service operation that initiates the retrieval of item counts asynchronously.
		/// Reads input parameters into a CountItemsParameters object.
		/// Does basic validation on the orgItemUri - throws argument exception if not valid Publication, Folder or Structure Group TcmUri
		/// </summary>
		/// <param name="orgItemUri">TcmUri of the parent item to retrieve counts for items underneath it</param>
		/// <param name="countFolders">bool flag to count Folder items</param>
		/// <param name="countComponents">bool flag to count Component items</param>
		/// <param name="countStructureGroups">bool flag to count Structure Group items</param>
		/// <param name="countPages">bool flag to count Page items</param>
		/// <returns>the newly created async ServiceProcess</returns>
		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public ServiceProcess Execute(string orgItemUri, bool countFolders, bool countComponents, bool countSchemas,
				bool countComponentTemplates, bool countPageTemplates, bool countTemplateBuildingBlocks,
				bool countStructureGroups, bool countPages, bool countCategories, bool countKeywords)
		{
			if (string.IsNullOrEmpty(orgItemUri))
			{
				throw new ArgumentNullException("orgItemId has to be a valid Publication, Folder or Structure Group TCMURI");
			}

			if (orgItemUri.EndsWith("-2")) // is Folder
			{
				countStructureGroups = false;
				countPages = false;
				countCategories = false;
				countKeywords = false;
			}
			else if (orgItemUri.EndsWith("-4")) // is Structure Group
			{
				countFolders = false;
				countComponents = false;
				countSchemas = false;
				countComponentTemplates = false;
				countPageTemplates = false;
				countTemplateBuildingBlocks = false;
				countCategories = false;
				countKeywords = false;
			}
			else if (orgItemUri.EndsWith("-512") || orgItemUri.StartsWith("catman-")) // is Category
			{
				orgItemUri = orgItemUri.StartsWith("catman-") ? orgItemUri.Substring(7) : orgItemUri;
				countFolders = false;
				countComponents = false;
				countSchemas = false;
				countComponentTemplates = false;
				countPageTemplates = false;
				countTemplateBuildingBlocks = false;
				countStructureGroups = false;
				countPages = false;
			}
			else if (!orgItemUri.EndsWith("-1")) // is not Publicaation
			{
				throw new ArgumentException("orgItemId has to be a valid Publication, Folder or Structure Group TCMURI");
			}

			CountItemsParameters arguments = new CountItemsParameters
			{
				OrgItemUri = orgItemUri,
				CountFolders = countFolders,
				CountComponents = countComponents,
				CountSchemas = countSchemas,
				CountComponentTemplates = countComponentTemplates,
				CountPageTemplates = countPageTemplates,
				CountTemplateBuildingBlocks = countTemplateBuildingBlocks,
				CountStructureGroups = countStructureGroups,
				CountPages = countPages,
				CountCategories = countCategories,
				CountKeywords = countKeywords
			};

			return ExecuteAsync(arguments);
		}

		/// <summary>
		/// Contract method providing the 'current' progress status of the process
		/// </summary>
		/// <param name="id">String - process id</param>
		/// <returns>ServiceProcess containing the current progress data</returns>
		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public override ServiceProcess GetProcessStatus(string id)
		{
			return base.GetProcessStatus(id);
		}

		/// <summary>
		/// Return the response object with the actual counts in it.
		/// This method returns null if the process has not completed yet.
		/// </summary>
		/// <returns>CountItemsData object with the actual counts, or null if process is still running</returns>
		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public CountItemsData GetCountItemsData()
		{
			return _countItemsData;
		}

		/// <summary>
		/// Contains actual processing logic: instantiates a CoreService client, queries for item list,
		/// then sets the actual response counts data object, while updating the progress all along.
		/// </summary>
		/// <param name="process">the current ServiceProcess</param>
		/// <param name="arguments">CountItemsParameters arguments</param>
		public override void Process(ServiceProcess process, object arguments)
		{
			CountItemsParameters parameters = (CountItemsParameters)arguments;
			process.SetCompletePercentage(25);
			process.SetStatus("Initializing");

			using (var coreService = Client.GetCoreService())
			{
				ItemsFilterData filter = GetFilter(parameters);
				process.SetCompletePercentage(50);
				process.SetStatus("Retrieving count data");

				XmlElement listXml = coreService.GetListXml(parameters.OrgItemUri, filter);
				process.SetCompletePercentage(75);
				process.SetStatus("Extracting item counts");

				ProcessCounts(parameters, listXml);
				process.Complete("Done");
			}
		}

		/// <summary>
		/// Extract the actual counts from the XML.
		/// Only read the counts for the item types that were requested to improve performance.
		/// Set the response _countItemsData object.
		/// </summary>
		private void ProcessCounts(CountItemsParameters parameters, XmlElement listXml)
		{
			XmlNamespaceManager nsMgr = new XmlNamespaceManager(listXml.OwnerDocument.NameTable);
			nsMgr.AddNamespace("tcm", "http://www.tridion.com/ContentManager/5.0");

			int folderCount = parameters.CountFolders ? listXml.SelectNodes("/tcm:Item[@Type='2']", nsMgr).Count : 0;
			int componentCount = parameters.CountComponents ? listXml.SelectNodes("/tcm:Item[@Type='16']", nsMgr).Count : 0;
			int schemaCount = parameters.CountSchemas ? listXml.SelectNodes("/tcm:Item[@Type='8']", nsMgr).Count : 0;
			int componentTemplateCount = parameters.CountComponentTemplates ? listXml.SelectNodes("/tcm:Item[@Type='32']", nsMgr).Count : 0;
			int pageTemplateCount = parameters.CountPageTemplates ? listXml.SelectNodes("/tcm:Item[@Type='128']", nsMgr).Count : 0;
			int templateBuildingBlockCount = parameters.CountTemplateBuildingBlocks ? listXml.SelectNodes("/tcm:Item[@Type='2048']", nsMgr).Count : 0;
			int structureGroupCount = parameters.CountStructureGroups ? listXml.SelectNodes("/tcm:Item[@Type='4']", nsMgr).Count : 0;
			int pageCount = parameters.CountPages ? listXml.SelectNodes("/tcm:Item[@Type='64']", nsMgr).Count : 0;
			int categoryCount = parameters.CountCategories ? listXml.SelectNodes("/tcm:Item[@Type='512']", nsMgr).Count : 0;
			int keywordCount = parameters.CountKeywords ? listXml.SelectNodes("/tcm:Item[@Type='1024']", nsMgr).Count : 0;

			_countItemsData = new CountItemsData()
			{
				Folders = folderCount,
				Components = componentCount,
				Schemas = schemaCount,
				ComponentTemplates = componentTemplateCount,
				PageTemplates = pageTemplateCount,
				TemplateBuildingBlocks = templateBuildingBlockCount,
				StructureGroups = structureGroupCount,
				Pages = pageCount,
				Categories = categoryCount,
				Keywords = keywordCount
			};
		}

		/// <summary>
		/// Create an ItemsFilter for the given Organizational Item type by either instantiating a
		/// RepositoryItemsFilterData (for Publication) or OrganizationalItemItemsFilterData (for Folder or SG).
		/// Populates the ItemTypes property with only the types that were requested to improve performance.
		/// </summary>
		private ItemsFilterData GetFilter(CountItemsParameters parameters)
		{
			ItemsFilterData filter = null;
			if (parameters.OrgItemUri.EndsWith("-1")) // is Publication
			{
				filter = new RepositoryItemsFilterData();
			}
			else // is Folder or Structure Group
			{
				filter = new OrganizationalItemItemsFilterData();
			}

			filter.Recursive = true;

			List<ItemType> itemTypesList = new List<ItemType>();
			if (parameters.CountFolders) { itemTypesList.Add(ItemType.Folder); }
			if (parameters.CountComponents) { itemTypesList.Add(ItemType.Component); }
			if (parameters.CountSchemas) { itemTypesList.Add(ItemType.Schema); }
			if (parameters.CountComponentTemplates) { itemTypesList.Add(ItemType.ComponentTemplate); }
			if (parameters.CountPageTemplates) { itemTypesList.Add(ItemType.PageTemplate); }
			if (parameters.CountTemplateBuildingBlocks) { itemTypesList.Add(ItemType.TemplateBuildingBlock); }
			if (parameters.CountStructureGroups) { itemTypesList.Add(ItemType.StructureGroup); }
			if (parameters.CountPages) { itemTypesList.Add(ItemType.Page); }
			if (parameters.CountCategories) { itemTypesList.Add(ItemType.Category); }
			if (parameters.CountKeywords) { itemTypesList.Add(ItemType.Keyword); }

			filter.ItemTypes = itemTypesList.ToArray();

			return filter;
		}
	}
}



