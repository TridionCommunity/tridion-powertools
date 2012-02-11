using System;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Threading;
using PowerTools.Model.Progress;
using PowerTools.Model.Services.Progress;


namespace PowerTools.Model.Services
{
	[ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public abstract class BaseService
	{
		class ExecuteData
		{
			public ServiceProcess Process { get; set; }
			public object Arguments { get; set; }
		}

		public ServiceProcess ExecuteAsync(object arguments)
		{
			ServiceProcess newProcess = new ServiceProcess();
			ServiceProcessHelper storedProcess = new ServiceProcessHelper(newProcess);
			OperationContext.Current.InstanceContext.Extensions.Add(storedProcess);
			ExecuteData executeData = new ExecuteData { Process = storedProcess.Process, Arguments = arguments };
			ThreadPool.QueueUserWorkItem(WorkerThread, executeData);
			return newProcess;
		}

		public virtual ServiceProcess GetProcessStatus(String Id)
		{
			System.Collections.ObjectModel.Collection<ServiceProcessHelper> processes = OperationContext.Current.InstanceContext.Extensions.FindAll<ServiceProcessHelper>();
			foreach (ServiceProcessHelper storedprocess in processes)
			{
				if (storedprocess.Process.Id == Id)
				{
					return storedprocess.Process;
				}
			}

			return null;
		}

		public void WorkerThread(object state)
		{
			ExecuteData executeData = (ExecuteData)state;
			Process(executeData.Process, executeData.Arguments);
		}

		public abstract void Process(ServiceProcess process, object arguments);
	}
}


