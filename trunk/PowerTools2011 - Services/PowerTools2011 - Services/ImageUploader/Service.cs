using System.IO;
using PowerTools2011.Services.Exceptions;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using PowerTools2011.Services.Progress;


namespace PowerTools2011.Services
{
	[ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class ImageUploader : BaseService
	{
        class ImageUploadParameters
        {
            public string Directory { get; set; }
            public string FolderUri { get; set; }
            public string SchemaUri { get; set; }
        }

        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public ServiceProcess Execute(string directory, string folderUri, string schemaUri)
        {
            ImageUploadParameters arguments = new ImageUploadParameters {Directory = directory, FolderUri = folderUri, SchemaUri = schemaUri};
            return ExecuteAsync(arguments);
        }

        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public override ServiceProcess GetProcessStatus(string Id)
        {
            return base.GetProcessStatus(Id);
        }

		public override void Process(ServiceProcess process, object arguments)
		{
		    ImageUploadParameters parameters = (ImageUploadParameters) arguments;
            if (!Directory.Exists(parameters.Directory))
            {
                throw new BaseServiceException("Directory '{0}' does not exist.");
            }

		    var client = PowerTools2011.Common.CoreService.Client.GetCoreService();

		    try
		    {

		        string[] files = Directory.GetFiles(parameters.Directory);
		        int i = 0;

                foreach(string file in files)
                {
                    process.SetStatus("Importing image: " + Path.GetFileName(file));
                    process.SetCompletePercentage(files.Length / i++);
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
	}
}



