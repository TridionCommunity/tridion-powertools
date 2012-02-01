using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Web;
using PowerTools.Common.CoreService;
using PowerTools.Common.Handlers.Model;
using Tridion.ContentManager.CoreService.Client;

namespace PowerTools.Common.Handlers
{
    public class DocumentItemHandler : IHttpHandler, IDisposable
    {

        private const string FIELD_TYPE_TEXT = "Text";
        private const string FIELD_TYPE_MULTILINE_TEXT = "MultiLine Text";
        private const string FIELD_TYPE_RTF = "RTF";
        private const string FIELD_TYPE_NUMBER = "Number";
        private const string FIELD_TYPE_DATE = "Date";
        private const string FIELD_TYPE_COMPONENT_LINK = "Component Link";
        private const string FIELD_TYPE_MULTIMEDIA_LINK = "Multimedia Link";
        private const string FIELD_TYPE_EXTERNAL_LINK = "External Link";
        private const string FIELD_TYPE_EMBEDDED = "Embedded Schema";


        private const string TEXT_DEFAULT_VALUE = "Default Value: ";
        private const string TEXT_LIST_OF_VALUES = "List of values: ";
        private const string TEXT_VALUES_FROM_CATEGORY = "Values from Category: ";
        private const string TEXT_HEIGHT = "Height: ";
        private const string TEXT_ALLOWED_SCHEMAS = "Allowed Schemas: ";
        private const string TEXT_EMBEDDED_SCHEMA = "Embedded Schema: ";

        public bool IsReusable
        {
            get { return false; }
        }

        public void  ProcessRequest(HttpContext context)
        {
            const string TEMPLATE_FOLDER = @"Editors\PowerTools\PowerTools\Client\DocumentItem";
            const string SCHEMA_TEMPLATE_FILENAME = "schema.docx";

            byte[] binWordFile = null;
            string responseFileName = string.Empty;

            try
            {
                string id = context.Request.QueryString["id"];

                if (string.IsNullOrEmpty(id))
                {
                    throw new Exception("Id paramter is invalid.");
                }

                Schema schemaData = getSchemaData(id);
                if (schemaData == null)
                {
                    throw new Exception("SchemaData is null.");
                }


                WordHelper wordHelper = new WordHelper();

                string templateLocation = Path.Combine(context.Server.MapPath(TEMPLATE_FOLDER), SCHEMA_TEMPLATE_FILENAME);

                binWordFile = wordHelper.CreateWordDocument(schemaData, templateLocation);

                responseFileName = getFileName(schemaData.Title, id);
            }
            catch (Exception ex)
            {

                context.Response.Clear();
                context.Response.Output.WriteLine("ERROR");
                context.Response.Output.WriteLine(ex.Message);
                if (ex.InnerException != null)
                {
                    context.Response.Output.WriteLine("<br />");
                    context.Response.Output.WriteLine(ex.InnerException.Message);
                }
                context.Response.End();
            }

            context.Response.Clear();
            context.Response.ContentType = "x-world/x-vrml";
            context.Response.AddHeader("Content-Disposition", "attachment;filename=" + responseFileName);
            context.Response.AddHeader("Content-Length", binWordFile.Length.ToString());
            context.Response.OutputStream.Write(binWordFile, 0, binWordFile.Length);
            context.Response.End();

        }

        private string getFileName(string title, string id)
        {
            return "Schema_" + title.Replace(" ", "_") + "_" + id + ".docx";
        }
        
        private Schema getSchemaData(string id)
        {

            SchemaData item = null;
            SchemaFieldsData schemaFields = null;

            try
            {

                using (var coreService = Client.GetCoreService())
                {
                    item = coreService.Read(id, new ReadOptions()) as SchemaData;
                    schemaFields = coreService.ReadSchemaFields(id, true, new ReadOptions());
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }



            Schema schema = new Schema();

            schema.Title = item.Title;
            schema.Description = item.Description;
            schema.RootElementName = item.RootElementName;
            schema.NamespaceUri = item.NamespaceUri;
            schema.LocationInfo = item.LocationInfo.Path;
            schema.SchemaType = item.Purpose.Value.ToString();

            schema.Fields = getFieldsDescription(schemaFields.Fields);
            schema.MetadataFields = getFieldsDescription(schemaFields.MetadataFields);

            return schema;
        }

        


        private List<SchemaField> getFieldsDescription(ItemFieldDefinitionData[] schemaFields)
        {
            List<SchemaField> fieldsDescription = new List<SchemaField>();

            if (schemaFields == null)
                return fieldsDescription;

            foreach (var field in schemaFields)
            {

                SchemaField newfield = new SchemaField();
                newfield.XmlName = field.Name;
                newfield.Required = field.MinOccurs == 1;
                newfield.MultiValue = field.MaxOccurs != 1;
                newfield.Description = field.Description;
           
            
                if (field is SingleLineTextFieldDefinitionData)
                {
                    newfield.FieldType = FIELD_TYPE_TEXT;
                    StringBuilder sb = new StringBuilder();

                    if (!string.IsNullOrEmpty(((SingleLineTextFieldDefinitionData) field).DefaultValue))
                        sb.Append(TEXT_DEFAULT_VALUE);
                    sb.Append(((SingleLineTextFieldDefinitionData) field).DefaultValue);

                    if (((SingleLineTextFieldDefinitionData)field).List != null && ((SingleLineTextFieldDefinitionData)field).List.Entries.Length > 0)
                    {
                        if (sb.Length != 0)
                            sb.Append(Environment.NewLine);
                        sb.Append(TEXT_LIST_OF_VALUES);

                        foreach (string entry in ((SingleLineTextFieldDefinitionData) field).List.Entries)
                        {
                            sb.Append(Environment.NewLine);
                            sb.Append(entry);
                        }
                    }

                    newfield.Properties = sb.ToString();
                }
                else if (field is KeywordFieldDefinitionData)
                {
                    newfield.FieldType = FIELD_TYPE_TEXT;
                    newfield.Properties = TEXT_VALUES_FROM_CATEGORY + ((KeywordFieldDefinitionData)field).Category.Title;
                }
                else if (field is MultiLineTextFieldDefinitionData)
                {
                    newfield.FieldType = FIELD_TYPE_MULTILINE_TEXT;
                
                    if (!string.IsNullOrEmpty(((MultiLineTextFieldDefinitionData)field).DefaultValue))
                        newfield.Properties = TEXT_DEFAULT_VALUE + ((MultiLineTextFieldDefinitionData)field).DefaultValue;

                    newfield.Properties += TEXT_HEIGHT + ((MultiLineTextFieldDefinitionData)field).Height;
                }
                else if (field is XhtmlFieldDefinitionData)
                {
                    newfield.FieldType = FIELD_TYPE_RTF;

                    if (!string.IsNullOrEmpty(((XhtmlFieldDefinitionData)field).DefaultValue))
                        newfield.Properties = TEXT_DEFAULT_VALUE + ((XhtmlFieldDefinitionData)field).DefaultValue;

                    newfield.Properties += TEXT_HEIGHT + ((XhtmlFieldDefinitionData)field).Height;
                }
                else if (field is NumberFieldDefinitionData)
                {
                    newfield.FieldType = FIELD_TYPE_NUMBER;

                    StringBuilder sb = new StringBuilder();


                    if (((NumberFieldDefinitionData)field).DefaultValue != null)
                    {
                        sb.Append(TEXT_DEFAULT_VALUE);
                        sb.Append(((NumberFieldDefinitionData) field).DefaultValue);
                    }

                    if (((NumberFieldDefinitionData)field).List != null && ((NumberFieldDefinitionData)field).List.Entries.Length > 0)
                    {
                        if (sb.Length != 0)
                            sb.Append(Environment.NewLine);

                        sb.Append(TEXT_LIST_OF_VALUES);

                        foreach (double entry in ((NumberFieldDefinitionData)field).List.Entries)
                        {
                            sb.Append(Environment.NewLine);
                            sb.Append(entry.ToString());
                        }
                    }

                    newfield.Properties = sb.ToString();


                }
                else if (field is DateFieldDefinitionData)
                {
                    newfield.FieldType = FIELD_TYPE_DATE;
                    StringBuilder sb = new StringBuilder();

                    if (((DateFieldDefinitionData)field).DefaultValue != null)
                    {
                        sb.Append(TEXT_DEFAULT_VALUE);
                        sb.Append(((DateFieldDefinitionData) field).DefaultValue);
                    }

                    if (((DateFieldDefinitionData)field).List != null && ((DateFieldDefinitionData)field).List.Entries.Length > 0)
                    {
                        if (sb.Length != 0)
                            sb.Append(Environment.NewLine);

                        sb.Append(TEXT_LIST_OF_VALUES);

                        foreach (DateTime entry in ((DateFieldDefinitionData)field).List.Entries)
                        {
                            sb.Append(Environment.NewLine);
                            sb.Append(entry.ToString());
                        }
                    }

                    newfield.Properties = sb.ToString();

                }
            
                else if (field is ComponentLinkFieldDefinitionData)
                {
                    newfield.FieldType = FIELD_TYPE_COMPONENT_LINK;
                    StringBuilder sb = new StringBuilder(TEXT_ALLOWED_SCHEMAS);
                
                    foreach (LinkToSchemaData schemaData in ((ComponentLinkFieldDefinitionData)field).AllowedTargetSchemas)
                    {
                        sb.Append(Environment.NewLine);
                        sb.Append(schemaData.Title);
                    }
                    newfield.Properties = sb.ToString();

                }
                else if (field is MultimediaLinkFieldDefinitionData)
                {
                    newfield.FieldType = FIELD_TYPE_MULTIMEDIA_LINK;
                    StringBuilder sb = new StringBuilder(TEXT_ALLOWED_SCHEMAS);
                    foreach (LinkToSchemaData schemaData in ((MultimediaLinkFieldDefinitionData)field).AllowedTargetSchemas)
                    {
                        sb.Append(Environment.NewLine);
                        sb.Append(schemaData.Title);
                    }
                    newfield.Properties = sb.ToString();
                }
                else if (field is ExternalLinkFieldDefinitionData)
                {
                    newfield.FieldType = FIELD_TYPE_EXTERNAL_LINK;
                    if (!string.IsNullOrEmpty(((ExternalLinkFieldDefinitionData)field).DefaultValue))
                        newfield.Properties = TEXT_DEFAULT_VALUE + ((ExternalLinkFieldDefinitionData)field).DefaultValue;

                }
                else if (field is EmbeddedSchemaFieldDefinitionData)
                {
                    newfield.FieldType = FIELD_TYPE_EMBEDDED;
                    newfield.Properties = TEXT_EMBEDDED_SCHEMA +
                                          ((EmbeddedSchemaFieldDefinitionData) field).EmbeddedSchema.Title;
                }

                fieldsDescription.Add(newfield);
            }

            return fieldsDescription;
        }

        public void Dispose()
        {
        
        }
    }
}


