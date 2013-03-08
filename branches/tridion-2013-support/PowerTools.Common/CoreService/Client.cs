using System.ServiceModel;
using Tridion.ContentManager.CoreService.Client;


namespace PowerTools.Common.CoreService
{
	public class Client
	{
		public static SessionAwareCoreServiceClient GetCoreService()
		{
			var result = new SessionAwareCoreServiceClient("netTcp_2012");
			result.Impersonate(Tridion.Web.UI.Core.Utils.GetUserName());
			return result;
		}
	}
}
