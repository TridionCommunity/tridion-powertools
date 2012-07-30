using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using System.IO;
using System.Reflection;
using Tridion.ContentManager.CoreService.Client;

namespace SynchroniserTest
{
    class EmbeddedResourceComponentFactory: EmbeddedResourceItemFactory, PowerTools.IComponentFactory
    {
        public EmbeddedResourceComponentFactory()
        {
        }
        public XDocument GetComponent(string resourceName)
        {
            return this.LoadXDocumentFromEmbeddedResource(resourceName);
        }
        public XDocument GetComponent(ComponentData componentData)
        {
            throw new NotSupportedException();
        }
    }
}
