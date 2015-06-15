using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Script.Serialization;
using System.Xml.Linq;
using PowerTools.Model.Utils;
using Tridion.ContentManager.CoreService.Client;

namespace PowerTools.Model.Handlers
{
    public class FileTransferHandler : IHttpHandler, IDisposable
    {
        private static SessionAwareCoreServiceClient client = null;
        private static string StorageRoot = string.Format("{0}{1}", HttpContext.Current.Server.MapPath("TemporaryFiles"), "\\");
        private static XElement multiMediaTypes = null;
        private static XElement MultiMediaTypes
        {
            get
            {
                if (multiMediaTypes == null)
                {
                    multiMediaTypes = client.GetSystemWideListXml(new MultimediaTypesFilterData());
                }

                return multiMediaTypes;
            }

        }

        private static HashSet<string> _componentTitles;

        private readonly JavaScriptSerializer js = new JavaScriptSerializer();        

        private string orgItemUri = string.Empty;
        private string schemaUri = string.Empty;

        public void ProcessRequest(HttpContext context)
        {
            context.Response.AddHeader("Pragma", "no-cache");
            context.Response.AddHeader("Cache-Control", "private, no-cache");

            orgItemUri = getParam(context, "orgItemId");
            schemaUri = getParam(context,"schemaId");
            
            if (!string.IsNullOrEmpty(orgItemUri) && !string.IsNullOrEmpty(schemaUri))
            {
                HandleMethod(context);
            }



        }

        private string getParam(HttpContext ctx, string param)
        {
            if (ctx.Request[param] != null)
            {
                return ctx.Request[param];
            }
            return null;
        }

        // Upload file to the server
        private void UploadFile(HttpContext context)
        {
            var statuses = new List<FilesStatus>();
            var headers = context.Request.Headers;

            if (string.IsNullOrEmpty(headers["X-File-Name"]))
            {
                UploadWholeFile(context, statuses);
            }

            WriteJsonIframeSafe(context, statuses);
        }



        // Upload entire file
        private void UploadWholeFile(HttpContext context, List<FilesStatus> statuses)
        {
            client = CoreService.Client.GetCoreService();
            _componentTitles = getAllComponentTitles(orgItemUri);            
            for (int i = 0; i < context.Request.Files.Count; i++)
            {
                var file = context.Request.Files[i];
                file.SaveAs(StorageRoot + Path.GetFileName(file.FileName));
                
                string fullName = Path.GetFileName(file.FileName);                
                bool uploaded = UploadToTridion(StorageRoot + fullName);
                statuses.Add(new FilesStatus(fullName, file.ContentLength, uploaded));
            }
        }

        private void HandleMethod(HttpContext context)
        {
            switch (context.Request.HttpMethod)
            {
                case "POST":
                case "PUT":
                    UploadFile(context);
                    break;
                default:
                    context.Response.ClearHeaders();
                    context.Response.StatusCode = 405;
                    break;
            }
        }


        private void WriteJsonIframeSafe(HttpContext context, List<FilesStatus> statuses)
        {
            context.Response.AddHeader("Vary", "Accept");
            try
            {
                if (context.Request["HTTP_ACCEPT"].Contains("application/json"))
                    context.Response.ContentType = "application/json";
                else
                    context.Response.ContentType = "text/plain";
            }
            catch
            {
                context.Response.ContentType = "text/plain";
            }

            var jsonObj = js.Serialize(statuses.ToArray());
            context.Response.Write(jsonObj);
        }

        public class FilesStatus
        {            
            public string name { get; set; }
            public int size { get; set; }
            public bool uploadSuccess { get; set; }

            public FilesStatus() { }

            public FilesStatus(FileInfo fileInfo, bool success) { SetValues(fileInfo.Name, (int)fileInfo.Length, success); }

            public FilesStatus(string fileName, int fileLength, bool success) { SetValues(fileName, fileLength, success); }

            private void SetValues(string fileName, int fileLength, bool success)
            {
                name = fileName;               
                size = fileLength;             
                uploadSuccess = success;                
            }
        }

        public bool UploadToTridion(string fileName)
        {
            client = CoreService.Client.GetCoreService();
            try
            {
                string mmType = GetMultiMediaType(Path.GetExtension(fileName));
                if (mmType != null)
                {

                    BinaryContentData bcd = new BinaryContentData
                    {
                        UploadFromFile = fileName,
                        MultimediaType = new LinkToMultimediaTypeData { IdRef = mmType },
                        Filename = Path.GetFileName(fileName),
                        IsExternal = false
                    };

                    ComponentData compData = new ComponentData
                    {
                        LocationInfo = new LocationInfo
                        {
                            OrganizationalItem = new LinkToOrganizationalItemData
                            {
                                IdRef = orgItemUri //Organizational item
                            },
                        },
                        ComponentType = ComponentType.Multimedia,
                        Title = MakeValidFileName(Path.GetFileNameWithoutExtension(fileName)),

                        Schema = new LinkToSchemaData
                        {
                            IdRef = schemaUri 
                        },

                        IsBasedOnMandatorySchema = false,
                        IsBasedOnTridionWebSchema = true,
                        ApprovalStatus = new LinkToApprovalStatusData
                        {
                            IdRef = "tcm:0-0-0"
                        },
                        Id = "tcm:0-0-0",
                        BinaryContent = bcd
                    };

                    ComponentData comp = (ComponentData)client.Create(compData, new ReadOptions());
                    return true;
                }
            }
            catch (Exception ex)
            {
                string d = ex.Message;
            }
            finally
            {
                if (client != null)
                {
                    client.Close();
                }
            }

            return false;
        }

        private static string GetMultiMediaType(string extension)
        {
            //Strip of leading . from extension
            string ext = extension.StartsWith(".") ? extension.Substring(1) : extension;

			XNamespace tcm = "http://www.tridion.com/ContentManager/5.0";

			var result = from item in MultiMediaTypes.Descendants(tcm + "Item")
						   let fileExtensions = item.Attribute("FileExtensions")
						   let typeId = item.Attribute("ID")
						   where fileExtensions != null && fileExtensions.Value.Contains(ext)
						   where typeId != null
						   select typeId.Value;

            return result.FirstOrDefault();
        }

        public HashSet<string> getAllComponentTitles(string folderUri)
        {
            var titles = getComponentTitles(folderUri);


            //Also load titles from components in lower folders 
            BluePrintFilterData filter = new BluePrintFilterData();
            filter.ForItem = new LinkToRepositoryLocalObjectData { IdRef = folderUri };
            var bluePrintData = client.GetSystemWideListXml(filter);

            var allRelevantFolders = bluePrintData.Descendants(Namespaces.Tcm + "Item").Where(item => item.Attribute("IsShared").Value == "True");

            allRelevantFolders.ToList().ForEach(folder => getComponentTitles(folder.Attribute("ID").Value).ToList().ForEach(component => titles.Add(component)));


            return titles;



        }

        public HashSet<string> getComponentTitles(string folderUri)
        {
            OrganizationalItemItemsFilterData filterData = new OrganizationalItemItemsFilterData();
            filterData.ItemTypes = new[] { ItemType.Component };
            filterData.BaseColumns = ListBaseColumns.IdAndTitle;
            var result = client.GetListXml(folderUri, filterData);

            if (result != null && result.Descendants(Namespaces.Tcm + "Item").Count() > 0)
                return result.Descendants(Namespaces.Tcm + "Item")
                             .Select(item => item.Attribute("Title").Value).ToHashSet();

            return new HashSet<string>();

        }


        private static string MakeValidFileName(string name)
        {
            string invalidChars = Regex.Escape(new string(Path.GetInvalidFileNameChars()));
            string invalidReStr = string.Format(@"[{0}]+", invalidChars);
            var componentTitle = Regex.Replace(name, invalidReStr, "_");

            if (_componentTitles.Contains(componentTitle))
            {
                for (int i = 1; i < 1000; i++)
                {
                    var componentTitleAdjusted = string.Format("{0} [{1}]", componentTitle, i.ToString());
                    if (!_componentTitles.Contains(componentTitleAdjusted))
                    {
                        _componentTitles.Add(componentTitleAdjusted);
                        return componentTitleAdjusted;
                    }
                }
            }

            return componentTitle;
        }
        public void Dispose()
        {
            throw new NotImplementedException();
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}


