using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Reflection;
using System.Collections;
using System.Threading;
using System.Collections.ObjectModel;
using System.Security.Principal;
using Tridion.ContentManager;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using PowerTools2011.Services.Progress;

namespace PowerTools2011.Services.Example
{
	[ServiceContract(Namespace = "")]
	[ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class ExampleService
	{

		internal static WindowsIdentity identity;

		[OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
		public ServiceProcess Execute()
		{
			ServiceProcess newProcess = new ServiceProcess();
			identity = ServiceSecurityContext.Current.WindowsIdentity;
			Session tdse = new Session(identity.Name);

			ServiceProcessHelper storedProcess = new ServiceProcessHelper(newProcess);
			OperationContext.Current.InstanceContext.Extensions.Add(storedProcess);
			ThreadPool.QueueUserWorkItem(new WaitCallback(WorkerThread), new object[] { storedProcess });

			return newProcess;
		}

		[OperationContract, WebGet]
		public ServiceProcess GetProcessStatus(String Id)
		{
			ServiceSecurityContext securitycontext = ServiceSecurityContext.Current;
			string status = "";
			int complete = 0;
			System.Collections.ObjectModel.Collection<ServiceProcessHelper> processes = OperationContext.Current.InstanceContext.Extensions.FindAll<ServiceProcessHelper>();
			foreach (ServiceProcessHelper storedprocess in processes)
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
			//From web

			string threadidentity = WindowsIdentity.GetCurrent().Name;
			WindowsImpersonationContext wi = identity.Impersonate();
			string impidendity = WindowsIdentity.GetCurrent().Name;

			Session tdse = new Session(WindowsIdentity.GetCurrent().Name);




			//System.Security.Principal.WindowsImpersonationContext impContext = identity.Impersonate();
			ServiceProcessHelper storedprocess = (ServiceProcessHelper)((object[])data)[0];
			//Session session = new Session(identity.Name);

			while (storedprocess.Process.PercentComplete < 100)
			{
				storedprocess.Process.IncrementCompletePercentage();
				try
				{
					storedprocess.Process.SetStatus("Running as:" + tdse.User.Description);
				}
				catch (Exception e)
				{
					storedprocess.Process.SetStatus("Running as: Anonymous");
				}
				Random rnd = new Random(DateTime.Now.GetHashCode());
				Thread.Sleep(((int)(rnd.NextDouble() * 40) + 10) * 10);
			}
			storedprocess.Process.SetStatus("Complete");

		}
	}
}



