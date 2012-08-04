using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using System.Xml;

namespace PowerTools.ComponentSynchroniser
{
    class Ns
    {
        public static XNamespace tcm = "http://www.tridion.com/ContentManager/5.0";
        public static XNamespace xsd = "http://www.w3.org/2001/XMLSchema";
        private static NameTable nt = new NameTable();
        public static XmlNamespaceManager manager = new XmlNamespaceManager(nt);
        static Ns()
        {
            manager.AddNamespace("tcm", "http://www.tridion.com/ContentManager/5.0");
            manager.AddNamespace("xsd", "http://www.w3.org/2001/XMLSchema");
            manager.AddNamespace("tcmi", "http://www.tridion.com/ContentManager/5.0/Instance");
        }
        
    }
}
