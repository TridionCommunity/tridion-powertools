using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Tridion.ContentManager.ContentManagement;
using Tridion.ContentManager;
using System.Reflection;
using System.Collections;
using System.Threading;

namespace PowerTools2011Editor.PowerTools.Example
{
    public partial class Main_PopUp : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
           System.Security.Principal.IPrincipal user = HttpContext.Current.User;     
           Tridion.ContentManager.Session session = new Session(user.Identity.Name);
           UserNameLabel.Text = session.User.Description;
        }



        //[System.Web.Services.WebMethod]
        //[System.Web.Script.Services.ScriptMethod]
        //public static object[] ExecuteCommand(string commandName, string targetMethod, object data)
        //{
        //    try
        //    {
        //        object[] result = new object[2];
        //        result[0] = Command.Create(commandName).Execute(data);
        //        result[1] = targetMethod;
        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        // TODO: add logging functionality 
        //        throw;
        //    }
        //}

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public static object[] GetStatuses(string targetMethod, object data)
        {
            try
            {
                object[] result = new object[2];
                result[0] = ProcessStatuses.Get();
                result[1] = targetMethod;
                return result;
            }
            catch (Exception ex)
            {
                // TODO: add logging functionality 
                throw;
            }
        }





        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public static object[] DoSomething(object data)
        {
            try
            {
                ProcessStatus newProcess = new ProcessStatus(data.ToString());
                ArrayList allProcesses = ProcessStatuses.Get();
                ArrayList.Synchronized(allProcesses).Add(newProcess);
                //This starts the process on a new thread
                ThreadPool.QueueUserWorkItem(new WaitCallback(StartProcessing), new object[] { newProcess, allProcesses });
                return null;
            }
            catch (Exception ex)
            {
                // TODO: add logging functionality 
                throw;
            }
        }


        public static void StartProcessing(object data)
        {
            ProcessStatus process = (ProcessStatus)((object[])data)[0];
            while (process.Status < 100)
            {
                process.IncrementStatus();

                //Fake Timer test
                Random rnd = new Random(DateTime.Now.GetHashCode());
                Thread.Sleep(((int)(rnd.NextDouble() * 40) + 10) * 10);

            }
            //Wait 10 seconds before removing the process status
            Thread.Sleep(10000);
            ArrayList.Synchronized((ArrayList)((object[])data)[1]).Remove(process);
        }
    }

    public class Command
    {
        #region Command functionality

        private string m_CommandName = "";

        public Command(string commandName)
        {
            m_CommandName = commandName;
        }

        public static Command Create(string commandName)
        {
            return new Command(commandName);
        }

        public object Execute(object data)
        {
            Type type = this.GetType();
            MethodInfo method = type.GetMethod(m_CommandName);
            object[] args = new object[] { data };
            try
            {
                return method.Invoke(this, args);
            }
            catch (Exception ex)
            {
                // TODO: Add logging functionality
                throw;
            }
        }

        #endregion

        #region Public execution commands

        /// <summary>
        /// Launch the new process with 
        /// name specified in object "data"
        /// </summary>
        /// <param name="data">
        /// Name of a process
        /// </param>
        /// <returns>null</returns>
        public object LaunchNewProcess(object data)
        {
            return null;
        }

        /// <summary>
        /// Returns Array of ProcessStatus 
        /// objects to the client script
        /// </summary>
        /// <param name="data">
        /// anything, this data 
        /// is not processed in this method
        /// </param>
        /// <returns>
        /// Array of ProcessStatus objects
        /// </returns>
        public object GetProcessStatuses(object data)
        {
            ArrayList allProcesses = ProcessStatuses.Get();
            lock (allProcesses.SyncRoot)
            {
                return allProcesses.ToArray();
            }
        }

        #endregion
    }


    public class ProcessStatuses
    {
        private const string m_SessionKey = "ProcessStatusesKey";

        public static ArrayList Get()
        {
            if (HttpContext.Current.Session[m_SessionKey] == null)
            {
                HttpContext.Current.Session[m_SessionKey] = new ArrayList();
            }
            return (ArrayList)HttpContext.Current.Session[m_SessionKey];
        }
    }

    public class ProcessStatus
    {
        public ProcessStatus(string name)
        {
            m_Name = name;
        }

        private int m_Status = 0;

        public int Status
        {
            get { return m_Status; }
            set { m_Status = value; }
        }

        private string m_Name = "";

        public string Name
        {
            get { return m_Name; }
            set { m_Name = value; }
        }

        public void IncrementStatus()
        {
            lock (this)
            {
                m_Status++;
            }
        }

    }
}