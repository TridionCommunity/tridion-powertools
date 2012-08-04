using System;
using System.Xml.Linq;
using Tridion.ContentManager.CoreService.Client;

namespace PowerTools.ComponentSynchroniser
{
    class ComponentFactory : IComponentFactory
    {
        ISessionAwareCoreService coreService;
        public ComponentFactory(ISessionAwareCoreService coreService)
        {
            this.coreService = coreService;
        }

        public XDocument GetComponent(string componentID)
        {
            var component = (ComponentData)this.coreService.Read(componentID, new ReadOptions());
            
            XDocument xComponent = this.GetComponent(component);
            return xComponent;
        }
       
        public XDocument GetComponent(ComponentData component)
        {
            // Add the ID and WebDavURL just to stay sane.
            XDocument xComponent = XDocument.Parse(string.Format(
                "<tcm:Component ID='{0}' xmlns:tcm='http://www.tridion.com/ContentManager/5.0'/>", component.Id));
            xComponent.Root.Add(new XElement(Ns.tcm + "Info",
                                new XElement(Ns.tcm + "LocationInfo",
                                    new XElement(Ns.tcm + "WebDAVURL", component.LocationInfo.WebDavUrl))));
            xComponent.Root.Add(new XElement(Ns.tcm + "Data",
                                new XElement(Ns.tcm + "Content",
                                    XElement.Parse(component.Content))
                                    ));
            if (!String.IsNullOrEmpty(component.Metadata))
            {
                xComponent.Root.Element(Ns.tcm + "Data").Add(new XElement(Ns.tcm + "Metadata", XElement.Parse(component.Metadata)));
            }
            return xComponent;
        }
    }
}
