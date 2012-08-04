using System.ServiceModel;
using Tridion.ContentManager.CoreService.Client;


namespace PowerTools.Common.CoreService
{
	public class Client
	{
		public static SessionAwareCoreServiceClient GetCoreService()
		{
			var result = new SessionAwareCoreServiceClient();
			result.Impersonate(Tridion.Web.UI.Core.Utils.GetUserName());
			return result;
		}
	}
}
