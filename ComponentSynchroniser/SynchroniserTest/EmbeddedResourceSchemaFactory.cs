using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using System.Reflection;
using System.IO;

namespace SynchroniserTest
{
    class EmbeddedResourceSchemaFactory: EmbeddedResourceItemFactory, PowerTools.ISchemaFactory
    {
        public EmbeddedResourceSchemaFactory()
        {
            
        }
        public XDocument GetSchema(string resourceName)
        {
            return this.LoadXDocumentFromEmbeddedResource(resourceName);
        }
    }
}
