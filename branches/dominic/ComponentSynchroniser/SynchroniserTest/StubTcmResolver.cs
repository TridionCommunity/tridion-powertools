using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using Tridion.ContentManager.CoreService.Client;
using System.IO;
using System.Xml.Linq;
using System.Xml.XPath;

namespace SynchroniserTest
{
    public class StubTcmResolver: XmlResolver
    {

        public override System.Net.ICredentials Credentials
        {
            set { throw new NotSupportedException(); }
        }

        protected Dictionary<string, object> items = new Dictionary<string, object>();            
        public void Add(string name, object value)
        {
            if (!(value is XDocument))
            {
                // If you have cause to remove this, please also fix the cast in GetEntity! 
                throw new NotSupportedException();
            }
            this.items.Add(name, value);
        }

        public override object GetEntity(Uri absoluteUri, string role, Type ofObjectToReturn)
        {
            switch (absoluteUri.Scheme)
            {
                case "tcm":
                case "fake":
                    break;
                default:
                    throw new ArgumentException("Only TCM Uris (and sometimes fakes! are supported.", "absoluteUri");
            }

            XDocument itemDoc = (XDocument)this.items[absoluteUri.AbsoluteUri];
            return itemDoc.CreateNavigator();
        }
    }
}
