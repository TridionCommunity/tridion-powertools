using System;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Threading;
using System.Runtime.Serialization;
using PowerTools.Common.CoreService;
using PowerTools.Model.Progress;
using Tridion.ContentManager.CoreService.Client;


namespace PowerTools.Model.Services
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    [ServiceContract(Namespace = "PowerTools.Model.Services")]
    public class AddUser : BaseService
    {
        private NewUserReturnData _newUserReturnData = null;

        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public NewUserReturnData CreateUser(String userName)
        {
            SessionAwareCoreServiceClient coreService = Client.GetCoreService();

            try
            {
#if TRIDION2013
				UserData userData = (UserData)coreService.GetDefaultData(ItemType.User, null, new ReadOptions());
#else
                UserData userData = (UserData)coreService.GetDefaultData(ItemType.User, null);
#endif
                userData.Title = userName;
                userData.Description = userName;

                userData = (UserData)coreService.Create(userData, new ReadOptions());

                _newUserReturnData = new NewUserReturnData();
                _newUserReturnData.UserDescription = userData.Description;
                _newUserReturnData.UserName = userData.Title;
                _newUserReturnData.UserID = userData.Id;
                _newUserReturnData.ErrorMessage = null;
            }
            catch(Exception e)
            {
                _newUserReturnData = new NewUserReturnData();
                _newUserReturnData.UserDescription = "Creation Failed";
                _newUserReturnData.UserName = userName;
                _newUserReturnData.UserID = null;
                _newUserReturnData.ErrorMessage = e.Message;
            }
            return _newUserReturnData;
        }

        public override void Process(ServiceProcess process, object arguments)
        {
            while (process.PercentComplete < 100)
            {
                process.IncrementCompletePercentage();
                process.SetStatus("Loading...");

                Random rnd = new Random(DateTime.Now.GetHashCode());
                Thread.Sleep(((int)(rnd.NextDouble() * 4) + 10) * 10);
            }
            process.Complete();
        }
    }

    [DataContract]
    public class NewUserReturnData
    {
        [DataMember]
		public string UserName;
        [DataMember]
        public string UserDescription;
        [DataMember]
        public string UserID;
        [DataMember]
        public string ErrorMessage;
	}
}