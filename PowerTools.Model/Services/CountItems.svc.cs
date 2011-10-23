using System;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Xml;
using PowerTools.Model.Services.Progress;
using Tridion.ContentManager.CoreService.Client;
using System.Collections.Generic;


namespace PowerTools.Model.Services
{
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

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public override ServiceProcess GetProcessStatus(string id)
		{
			return base.GetProcessStatus(id);
		}

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public CountItemsData GetCountItemsData()
		{
			return _countItemsData;
		}

		public override void Process(ServiceProcess process, object arguments)
		{
			process.SetCompletePercentage(25);
			CountItemsParameters parameters = (CountItemsParameters)arguments;

			using (var client = PowerTools.Common.CoreService.Client.GetCoreService())
			{
				process.SetCompletePercentage(50);
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

				XmlElement resultElem = client.GetListXml(parameters.OrgItemUri, filter);
				XmlNamespaceManager nsMgr = new XmlNamespaceManager(resultElem.OwnerDocument.NameTable);
				nsMgr.AddNamespace("tcm", "http://www.tridion.com/ContentManager/5.0");

				int folderCount = parameters.CountFolders ? resultElem.SelectNodes("/tcm:Item[@Type='2']", nsMgr).Count : 0;
				int componentCount = parameters.CountComponents ? resultElem.SelectNodes("/tcm:Item[@Type='16']", nsMgr).Count : 0;
				int structureGroupCount = parameters.CountStructureGroups ? resultElem.SelectNodes("/tcm:Item[@Type='4']", nsMgr).Count : 0;
				int pageCount = parameters.CountPages ? resultElem.SelectNodes("/tcm:Item[@Type='64']", nsMgr).Count : 0;

				process.SetCompletePercentage(75);
				_countItemsData = new CountItemsData()
				{
					Folders = folderCount,
					Components = componentCount,
					StructureGroups = structureGroupCount,
					Pages = pageCount
				};

				process.Complete();
			}
		}
	}
}



