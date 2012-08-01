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

            var tcmuri = new Tridion.ContentManager.TcmUri(absoluteUri.AbsoluteUri);
            if (tcmuri.ItemType == Tridion.ContentManager.ItemType.Schema)
            {
                ISchemaFactory schemaFactory = new CachingSchemaFactory(this.coreService);
                XDocument schemaDoc = schemaFactory.GetSchema(absoluteUri.AbsoluteUri);
                // Discovered by chance that you can hand back IXPathNavigable instead of having to mash it into a stream.
                // Much neater - especially when CreateNavigator comes as an extension method with the XPath namespace! :-) 
                return schemaDoc.CreateNavigator();
            }
            else
            {
                throw new ArgumentException("Please do not feed TcmUris to the TcmResolver unless they are schemas.");
            }
        }
    }
}
