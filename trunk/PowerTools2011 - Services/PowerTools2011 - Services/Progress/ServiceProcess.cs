using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ServiceModel;

namespace PowerTools2011.Services.Progress
{
	public class ServiceProcess
	{
		private int m_Complete = 0;     
        private string m_Status = "";

		private readonly object m_Lock = new object();

		public ServiceProcess()
        {
            var guid = Guid.NewGuid();
            
			this.Id = guid.ToString();

            SetStatus("Initializing...");
        }

        public int PercentComplete
        {
            get { return m_Complete; }
            set { m_Complete = value; }
        }

		public string Id { get; private set; }

		public bool Failed{get;set;}

        public string Status
        {
            get { return m_Status; }            
        }

		public void Complete()
		{
			Complete("Completed");
		}

		public void Complete(string status)
		{
			SetCompletePercentage(100);
			SetStatus(status);
		}
		
        public void SetCompletePercentage(int percent)
        {
			lock (m_Lock)
            {
                m_Complete = percent;
            }
        }

        public void IncrementCompletePercentage()
        {
			lock (m_Lock)
            {
                m_Complete++;
            }

        }

		public void IncrementCompletePercentageBy(int percent)
		{
			lock (m_Lock)
			{
				m_Complete += percent;
			}
		}

        public void SetStatus(string status)
        {
			lock (m_Lock)
            {
                m_Status = status;
            }
        }

	}
}