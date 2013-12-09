using System.ServiceModel;
using Tridion.ContentManager.CoreService.Client;


namespace PowerTools.Common.CoreService
{
	public class Client
	{
		public static SessionAwareCoreServiceClient GetCoreService()
		{
#if TRIDION2013
			var result = new SessionAwareCoreServiceClient("netTcp_2012");
#else
			var result = new SessionAwareCoreServiceClient();
#endif
			result.Impersonate(Tridion.Web.UI.Core.Utils.GetUserName());
			return result;
		}
	}
}
