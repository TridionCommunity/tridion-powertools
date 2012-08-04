using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using Tridion.ContentManager.CoreService.Client;
using PowerTools.ComponentSynchroniser;

namespace PowerTools.ComponentSynchroniser.Test
{
    class TextInputComponentFactory: IComponentFactory
    {
        public TextInputComponentFactory()
        {
        }
        public XDocument GetComponent(string componentText)
        {
            return XDocument.Parse(componentText);
        }
        public XDocument GetComponent(ComponentData componentData)
        {
            throw new NotSupportedException();
        }
    }
}
