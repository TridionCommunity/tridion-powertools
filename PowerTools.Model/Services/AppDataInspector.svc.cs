using System;
using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using PowerTools.Common.CoreService;
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
		private List<AppDataInspectorData> _data = null;

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
				throw new ArgumentNullException("itemUri has to be a valid Tridion item Uri");
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
			process.SetStatus("Initializing");

			using (var coreService = Client.GetCoreService())
			{
				process.SetCompletePercentage(20);
				process.SetStatus("Retrieving data");

				ApplicationData[] appDataList = coreService.ReadAllApplicationData(parameters.ItemUri);
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

				process.Complete("Done");
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
			//TODO: A possible major todo here - treat the byte array properly when deserializing.
			//For simply showing the data, the current implementation will do. However for actual
			//deserialization a lot more needs to happen. Maybe for the purpose of the tool, this
			//would be enough for now.
			if (!String.IsNullOrEmpty(appData.TypeId) && appData.TypeId.Contains("c:XmlDocument"))
			{
				// it has been observer (though not confirmed) that c:XmlDocument is Unicode encodeed
				return Encoding.Unicode.GetString(arrBytes);
			}
			else
			{
				// ... and the rest of types are just UTF8 encoded
				return Encoding.UTF8.GetString(arrBytes);
			}
		}
	}
}
