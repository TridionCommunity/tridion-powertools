﻿using System;
using System.Collections.Generic;
﻿using System.Linq;
﻿using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
﻿using System.Xml;
﻿using System.Xml.Linq;
﻿using PowerTools.Model.CoreService;
using PowerTools.Model.Progress;
using Tridion.ContentManager.CoreService.Client;


namespace PowerTools.Model.Services
{
	/// <summary>
	/// Service getting all Application Data for a given item TcmUri.
	/// </summary>
	[ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	[ServiceContract(Namespace = "PowerTools.Model.Services")]
	public class AppDataInspector : BaseService
	{
		/// <summary>
		/// Application Data parameters - only the item TcmUri
		/// </summary>
		class AppDataInspectorParameters
		{
			public string ItemUri { get; set; }
		}

		/// <summary>
		/// Response data object cotaining all retrieved ApplicationData objects
		/// </summary>
		private List<AppDataInspectorData> _data;

		/// <summary>
		/// Operation contract method that initiates asynch execution for a given item TcmUri.
		/// </summary>
		/// <param name="itemUri">String TcmUri of the item to retrieve AppData for</param>
		/// <returns>ServiceProcess the async process that will perform actual work</returns>
		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public ServiceProcess Execute(string itemUri)
		{
			if (string.IsNullOrEmpty(itemUri))
			{
				throw new ArgumentNullException("itemUri");
			}

			AppDataInspectorParameters arguments = new AppDataInspectorParameters
			{
				ItemUri = itemUri
			};

			return ExecuteAsync(arguments);
		}

		/// <summary>
		/// Operation contract retrieving the current process status.
		/// </summary>
		/// <param name="id">String the process id to retrieve status for</param>
		/// <returns>ServiceProcess the async process identified by id</returns>
		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public override ServiceProcess GetProcessStatus(string id)
		{
			return base.GetProcessStatus(id);
		}

		/// <summary>
		/// Operation contract retrieving the data object (a list of retrieved ApplicationData objects
		/// or empty List if not found)
		/// </summary>
		/// <returns>List of retrieved AppDataInspectorData data objects, or empty list if not found</returns>
		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public List<AppDataInspectorData> GetData()
		{
			return _data;
		}

		/// <summary>
		/// Main method performing CoreService call to retrieve all AppData for the given item Uri
		/// </summary>
		/// <param name="process">ServiceProcee the async process to use</param>
		/// <param name="arguments">parameter object with item TcmUri to retrieve AppData for</param>
		public override void Process(ServiceProcess process, object arguments)
		{
			_data = new List<AppDataInspectorData>();

			AppDataInspectorParameters parameters = (AppDataInspectorParameters)arguments;
			process.SetCompletePercentage(10);
			process.SetStatus(Resources.ProgressStatusInitializing);

			using (var coreService = Client.GetCoreService())
			{
				process.SetCompletePercentage(20);
				process.SetStatus(Resources.AppDataInspectorRetrievingData);

				ApplicationData[] appDataList = coreService.ReadAllApplicationData(parameters.ItemUri).OrderBy(data => data.ApplicationId).ToArray();
				double progressIncrement = appDataList.Length == 0 ? 0 : 80 / appDataList.Length; //nasty progress calculation
				int i = 1;

				foreach (ApplicationData appData in appDataList)
				{
					_data.Add(new AppDataInspectorData // create response data object and add it to response data collection
					{
						ApplicationId = appData.ApplicationId,
						Value = ByteArrayToObject(appData).ToString(),
						Type = appData.TypeId
					});

					int progressPercentage = (int)(20 + i * progressIncrement); // some more nasty progress calculation
					process.SetCompletePercentage(progressPercentage);
					i++;
				}

				process.Complete(Resources.ProgressStatusComplete);
			}
		}

		/// <summary>
		///  Convert a byte array in a given ApplicationData data object to an actual Object.
		///  It performs very simple deserialization of byte array, looking at the AppData typeid.
		/// </summary>
		/// <param name="appData">ApplicationData to use byte array for deserialization</param>
		/// <returns>Object the deserialized object</returns>
		private Object ByteArrayToObject(ApplicationData appData)
		{
			byte[] arrBytes = appData.Data;
			string dataType = appData.TypeId;

			if (!string.IsNullOrWhiteSpace(dataType))
			{
				string xmlData = null;

				if (dataType.Contains("c:XmlDocument"))
				{
					xmlData = Encoding.Unicode.GetString(arrBytes);
				} 
				else if (dataType.Contains("XmlDocument") || dataType.Contains("XmlElement"))
				{
					xmlData = Encoding.UTF8.GetString(arrBytes);
				}

				if (!string.IsNullOrWhiteSpace(xmlData))
				{
					try
					{
						XDocument document = XDocument.Parse("<root>" + xmlData + "</root>");
						var node = document.Descendants("root").FirstOrDefault();
						return String.Concat(node.Nodes().Select(x => x.ToString() + Environment.NewLine).ToArray());
					}
					catch (XmlException)
					{
						return xmlData;
					}
				}
				if (dataType.StartsWith("image/"))
				{
					return Encoding.GetEncoding("ISO-8859-1").GetString(arrBytes);
				}
			}

			return Encoding.UTF8.GetString(arrBytes);
		}
	}
}
