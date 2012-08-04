using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Tridion.ContentManager.CoreService.Client;
using System.Xml.Linq;

namespace PowerTools.ComponentSynchroniser
{
    class SchemaFactory : ISchemaFactory
    {
        public readonly ISessionAwareCoreService coreService;
        public SchemaFactory(ISessionAwareCoreService coreService)
        {
            this.coreService = coreService;
        }

        public virtual XDocument GetSchema(string schemaID)
        {
            var schemaData = (SchemaData)this.coreService.Read(schemaID, new ReadOptions());
            return GetSchema(schemaData);
        }

        public XDocument GetSchema(SchemaData schemaData)
        {
            var schemaDoc = XDocument.Parse("<SchemaContainer/>");
            schemaDoc.Root.Add(XDocument.Parse(schemaData.Xsd).Root);
            // We'll need the RootElementName for the transform, so the simplest thing is just to add it here.
            schemaDoc.Root.Element(Ns.xsd + "schema").Add(new XAttribute("RootElementName", schemaData.RootElementName));
            if ((bool)schemaData.IsTridionWebSchema)
            {                
                // Adds SchemaFields XML that ought to look something like this, enabling the XSLT to check if a value is correct against the category that the field is based on
                // I have considered doing this from the TcmResolver instead (with a query parameter added to the URI of the schema). I've decided to stick with this, because it's 
                // simpler, and well, you always need this data if it's present, so might as well grab it up front. 
                  // <CategoryFieldsEnums>
                  //   <tcm:ListKeywords Managed="1024" xmlns:tcm="http://www.tridion.com/ContentManager/5.0" FieldName="ColoursOne">
                  //    <tcm:Item ID="tcm:21-513-1024" Type="1024" Title="Green" Lock="0" IsRoot="true" Modified="2012-07-07T18:31:16" Key="" IsAbstract="false" CategoryTitle="Colours" CategoryID="tcm:21-59-512" Icon="T1024L0P0" Allow="268560384" Deny="96" IsNew="false" />
                  //    <tcm:Item ID="tcm:21-512-1024" Type="1024" Title="Mauve" Lock="0" IsRoot="true" Modified="2012-07-07T18:31:09" Key="" IsAbstract="false" CategoryTitle="Colours" CategoryID="tcm:21-59-512" Icon="T1024L0P0" Allow="268560384" Deny="96" IsNew="false" />
                  //    <tcm:Item ID="tcm:21-515-1024" Type="1024" Title="Pink" Lock="0" IsRoot="true" Modified="2012-07-07T18:31:32" Key="" IsAbstract="false" CategoryTitle="Colours" CategoryID="tcm:21-59-512" Icon="T1024L0P0" Allow="268560384" Deny="96" IsNew="false" />
                  //    <tcm:Item ID="tcm:21-511-1024" Type="1024" Title="Red" Lock="0" IsRoot="true" Modified="2012-07-07T18:31:01" Key="" IsAbstract="false" CategoryTitle="Colours" CategoryID="tcm:21-59-512" Icon="T1024L0P0" Allow="268560384" Deny="96" IsNew="false" />
                  //    <tcm:Item ID="tcm:21-517-1024" Type="1024" Title="Scarlet" Lock="0" IsRoot="false" Modified="2012-07-07T18:32:08" Key="" IsAbstract="false" CategoryTitle="Colours" CategoryID="tcm:21-59-512" Icon="T1024L0P0" Allow="268560384" Deny="96" IsNew="false" />
                  //    <tcm:Item ID="tcm:21-514-1024" Type="1024" Title="Yellow" Lock="0" IsRoot="true" Modified="2012-07-07T18:31:23" Key="" IsAbstract="false" CategoryTitle="Colours" CategoryID="tcm:21-59-512" Icon="T1024L0P0" Allow="268560384" Deny="96" IsNew="false" />
                  //  </tcm:ListKeywords>
                  //</CategoryFieldsEnums>

                var categoryFieldEnums = XDocument.Parse("<CategoryFieldsEnums/>");
                var fieldsData = coreService.ReadSchemaFields(schemaData.Id, true, new ReadOptions());
                foreach (var field in fieldsData.Fields)
                {
                    var keywordField = field as KeywordFieldDefinitionData;
                    if (keywordField != null)
                    {
                        var categoryList = this.coreService.GetListXml(keywordField.Category.IdRef, new KeywordsFilterData());
                        categoryList.Add(new XAttribute("FieldName", keywordField.Name));
                        categoryFieldEnums.Root.Add(categoryList);
                    }
                }
                schemaDoc.Root.Add(categoryFieldEnums.Root);
            }
            return schemaDoc;
        }
    }
}
