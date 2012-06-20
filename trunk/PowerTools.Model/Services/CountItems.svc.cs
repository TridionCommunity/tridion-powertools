using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Xml;
using System.Xml.Linq;
using PowerTools.Common.CoreService;
using PowerTools.Model.Progress;
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

		protected CountItemsData _countItemsData;


		/// <summary>
		/// Service operation that initiates the retrieval of item counts asynchronously.
		/// Reads input parameters into a CountItemsParameters object.
		/// Does basic validation on the <paramref name="orgItemId"/> - throws argument exception if not valid Publication, Folder or Structure Group TcmUri.
		/// </summary>
		/// <param name="orgItemId">The ID of the parent item to count items within.</param>
		/// <param name="countFolders">Set to <code>true</code> to count the number of Folders.</param>
		/// <param name="countComponents">Set to <code>true</code> to count the number of Components.</param>
		/// <param name="countTemplateBuildingBlocks">Set to <code>true</code> to count the number of Template Building Blocks.</param>
		/// <param name="countStructureGroups">Set to <code>true</code> to count the number of Structure Groups.</param>
		/// <param name="countPages">Set to <code>true</code> to count the number of Pages.</param>
		/// <param name="countSchemas">Set to <code>true</code> to count the number of Schemas.</param>
		/// <param name="countComponentTemplates">Set to <code>true</code> to count the number of Component Templates.</param>
		/// <param name="countPageTemplates">Set to <code>true</code> to count the number of Page Templates</param>
		/// <param name="countCategories">Set to <code>true</code> to count the number of Categories.</param>
		/// <param name="countKeywords">Set to <code>true</code> to count the number of Keywords.</param>
		/// <returns>the newly created async ServiceProcess</returns>
		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public ServiceProcess Execute(string orgItemId, bool countFolders, bool countComponents, bool countSchemas,
				bool countComponentTemplates, bool countPageTemplates, bool countTemplateBuildingBlocks,
				bool countStructureGroups, bool countPages, bool countCategories, bool countKeywords)
		{
			if (string.IsNullOrEmpty(orgItemId))
			{
				throw new ArgumentNullException("orgItemId");
			}

			CountItemsParameters arguments = new CountItemsParameters
			{
				OrgItemUri = orgItemId,
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

				XElement listXml = coreService.GetListXml(parameters.OrgItemUri, filter);
				process.SetCompletePercentage(75);
				process.SetStatus("Extracting item counts");

				ProcessCounts(listXml);
				process.Complete("Done");
			}
		}

		/// <summary>
		/// Helper method to get the count of items of a specific type from the response XML.
		/// </summary>
		/// <param name="listXml">The response XML from GetListXml.</param>
		/// <param name="itemType">The item type to look for.</param>
		/// <returns>The number of items of the given type present in the response.</returns>
		private static int CountItemsOfType(XElement listXml, int itemType)
		{
			if (listXml == null)
			{
				throw new ArgumentNullException("listXml");
			}

			XNamespace tcm = "http://www.tridion.com/ContentManager/5.0";
			var nodes = from item in listXml.Descendants(tcm + "Item")
						let itemTypeAttr = item.Attribute("Type")
						where itemTypeAttr != null && itemTypeAttr.Value.Equals(itemType.ToString())
						select item;

			return nodes.Count();
		}

		/// <summary>
		/// Extract the actual counts from the XML.
		/// Set the response _countItemsData object.
		/// </summary>
		private void ProcessCounts(XElement listXml)
		{
			if (listXml == null)
			{
				throw new ArgumentNullException("listXml");
			}

			_countItemsData = new CountItemsData
			{
				Folders = CountItemsOfType(listXml, 2),
				Components = CountItemsOfType(listXml, 16),
				Schemas = CountItemsOfType(listXml, 8),
				ComponentTemplates = CountItemsOfType(listXml, 32),
				PageTemplates = CountItemsOfType(listXml, 128),
				TemplateBuildingBlocks = CountItemsOfType(listXml, 2048),
				StructureGroups = CountItemsOfType(listXml, 4),
				Pages = CountItemsOfType(listXml, 64),
				Categories = CountItemsOfType(listXml, 512),
				Keywords = CountItemsOfType(listXml, 1024)
			};
		}

		/// <summary>
		/// Create an ItemsFilter for the given Organizational Item type by either instantiating a
		/// RepositoryItemsFilterData (for Publication) or OrganizationalItemItemsFilterData (for Folder or SG).
		/// Populates the ItemTypes property with only the types that were requested to improve performance.
		/// </summary>
		private static ItemsFilterData GetFilter(CountItemsParameters parameters)
		{
			ItemsFilterData filter;
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



