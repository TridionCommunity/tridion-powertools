using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace PowerTools.ComponentSynchroniser
{
    public interface ISchemaFactory
    {
        XDocument GetSchema(string schemaID);
    }
}
