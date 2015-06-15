using System.Collections.Generic;

namespace PowerTools.Model.Handlers.TridionModel
{
    class Schema
    {
        public Schema()
        {
            Fields = new List<SchemaField>();
            MetadataFields = new List<SchemaField>();
        }

        public string Title { get; set; }
        public string Description { get; set; }
        public string RootElementName { get; set; }
        public string NamespaceUri { get; set; }
        public string LocationInfo { get; set; }
        public string SchemaType { get; set; }

        public List<SchemaField> Fields { get; set; }
        public List<SchemaField> MetadataFields { get; set; }
    }
}
