using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ServiceModel;

namespace PowerTools2011.Services.Progress
{
	public class ServiceProcessHelper : IExtension<InstanceContext>
	{
		private ServiceProcess m_Process;

		public ServiceProcessHelper(ServiceProcess process)
		{
			m_Process = process;
		}

		public ServiceProcess Process
        {
            get { return m_Process; }
        }

        public void Attach(InstanceContext owner)
        {
            //throw new NotImplementedException();
        }

        public void Detach(InstanceContext owner)
        {
            //throw new NotImplementedException();
        }  
	}
}