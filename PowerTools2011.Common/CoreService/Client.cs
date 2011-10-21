using System.ServiceModel;
using Tridion.ContentManager.CoreService.Client;


namespace PowerTools2011.Common.CoreService
{
	public class Client
	{
		public static SessionAwareCoreService2010Client GetCoreService()
		{
			string userName = Tridion.Web.UI.Core.Utils.GetUserName();

			var quotas = new System.Xml.XmlDictionaryReaderQuotas
			{
				MaxStringContentLength = 10485760,
				MaxArrayLength = 10485760,
				MaxBytesPerRead = 10485760
			};

			var httpBinding = new WSHttpBinding
			{
				MaxReceivedMessageSize = 10485760,
				ReaderQuotas = quotas,
				Security = { Mode = SecurityMode.Message, Transport = { ClientCredentialType = HttpClientCredentialType.Windows } }
			};

			var endpoint = new EndpointAddress("http://localhost/WebServices/CoreService.svc/wsHttp_2010");
			var result = new SessionAwareCoreService2010Client(httpBinding, endpoint);
			result.Impersonate(userName);

			return result;
		}
	}
}
