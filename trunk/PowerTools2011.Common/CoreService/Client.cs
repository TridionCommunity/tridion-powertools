using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Tridion.ContentManager.CoreService.Client;
using System.Web;
using System.Xml;
using System.ServiceModel;

namespace PowerTools2011.Common.CoreService
{
    public class Client
    {
        public static SessionAwareCoreService2010Client GetCoreService()
        {
            string userName = HttpContext.Current.User.Identity.Name;

            var quotas = new System.Xml.XmlDictionaryReaderQuotas
            {
                MaxStringContentLength = 10485760,
                MaxArrayLength = 10485760,
                MaxBytesPerRead = 10485760
            };
            var httpBinding = new WSHttpBinding
            {
                MaxReceivedMessageSize = 10485760,
                ReaderQuotas = quotas,
                Security = { Mode = SecurityMode.Message, Transport = { ClientCredentialType = HttpClientCredentialType.Windows } }
            };

            var endpoint = new EndpointAddress("http://localhost/WebServices/CoreService.svc/wsHttp");
            var result = new SessionAwareCoreService2010Client(httpBinding, endpoint);
            result.Impersonate(userName);
            return result;
        }

    }
}
