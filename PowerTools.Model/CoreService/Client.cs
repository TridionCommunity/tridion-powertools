using PowerTools.Model.Properties;
using System.ServiceModel;
using Tridion.ContentManager.CoreService.Client;


namespace PowerTools.Model.CoreService
{
	public class Client
	{
		public static SessionAwareCoreServiceClient GetCoreService()
		{
#if TRIDION2013
			var result = new SessionAwareCoreServiceClient(Settings.Default.CoreServiceBindingName);
#else
			var result = new SessionAwareCoreServiceClient();
#endif
			result.Impersonate(Tridion.Web.UI.Core.Utils.GetUserName());
			return result;
		}
	}
}
