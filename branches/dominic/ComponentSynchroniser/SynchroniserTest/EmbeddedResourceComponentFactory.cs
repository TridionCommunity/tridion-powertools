using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using System.IO;
using System.Reflection;
using Tridion.ContentManager.CoreService.Client;
using PowerTools.ComponentSynchroniser;

namespace PowerTools.ComponentSynchroniser.Test
{
    class EmbeddedResourceComponentFactory: EmbeddedResourceItemFactory, IComponentFactory
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
