using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using System.Reflection;
using System.IO;

namespace PowerTools.ComponentSynchroniser.Test
{
    abstract class EmbeddedResourceItemFactory
    {
        protected XDocument LoadXDocumentFromEmbeddedResource(string resourceName)
        {
            Assembly executingAssembly = Assembly.GetExecutingAssembly();
            using (Stream manifestResourceStream = executingAssembly.GetManifestResourceStream(executingAssembly.GetName().Name + "." + resourceName))
            {
                return XDocument.Load(manifestResourceStream);
            }
        }
    }
}
