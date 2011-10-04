using System.ServiceModel;
using System.ServiceModel.Web;
using PowerTools2011.Services.Progress;

namespace PowerTools2011.Services.BatchImageUploader
{
    public class Service : BaseService
    {
        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public ServiceProcess Execute()
        {
            return ExecuteAsync(null);
        }

        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public override ServiceProcess GetProcessStatus(string Id)
        {
            return base.GetProcessStatus(Id);
        }

        public override void Process(ServiceProcess process, object arguments)
        {
            
        }
    }
}