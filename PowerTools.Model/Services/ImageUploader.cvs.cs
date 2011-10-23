using System;
using System.Globalization;
using System.IO;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using PowerTools.Model.Services.Exceptions;
using PowerTools.Model.Services.Progress;
using System.Xml.Linq;
using System.Linq;
using Tridion.ContentManager.CoreService.Client;
using System.Text.RegularExpressions;
using System.Xml;

namespace PowerTools.Model.Services
{
	[ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	[ServiceContract(Namespace = "PowerTools.Model.Services")]
	public class ImageUploader : BaseService
	{
		private static Tridion.ContentManager.CoreService.Client.SessionAwareCoreService2010Client client = null;
		//XLinq variant
		//private static XElement multiMediaTypes = null;
		//private static XElement MultiMediaTypes
		//{
		//    get
		//    {
		//        if (multiMediaTypes == null)
		//        {
		//            multiMediaTypes = client.GetSystemWideListXml(new MultimediaTypesFilterData());
		//        }

		//        return multiMediaTypes;
		//    }

		//}

		private static XmlElement multiMediaTypes = null;
		private static XmlElement MultiMediaTypes
		{
			get
			{
				if (multiMediaTypes == null)
				{
					multiMediaTypes = client.GetSystemWideListXml(new MultimediaTypesFilterData());
				}

				return multiMediaTypes;
			}

		}

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
			if (!Directory.Exists(parameters.Directory))
			{
				throw new BaseServiceException(string.Format(CultureInfo.InvariantCulture, "Directory '{0}' does not exist.", parameters.Directory));
			}

			client = PowerTools.Common.CoreService.Client.GetCoreService();

			try
			{
				string[] files = Directory.GetFiles(parameters.Directory);
				int i = 0;

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

							ComponentData comp = (ComponentData)client.Create(compData, new ReadOptions());
							string newlyCreatedComponentID = comp.Id;
						}
					}
				}

				process.Complete();
			}
			finally
			{
				if (client != null)
				{
					client.Close();
				}
			}
		}

		//XLinq variant
		//private static string GetMultiMediaType(string extension)
		//{
		//    //Strip of leading . from extension
		//    string ext = extension.StartsWith(".") ? extension.Substring(1) : extension;

		//    return MultiMediaTypes.Elements().Where(el => el.Attribute("FileExtensions").Value.Contains(ext))
		//        .Where(el => el != null)
		//        .Select(el => el.Attribute("ID").Value).FirstOrDefault();
		//}

		private static string GetMultiMediaType(string extension)
		{
			//Strip of leading . from extension
			string ext = extension.StartsWith(".") ? extension.Substring(1) : extension;

			XmlDocument doc = new XmlDocument(); 
			doc.LoadXml(MultiMediaTypes.OuterXml);

			XmlNamespaceManager ns = new XmlNamespaceManager(doc.NameTable); ns.AddNamespace("tcm", "http://www.tridion.com/ContentManager/5.0");
			var mmTypeId = MultiMediaTypes.SelectSingleNode("//tcm:Item[contains(@FileExtensions, '" + ext + "')]", ns);
			if (mmTypeId != null)
			{
				return mmTypeId.Attributes["ID"].Value;
			}

			return null;
		}

		private static string MakeValidFileName(string name)
		{
			string invalidChars = Regex.Escape(new string(Path.GetInvalidFileNameChars()));
			string invalidReStr = string.Format(@"[{0}]+", invalidChars);
			return Regex.Replace(name, invalidReStr, "_");
		}
	}
}



