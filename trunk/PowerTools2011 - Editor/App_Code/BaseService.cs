using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using UrbanCherry.Net.SDLTridion.PowerTools;
using System.Reflection;
using System.Collections;
using System.Threading;
using System.Collections.ObjectModel;
using System.Security.Principal;
using Tridion.ContentManager;



namespace PowerTools2011Editor
{
    [ServiceContract(Namespace = "")]
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    public class BasePowerToolService
    {

        internal static WindowsIdentity identity;

        [OperationContract, WebGet]
        public String Execute(String message)
        {
            Process newProcess = new Process();
            identity = ServiceSecurityContext.Current.WindowsIdentity;
            Session tdse = new Session(identity.Name);
            StoredProcess storedProcess = new StoredProcess(newProcess);
            OperationContext.Current.InstanceContext.Extensions.Add(storedProcess);
            ThreadPool.QueueUserWorkItem(new WaitCallback(WorkerThread), new object[] { storedProcess });
            return newProcess.Id;
        }

        [OperationContract, WebGet]
        public Process GetProcessStatus(String Id)
        {
            ServiceSecurityContext securitycontext = ServiceSecurityContext.Current;
            string status = "";
            int complete = 0;
            System.Collections.ObjectModel.Collection<StoredProcess> processes = OperationContext.Current.InstanceContext.Extensions.FindAll<StoredProcess>();
            foreach (StoredProcess storedprocess in processes)
            {
                if (storedprocess.Process.Id == Id)
                {
                    status = storedprocess.Process.Status;
                    complete = storedprocess.Process.PercentComplete;
                    return storedprocess.Process;
                }
            }
            return null; // The process was not found
        }


        public static void WorkerThread(object data)
        {

            
        }
    }
}


