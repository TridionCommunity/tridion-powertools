using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using PowerTools.Model.Progress;
using PowerTools.Model.CoreService;
using Tridion.ContentManager.CoreService.Client;

namespace PowerTools.Model.Services
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    [ServiceContract(Namespace = "PowerTools.Model.Services")]
    public class AppDataServices : BaseService
    {
	    [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public void Save(string applicationId, string itemId, string data)
        {
	        using (var client = Client.GetCoreService())
	        {
		        //Save the appdata here
		        var appdata = new ApplicationData { ApplicationId = applicationId, Data = new ASCIIEncoding().GetBytes(data) };
		        client.SaveApplicationData(itemId, new[] {appdata});
	        }
        }

        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public void Append(string applicationId, string itemId, string data)
        {
	        using (var client = Client.GetCoreService())
	        {
		        ApplicationData appdata = client.ReadApplicationData(itemId, applicationId);
		        if (appdata != null)
		        {
			        appdata.Data = appdata.Data.Concat(new ASCIIEncoding().GetBytes(data)).ToArray();
		        }
		        else
		        {
			        appdata = new ApplicationData {ApplicationId = applicationId, Data = new ASCIIEncoding().GetBytes(data)};
		        }
		        client.SaveApplicationData(itemId, new[] {appdata});
	        }
        }

        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public string Read(string applicationId, string itemId)
        {
	        using (var client = Client.GetCoreService())
	        {
		        ApplicationData appdata = client.ReadApplicationData(itemId, applicationId);
		        string response = "";

		        if (appdata != null)
		        {
			        response = Encoding.ASCII.GetString(appdata.Data);
		        }
		        
		        return "<AppData ApplicationID=\"" + applicationId + "\" ItemID=\"" + itemId + "\">" + response + "</AppData>";
			}
        }

        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public void Delete(string applicationId, string itemId)
        {
	        using (var client = Client.GetCoreService())
	        {
		        client.DeleteApplicationData(itemId, applicationId);
	        }
        }

        public override void Process(ServiceProcess process, object arguments)
        {
            //Empty
        }
    }


}



