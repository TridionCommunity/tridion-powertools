using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using PowerTools.ComponentSynchroniser;

namespace PowerTools.ComponentSynchroniser.Test
{
    class TextInputSchemaFactory: ISchemaFactory
    {
        public TextInputSchemaFactory()
        {
        }
        public XDocument GetSchema(string schemaText)
        {
            return XDocument.Parse(schemaText);
        }
    }
}
