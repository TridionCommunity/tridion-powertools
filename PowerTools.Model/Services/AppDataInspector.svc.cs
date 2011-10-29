using System;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using PowerTools.Common.CoreService;
using PowerTools.Model.Services.Progress;
using System.Collections.Generic;
using Tridion.ContentManager.CoreService.Client;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;


namespace PowerTools.Model.Services
{
	[ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	[ServiceContract(Namespace = "PowerTools.Model.Services")]
	public class AppDataInspector : BaseService
	{
		class AppDataInspectorParameters
		{
			public string ItemUri { get; set; }
		}

		private List<AppDataInspectorData> _data = null;

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

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public override ServiceProcess GetProcessStatus(string id)
		{
			return base.GetProcessStatus(id);
		}

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public List<AppDataInspectorData> GetData()
		{
			return _data;
		}

		public override void Process(ServiceProcess process, object arguments)
		{
			_data = new List<AppDataInspectorData>();

			AppDataInspectorParameters parameters = (AppDataInspectorParameters)arguments;
			process.SetCompletePercentage(25);
			process.SetStatus("Initializing");

			using (var coreService = Client.GetCoreService())
			{
				process.SetCompletePercentage(50);
				process.SetStatus("Retrieving count data");

				ApplicationData[] appDataList = coreService.ReadAllApplicationData(parameters.ItemUri);
				foreach (ApplicationData appData in appDataList)
				{
					_data.Add(new AppDataInspectorData
					{
						ApplicationId = appData.ApplicationId,
						Value = ByteArrayToObject(appData.Data).ToString(),
						Type = appData.TypeId
					});
				}

				process.Complete("Done");
			}
		}

		// Convert a byte array to an Object
		private Object ByteArrayToObject(byte[] arrBytes)
		{
			//MemoryStream memStream = new MemoryStream();
			//BinaryFormatter binForm = new BinaryFormatter();
			//memStream.Write(arrBytes, 0, arrBytes.Length);
			//memStream.Seek(0, SeekOrigin.Begin);
			//StreamReader sr = new StreamReader(memStream, Encoding.Unicode);
			//Object obj = (Object)binForm.Deserialize(sr);
			String val = Encoding.Unicode.GetString(arrBytes);

			return val;
		}
	}
}
