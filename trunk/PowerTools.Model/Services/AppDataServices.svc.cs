using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using System.Xml.Xsl;
using System.Xml;
using System.Web.Hosting;
using PowerTools.Common.Utils;
using PowerTools.Model.Progress;
using PowerTools.Common.CoreService;
using Tridion.ContentManager.CoreService.Client;

namespace PowerTools.Model.Services
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    [ServiceContract(Namespace = "PowerTools.Model.Services")]
    public class AppDataServices : BaseService
    {
        private static SessionAwareCoreServiceClient _client;

        class SaveAppDataParameters
        {
            public string ApplicationID { get; set; }
            public string ItemID { get; set; }
            public string Data { get; set; }
        }

        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public String Save(string applicationID, string itemID, string data)
        {
            try
            {
                _client = Client.GetCoreService();
                //Save the appdata here
                ApplicationData appdata = new ApplicationData();
                appdata.ApplicationId = applicationID;
                appdata.Data = new ASCIIEncoding().GetBytes(data);
                _client.SaveApplicationData(itemID, new ApplicationData[] { appdata });
                _client.Close();
                return "true";
            }
            catch (Exception e)
            {
                return "false";
            }
        }

        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public Boolean Append(string applicationID, string itemID, string data)
        {
            try
            {
                _client = Client.GetCoreService();
                ApplicationData appdata = _client.ReadApplicationData(itemID, applicationID);
                if (appdata != null)
                {
                    appdata.Data = appdata.Data.Concat(new ASCIIEncoding().GetBytes(data)).ToArray();
                }
                else
                {
                    appdata = new ApplicationData();
                    appdata.ApplicationId = applicationID;
                    appdata.Data = new ASCIIEncoding().GetBytes(data);
                }
                _client.SaveApplicationData(itemID, new[] { appdata });
                _client.Close();
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public String Read(string applicationID, string itemID)
        {
            _client = Client.GetCoreService();
            ApplicationData appdata = _client.ReadApplicationData(itemID, applicationID);
            String response = ASCIIEncoding.ASCII.GetString(appdata.Data);
            _client.Close();
            //XDocument appDataXml = XDocument.Parse("<AppData>" + response + "</AppData>");
            //XslCompiledTransform transformer = new XslCompiledTransform();
            //String pathXSLT = HostingEnvironment.MapPath("~/Services/TransformChangeHistoryData.xslt");
            //transformer.Load(pathXSLT);
            //StringBuilder sb = new StringBuilder();
            //StringWriter sw = new StringWriter(sb);

            //XmlWriter writer = new XmlTextWriter(sw);
            //transformer.Transform(appDataXml.CreateReader(), writer);
            String result = "<AppData>" + response + "</AppData>";
            return result;
        }

        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public Boolean Delete(string applicationID, string itemID)
        {
            _client = Client.GetCoreService();
            _client.DeleteApplicationData(itemID, applicationID);
            _client.Close();
            return true;
        }

        public override void Process(ServiceProcess process, object arguments)
        {
            //Empty
        }
    }


}



