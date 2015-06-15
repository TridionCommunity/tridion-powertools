using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using PowerTools.Model.Utils;
using PowerTools.Model.Progress;
using Tridion.ContentManager.CoreService.Client;

namespace PowerTools.Model.Services
{
	[ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	[ServiceContract(Namespace = "PowerTools.Model.Services")]
	public class ImageUploader : BaseService
	{
		private static SessionAwareCoreServiceClient _client;

		private static XElement _multiMediaTypes;
		private static XElement MultiMediaTypes
		{
		    get
		    {
		        if (_multiMediaTypes == null)
		        {
		            _multiMediaTypes = _client.GetSystemWideListXml(new MultimediaTypesFilterData());
		        }

		        return _multiMediaTypes;
		    }

		}

        private static HashSet<string> _componentTitles;

		class ImageUploadParameters
		{
			public string Directory { get; set; }
			public string FolderUri { get; set; }
			public string SchemaUri { get; set; }
		}

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public ServiceProcess Execute(string directory, string folderUri, string schemaUri)
		{
			if (string.IsNullOrEmpty(directory))
			{
				throw new ArgumentNullException("directory");
			}

			if (string.IsNullOrEmpty(folderUri))
			{
				throw new ArgumentNullException("folderUri");
			}

			if (string.IsNullOrEmpty(schemaUri))
			{
				throw new ArgumentNullException("schemaUri");
			}

			ImageUploadParameters arguments = new ImageUploadParameters { Directory = directory, FolderUri = folderUri, SchemaUri = schemaUri };
			return ExecuteAsync(arguments);
		}

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public override ServiceProcess GetProcessStatus(string Id)
		{
			return base.GetProcessStatus(Id);
		}

		public override void Process(ServiceProcess process, object arguments)
		{
			ImageUploadParameters parameters = (ImageUploadParameters)arguments;

			try
			{
                string directory = parameters.Directory;
                if (!Directory.Exists(directory))
                {
                    process.Failed = true;
                    process.Complete(string.Format(CultureInfo.InvariantCulture, "Directory '{0}' does not exist. No images were uploaded!", directory));
                    return;
                }
                string[] files = Directory.GetFiles(directory);
				int i = 0;
                _client = CoreService.Client.GetCoreService();

                //Get all component titles in the target folder           
                _componentTitles = getAllComponentTitles(parameters.FolderUri);

				foreach (string file in files)
				{
					process.SetStatus("Importing image: " + Path.GetFileName(file));
					process.SetCompletePercentage(++i * 100 / files.Length);
					
					FileInfo fileInfo = new FileInfo(file);
					if (fileInfo.Exists)
					{
						string mmType = GetMultiMediaType(fileInfo.Extension);
						if (mmType != null)
						{
							BinaryContentData bcd = new BinaryContentData
							{
								UploadFromFile = file,
								MultimediaType = new LinkToMultimediaTypeData { IdRef = mmType },
								Filename = file,
								IsExternal = false
							};

							ComponentData compData = new ComponentData
							{
								LocationInfo = new LocationInfo
								{
									OrganizationalItem = new LinkToOrganizationalItemData
									{
										IdRef = parameters.FolderUri //Organizational item
									},
								},
								ComponentType = ComponentType.Multimedia,
								Title = MakeValidFileName(fileInfo.Name),

								Schema = new LinkToSchemaData
								{
									IdRef = parameters.SchemaUri //schemaData.IdRef
								},

								IsBasedOnMandatorySchema = false,
								IsBasedOnTridionWebSchema = true,
								ApprovalStatus = new LinkToApprovalStatusData
								{
									IdRef = "tcm:0-0-0"
								},
								Id = "tcm:0-0-0",
								BinaryContent = bcd
							};

							ComponentData comp = (ComponentData)_client.Create(compData, new ReadOptions());
						}
					}
				}

				process.Complete();
			}
			finally
			{
				if (_client != null)
				{
					_client.Close();
				}
			}
		}

        private static string GetMultiMediaType(string extension)
        {
            //Strip of leading . from extension
            string ext = extension.StartsWith(".") ? extension.Substring(1) : extension;

			var result = from item in MultiMediaTypes.Descendants(Namespaces.Tcm + "Item")
						 let fileExtensions = item.Attribute("FileExtensions")
						 let typeId = item.Attribute("ID")
						 where fileExtensions != null && fileExtensions.Value.Contains(ext)
						 where typeId != null
						 select typeId.Value;

			return result.FirstOrDefault();
		}

        public HashSet<string> getAllComponentTitles(string folderUri)
        {
            var titles = getComponentTitles(folderUri);
            
            //Also load titles from components in lower folders 
            BluePrintFilterData filter = new BluePrintFilterData();
            filter.ForItem = new LinkToRepositoryLocalObjectData { IdRef = folderUri };
            var bluePrintData = _client.GetSystemWideListXml(filter);

            var allRelevantFolders = bluePrintData.Descendants(Namespaces.Tcm + "Item").Where(item => item.Attribute("IsShared").Value == "True");

            allRelevantFolders.ToList().ForEach(folder => getComponentTitles(folder.Attribute("ID").Value).ToList().ForEach(component => titles.Add(component)));

            return titles;
            
        }

        public HashSet<string> getComponentTitles(string folderUri)
        {
            OrganizationalItemItemsFilterData filterData = new OrganizationalItemItemsFilterData();
            filterData.ItemTypes = new[] { ItemType.Component };
            filterData.BaseColumns = ListBaseColumns.IdAndTitle;
            var result = _client.GetListXml(folderUri, filterData);

            if (result != null && result.Descendants(Namespaces.Tcm + "Item").Count() > 0)
                return result.Descendants(Namespaces.Tcm + "Item")
                             .Select(item => item.Attribute("Title").Value).ToHashSet();

            return new HashSet<string>();

        }

		private static string MakeValidFileName(string name)
		{
			string invalidChars = Regex.Escape(new string(Path.GetInvalidFileNameChars()));
			string invalidReStr = string.Format(@"[{0}]+", invalidChars);

            var componentTitle = Regex.Replace(name, invalidReStr, "_");

            if (_componentTitles.Contains(componentTitle))
            {
                for (int i = 1; i < 1000; i++)
                {
                    var componentTitleAdjusted = string.Format("{0} [{1}]", componentTitle, i.ToString());
                    if (!_componentTitles.Contains(componentTitleAdjusted))
                    {
                        _componentTitles.Add(componentTitleAdjusted);
                        return componentTitleAdjusted;
                    }
                }
            }

            return componentTitle;
            
		}
	}

    
}



