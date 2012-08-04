using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using Tridion.ContentManager.CoreService.Client;

namespace PowerTools.ComponentSynchroniser
{
    public interface IComponentFactory
    {
        XDocument GetComponent(string componentID);
        XDocument GetComponent(ComponentData component);
    }
}
