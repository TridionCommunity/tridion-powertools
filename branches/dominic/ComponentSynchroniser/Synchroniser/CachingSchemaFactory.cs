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

        protected Dictionary<string, XDocument> cache = new Dictionary<string, XDocument>();

        public override XDocument GetSchema(string schemaID)
        {
            lock (cache)
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
        }

    }
}
