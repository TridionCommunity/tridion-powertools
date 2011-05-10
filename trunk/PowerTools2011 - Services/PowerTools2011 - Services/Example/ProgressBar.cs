using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;

namespace PowerTools2011.Services.Example
{
    public class StoredProcess : IExtension<InstanceContext>
    {
        private Process m_Process;

        public Process Process
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

        public StoredProcess(Process process)
        {

            m_Process = process;
        }
    }

    public class Process
    {
        private int m_Complete = 0;
        private string m_ID = "";
        private string m_Status = "";

        public Process()
        {
            Guid guid = Guid.NewGuid();
            m_ID = guid.ToString();
            m_Status = "Initializing...";
        }

        public int PercentComplete
        {
            get { return m_Complete; }
            set { m_Complete = value; }
        }

        public string Id
        {
            get { return m_ID; }
            set { m_ID = value; }
        }

        public string Status
        {
            get { return m_Status; }
            set { m_Status = value; }
        }

        public void SetCompletePercentage(int percent)
        {
            lock (this)
            {
                m_Complete = percent;
            }
        }

        public void IncrementCompletePercentage()
        {
            lock (this)
            {
                m_Complete++;
            }

        }

        public void SetStatus(string status)
        {
            lock (this)
            {
                m_Status = status;
            }
        }

    }


}