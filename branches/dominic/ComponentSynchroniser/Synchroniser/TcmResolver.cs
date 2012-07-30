using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using Tridion.ContentManager.CoreService.Client;
using System.IO;
using System.Xml.Linq;
using System.Xml.XPath;

namespace PowerTools
{
    public class TcmResolver: XmlResolver
    {
        public readonly ISessionAwareCoreService coreService;
        public TcmResolver(ISessionAwareCoreService coreService)
        {
            this.coreService = coreService;
        }

        public override System.Net.ICredentials Credentials
        {
            set { throw new NotSupportedException(); }
        }

        public override object GetEntity(Uri absoluteUri, string role, Type ofObjectToReturn)
        {
            if (absoluteUri.Scheme != "tcm")
            {
                throw new ArgumentException("Only TCM Uris are supported.", "absoluteUri");
            }

            object returned = this.coreService.Read(absoluteUri.ToString(), new ReadOptions());
            var schemaData = returned as SchemaData;
            if (schemaData != null)
            {
                SchemaFactory schemaFactory = new SchemaFactory(this.coreService);
                XDocument schemaDoc = schemaFactory.GetSchema(schemaData);
                // Discovered by chance that you can hand back IXPathNavigable instead of having to mash it into a stream.
                // Much neater - especially when CreateNavigator comes as an extension method with the XPath namespace! :-) 
                return schemaDoc.CreateNavigator();
            }

            throw new NotSupportedException("As and when we need to support something else (like categories?), his would be a great place to do it.");
        }
    }
}
