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
			public bool CountStructureGroups { get; set; }
			public bool CountPages { get; set; }
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
		public ServiceProcess Execute(string orgItemUri, bool countFolders, bool countComponents, bool countStructureGroups, bool countPages)
		{
			if (string.IsNullOrEmpty(orgItemUri))
			{
				throw new ArgumentNullException("orgItemId has to be a valid Publication, Folder or Structure Group TCMURI");
			}

			if (orgItemUri.EndsWith("-2")) // is Folder
			{
				countStructureGroups = false;
				countPages = false;
			}
			else if (orgItemUri.EndsWith("-4")) // is Structure Group
			{
				countFolders = false;
				countComponents = false;
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
				CountStructureGroups = countStructureGroups,
				CountPages = countPages
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

			using (var coreService = Client.GetCoreService())
			{
				ItemsFilterData filter = GetFilter(parameters);
				process.SetCompletePercentage(50);

				XmlElement listXml = coreService.GetListXml(parameters.OrgItemUri, filter);
				process.SetCompletePercentage(75);

				ProcessCounts(parameters, listXml);
				process.Complete();
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
			int structureGroupCount = parameters.CountStructureGroups ? listXml.SelectNodes("/tcm:Item[@Type='4']", nsMgr).Count : 0;
			int pageCount = parameters.CountPages ? listXml.SelectNodes("/tcm:Item[@Type='64']", nsMgr).Count : 0;

			_countItemsData = new CountItemsData()
			{
				Folders = folderCount,
				Components = componentCount,
				StructureGroups = structureGroupCount,
				Pages = pageCount
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
			if (parameters.CountStructureGroups) { itemTypesList.Add(ItemType.StructureGroup); }
			if (parameters.CountPages) { itemTypesList.Add(ItemType.Page); }

			filter.ItemTypes = itemTypesList.ToArray();

			return filter;
		}
	}
}



