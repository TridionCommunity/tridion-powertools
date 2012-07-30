using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace SynchroniserTest
{
    class TextInputSchemaFactory: PowerTools.ISchemaFactory
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
