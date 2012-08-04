using System;
using System.Collections;
using System.ComponentModel;
using System.DirectoryServices;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Permissions;
using System.Xml.Linq;
using System.Text;


namespace PowerTools.Common.Installer
{
    [RunInstaller(true)]
    public partial class CustomActions : System.Configuration.Install.Installer
    {
        const string SchemaNameWebsite = "IIsWebServer";
        const string SchemaNameVirtualDir = "IIsWebVirtualDir";
        const string SchemaNameWebDirectory = "IIsWebDirectory";
        const string KeyEditorVirtualDirectoryPath = "PowerTools_EditorVirtualDirectoryPath";
        const string KeyModelVirtualDirectoryPath = "PowerTools_ModelVirtualDirectoryPath";
        const string EditorAndModelName = "PowerTools";
        const string VirtualDirectoryName = "PowerTools";

        protected IDictionary State;

        // ReSharper disable InconsistentNaming
        protected XNamespace cfg = "http://www.sdltridion.com/2009/GUI/Configuration";
        // ReSharper restore InconsistentNaming


        public CustomActions()
        {
            InitializeComponent();
            
        }

        [SecurityPermission(SecurityAction.Demand)]
        public override void Install(IDictionary stateSaver)
        {
            State = stateSaver;
            base.Install(stateSaver);
            CreateVirtualDirectories();
            AddToCmeConfiguration();                     
            
            //ManageInstalledPowerTools();
        }

        private void ManageInstalledPowerTools()
        {            
            //CustomInstallerView.SelectPowerTools frmSelectPowerTools = new CustomInstallerView.SelectPowerTools(this.Context);
            //frmSelectPowerTools.ShowDialog();
            //frmSelectPowerTools.Focus();
        }

        [SecurityPermission(SecurityAction.Demand)]
        public override void Commit(IDictionary savedState)
        {
            State = savedState;
            base.Commit(savedState);
        }

        [SecurityPermission(SecurityAction.Demand)]
        public override void Rollback(IDictionary savedState)
        {
            State = savedState;
            base.Rollback(savedState);
            DeleteVirtualDirectories();
            RemoveFromCmeConfiguration();
        }

        [SecurityPermission(SecurityAction.Demand)]
        public override void Uninstall(IDictionary savedState)
        {
            State = savedState;
            base.Uninstall(savedState);
            DeleteVirtualDirectories();
            RemoveFromCmeConfiguration();
        }

        #region Utility methods

        protected string GetTargetDir()
        {
            string result = Context.Parameters["TARGETDIR"];
            if (string.IsNullOrEmpty(result))
            {
                throw new Exception(Resources.ErrorTargetDirNotSet);
            }

            return result.TrimEnd('\\');
        }

        protected string GetCmeConfigurationFileName()
        {
            string webRoot = Context.Parameters["CME_WEBROOT"];
            if (string.IsNullOrEmpty(webRoot))
            {
                throw new Exception("The WebRoot directory was not passed into the custom action.");
            }

            webRoot = webRoot.TrimEnd('\\');

            string configurationDir = Path.Combine(webRoot, "Configuration");
            return Path.Combine(configurationDir, "System.config");
        }

        #endregion

        #region Virtual directories

        /// <summary>
        /// Returns the Content Manager Explorer website based on the CME_WEBSITE_ID parameter.
        /// </summary>
        /// <param name="iisAdmin">The W3SVC DirectoryEntry.</param>
        /// <returns>DirectoryEntry for the installed website</returns>
        protected DirectoryEntry GetWebsite(DirectoryEntry iisAdmin)
        {
            string websiteId = Context.Parameters["CME_WEBSITE_ID"];
            if (string.IsNullOrEmpty(websiteId))
            {
                throw new Exception(Resources.ErrorWebsiteIdNotSet);
            }

            try
            {
                return iisAdmin.Children.Find(websiteId, SchemaNameWebsite);
            }
            catch (DirectoryNotFoundException)
            {
                throw new Exception(string.Format(CultureInfo.InvariantCulture, Resources.ErrorWebsiteNotFound, websiteId));
            }
        }

        /// <summary>
        /// Gets a virtual directory (by name) underneath the given directory.
        /// </summary>
        /// <param name="parent">The parent entry to search.</param>
        /// <param name="childName">The name of the virtual directory to return.</param>
        /// <returns>A DirectoryEntry for the specified virtual directory, or null if not found.</returns>
        protected DirectoryEntry GetChildVirtualDirectory(DirectoryEntry parent, string childName)
        {
            return GetChildVirtualDirectory(parent, childName, null);
        }

        /// <summary>
        /// Gets a virtual directory (by name) underneath the given directory.
        /// </summary>
        /// <param name="parent">The parent entry to search.</param>
        /// <param name="childName">The name of the virtual directory to return.</param>
        /// <param name="errorMessageIfNull">If set, an exception is thrown with the given message if the virtual directory is not found.</param>
        /// <returns>A DirectoryEntry for the specified virtual directory, or null if not found.</returns>
        protected DirectoryEntry GetChildVirtualDirectory(DirectoryEntry parent, string childName, string errorMessageIfNull)
        {
            if (parent == null)
            {
                throw new ArgumentNullException("parent");
            }

            var result = (from entry in parent.Children.Cast<DirectoryEntry>()
                    let entryType = entry.SchemaClassName
                    where entry.Name == childName
                    where entryType == SchemaNameVirtualDir || entryType == SchemaNameWebDirectory
                    select entry).FirstOrDefault();

            if (result == null && !string.IsNullOrEmpty(errorMessageIfNull))
            {
                throw new Exception(errorMessageIfNull);
            }

            return result;
        }


        /// <summary>
        /// Creates the PowerTools virtual directories under the existing WebUI\Editors and WebUI\Models virtual directories.
        /// </summary>
        protected void CreateVirtualDirectories()
        {
            const string targetDirectoryName = "PowerTools";

            string targetDir = GetTargetDir();

            using (var iisAdmin = new DirectoryEntry("IIS://Localhost/W3SVC"))
            {
                var site = GetWebsite(iisAdmin);
                var root = GetChildVirtualDirectory(site, "ROOT", Resources.ErrorWebsiteEmpty);
                var webUiDir = GetChildVirtualDirectory(root, "WebUI", Resources.ErrorWebUiNotFound);
                var editorsDir = GetChildVirtualDirectory(webUiDir, "Editors", Resources.ErrorEditorsVirtualDirNotFound);

                DirectoryEntry virtualDirectory;

                if (GetChildVirtualDirectory(editorsDir, targetDirectoryName) == null)
                {
                    virtualDirectory = editorsDir.Children.Add(targetDirectoryName, SchemaNameVirtualDir);
                    virtualDirectory.Properties["Path"][0] = Path.Combine(targetDir, "Editor");
                    virtualDirectory.CommitChanges();

                    // Remember the path to this virtual directory for later uninstallation / rollback
                    State.Add(KeyEditorVirtualDirectoryPath, virtualDirectory.Path);
                }

                var modelsDir = GetChildVirtualDirectory(webUiDir, "Models", Resources.ErrorModelsVirtualDirNotFound);
                if (GetChildVirtualDirectory(modelsDir, targetDirectoryName) == null)
                {
                    virtualDirectory = modelsDir.Children.Add(targetDirectoryName, SchemaNameVirtualDir);
                    virtualDirectory.Properties["Path"][0] = Path.Combine(targetDir, "Model");
                    virtualDirectory.CommitChanges();

                    // Remember the path to this virtual directory for later uninstallation / rollback
                    State.Add(KeyModelVirtualDirectoryPath, virtualDirectory.Path);
                }
            }
        }

        /// <summary>
        /// Deletes the virtual directories created during installation.
        /// </summary>
        protected void DeleteVirtualDirectories()
        {
            DeleteVirtualDirectory(State[KeyEditorVirtualDirectoryPath] as string);
            DeleteVirtualDirectory(State[KeyModelVirtualDirectoryPath] as string);
        }

        /// <summary>
        /// Deletes a single virtual directory, given its full path.
        /// </summary>
        /// <param name="metapath">The full path to the directory (as retrieved by the Path property on DirectoryEntry)</param>
        protected void DeleteVirtualDirectory(string metapath)
        {
            if (string.IsNullOrEmpty(metapath))
            {
                return;
            }

            try
            {
                var virtualDirectory = new DirectoryEntry(metapath);
                using (var parent = virtualDirectory.Parent)
                {
                    parent.Children.Remove(virtualDirectory);
                    parent.CommitChanges();
                }
            }
            catch (COMException)
            {
                // This is raised if the virtual directory does not exist. 
                // In that case, we don't have to do anything.
            }
        }

        #endregion

        #region CME configuration (System.config)

        /// <summary>
        /// Adds the Model and Editor configuration settings to System.config.
        /// </summary>
        protected void AddToCmeConfiguration()
        {
            string targetDir = GetTargetDir();

            XDocument configuration = XDocument.Load(GetCmeConfigurationFileName());

            var editorsNode = configuration.Descendants(cfg + "editors").FirstOrDefault();
            var modelsNode = configuration.Descendants(cfg + "models").FirstOrDefault();

            CreateModelOrEditorNode(editorsNode, "editor", EditorAndModelName, Path.Combine(targetDir, "Editor"), @"Configuration\Editor.config", VirtualDirectoryName);
            CreateModelOrEditorNode(modelsNode, "model", EditorAndModelName, Path.Combine(targetDir, "Model"), @"Configuration\Model.config", VirtualDirectoryName);
            configuration.Save(GetCmeConfigurationFileName());
        }

        protected void CreateModelOrEditorNode(XElement parent, string elementName, string name, string installPath, string configFile, string vdir)
        {
            var powerToolsNode = new XElement(cfg + elementName);
            powerToolsNode.SetAttributeValue("name", name);

            var node = new XElement(cfg + "installpath");
            node.SetValue(installPath);
            powerToolsNode.Add(node);

            node = new XElement(cfg + "configuration");
            node.SetValue(configFile);
            powerToolsNode.Add(node);

            node = new XElement(cfg + "vdir");
            node.SetValue(vdir);
            powerToolsNode.Add(node);

            parent.Add(powerToolsNode);
        }

        /// <summary>
        /// Removes the Model and Editor configuration settings from System.config.
        /// </summary>
        protected void RemoveFromCmeConfiguration()
        {
            var configuration = XDocument.Load(GetCmeConfigurationFileName());

            var nodesToRemove = (from node in configuration.Descendants()
                                 let elemName = node.Name
                                 let nameAttr = node.Attribute("name")
                                 where (elemName == cfg + "editor") || (elemName == cfg + "model")
                                 where nameAttr != null && nameAttr.Value == EditorAndModelName
                                 select node).ToList();

            if (nodesToRemove.Any())
            {
                nodesToRemove.Remove();
                configuration.Save(GetCmeConfigurationFileName());
            }
        }

        #endregion
    }


}
