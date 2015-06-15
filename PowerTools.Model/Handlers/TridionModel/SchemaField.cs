using System.Collections.Generic;

namespace PowerTools.Model.Handlers.TridionModel
{
    class SchemaField
    {
        public SchemaField()
        {
            AllowedSchemas = new List<string>();
        }

        public SchemaField(string xmlName, string description, string fieldType, bool required, bool multiValue)
        {
            XmlName = xmlName;
            Description = description;
            FieldType = fieldType;
            Required = required;
            MultiValue = multiValue;

            AllowedSchemas = new List<string>();
        }

        public string XmlName { get; set; }
        public string Description { get; set; }
        public string FieldType { get; set; }

        public bool Required { get; set; }
        public bool MultiValue { get; set; }
        public string Properties { get; set; }

        public List<string> AllowedSchemas { get; set; }
        public string ExternalUrl { get; set; }
        public string EmbeddedSchema { get; set; }

    }
}
