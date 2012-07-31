using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using Tridion.ContentManager.CoreService.Client;


namespace PowerTools
{
    class CachingSchemaFactory : SchemaFactory
    {
        public CachingSchemaFactory(ISessionAwareCoreService coreService) : base(coreService) { }

        protected Dictionary<string, XDocument> cache;
        public override XDocument GetSchema(string schemaID)
        {
            if (this.cache.ContainsKey(schemaID))
            {
                return this.cache[schemaID];
            }
            else
            {
                XDocument schema = base.GetSchema(schemaID);
                this.cache.Add(schemaID, schema);
                return schema;
            }
        }

        public override XDocument GetSchema(SchemaData schemaData) 
        {
            string id = schemaData.Id;
            if (this.cache.ContainsKey(id))
            {
                return this.cache[id];
            }
            else
            {
                XDocument schema = base.GetSchema(schemaData);
                this.cache.Add(id, schema);
                return schema;
            }            
        }
    }
}
