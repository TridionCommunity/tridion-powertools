using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ServiceModel;

namespace PowerTools2011.Model.Services.Progress
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