using System.ServiceModel;
using PowerTools.Model.Progress;
using PowerTools.Model.Services.Progress;

namespace PowerTools.Model.Services.Progress
{
	public class ServiceProcessHelper : IExtension<InstanceContext>
	{
		public ServiceProcessHelper(ServiceProcess process)
		{
			Process = process;
		}

		public ServiceProcess Process { get; private set; }

		public void Attach(InstanceContext owner)
		{
		}

		public void Detach(InstanceContext owner)
		{
		}
	}
}