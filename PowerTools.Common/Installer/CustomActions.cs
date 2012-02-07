using System;
using System.Collections;
using System.ComponentModel;
using System.DirectoryServices;
using System.Globalization;
using System.Linq;
using System.Security.Permissions;


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

        protected IDictionary state;


        public CustomActions()
        {
            InitializeComponent();
        }

        [SecurityPermission(SecurityAction.Demand)]
        public override void Install(IDictionary stateSaver)
        {
            state = stateSaver;
            base.Install(stateSaver);
            CreateVirtualDirectories();
        }

        [SecurityPermission(SecurityAction.Demand)]
        public override void Commit(IDictionary savedState)
        {
            state = savedState;
            base.Commit(savedState);
        }

        [SecurityPermission(SecurityAction.Demand)]
        public override void Rollback(IDictionary savedState)
        {
            state = savedState;
            base.Rollback(savedState);
            DeleteVirtualDirectories();
        }

        [SecurityPermission(SecurityAction.Demand)]
        public override void Uninstall(IDictionary savedState)
        {
            state = savedState;
            base.Uninstall(savedState);
            DeleteVirtualDirectories();
        }


        /// <summary>
        /// Gets a virtual directory (by name) underneath the given directory.
        /// </summary>
        /// <param name="parent">The parent entry to search.</param>
        /// <param name="childName">The name of the virtual directory to return.</param>
        /// <returns></returns>
        protected DirectoryEntry GetChildVirtualDirectory(DirectoryEntry parent, string childName)
        {
            if (parent == null)
            {
                throw new ArgumentNullException("parent");
            }

            return (from entry in parent.Children.Cast<DirectoryEntry>()
                    let entryType = entry.SchemaClassName
                    where entry.Name == childName
                    where entryType == SchemaNameVirtualDir || entryType == SchemaNameWebDirectory
                    select entry).FirstOrDefault();
        }


        /// <summary>
        /// Creates the PowerTools virtual directories under the existing WebUI\Editors and WebUI\Models virtual directories.
        /// </summary>
        protected void CreateVirtualDirectories()
        {
            const string TargetDirectoryName = "PowerTools";

            string websiteId = Context.Parameters["CME_WEBSITE_ID"] as string;
            if (string.IsNullOrEmpty(websiteId))
            {
                throw new Exception(Resources.ErrorWebsiteIdNotSet);
            }

            string targetDir = Context.Parameters["TARGETDIR"] as string;
            if (string.IsNullOrEmpty(targetDir))
            {
                throw new Exception(Resources.ErrorTargetDirNotSet);
            }

            using (DirectoryEntry w3svc1 = new DirectoryEntry("IIS://Localhost/W3SVC"))
            {
                var site = w3svc1.Children.Find(websiteId, SchemaNameWebsite);
                if (site == null)
                {
                    throw new Exception(string.Format(CultureInfo.InvariantCulture, Resources.ErrorWebsiteNotFound, websiteId));
                }

                var root = GetChildVirtualDirectory(site, "ROOT");
                if (root == null)
                {
                    throw new Exception(Resources.ErrorWebsiteEmpty);
                }

                var webUiDir = GetChildVirtualDirectory(root, "WebUI");
                if (webUiDir == null)
                {
                    throw new Exception(Resources.ErrorWebUiNotFound);
                }

                var editorsDir = GetChildVirtualDirectory(webUiDir, "Editors");
                if (editorsDir == null)
                {
                    throw new Exception(Resources.ErrorEditorsVirtualDirNotFound);
                }

                DirectoryEntry virtualDirectory;

                if (GetChildVirtualDirectory(editorsDir, TargetDirectoryName) == null)
                {
                    virtualDirectory = editorsDir.Children.Add(TargetDirectoryName, SchemaNameVirtualDir);
                    virtualDirectory.Properties["Path"][0] = targetDir + "Editor";
                    virtualDirectory.CommitChanges();

                    // Remember the path to this virtual directory for later uninstallation / rollback
                    state.Add(KeyEditorVirtualDirectoryPath, virtualDirectory.Path);
                }

                var modelsDir = GetChildVirtualDirectory(webUiDir, "Models");
                if (modelsDir == null)
                {
                    throw new Exception(Resources.ErrorModelsVirtualDirNotFound);
                }

                if (GetChildVirtualDirectory(modelsDir, TargetDirectoryName) == null)
                {
                    virtualDirectory = modelsDir.Children.Add(TargetDirectoryName, SchemaNameVirtualDir);
                    virtualDirectory.Properties["Path"][0] = targetDir + "Model";
                    virtualDirectory.CommitChanges();

                    // Remember the path to this virtual directory for later uninstallation / rollback
                    state.Add(KeyModelVirtualDirectoryPath, virtualDirectory.Path);
                }
            }
        }

        /// <summary>
        /// Deletes the virtual directories created during installation.
        /// </summary>
        protected void DeleteVirtualDirectories()
        {
            DeleteVirtualDirectory(state[KeyEditorVirtualDirectoryPath] as string);
            DeleteVirtualDirectory(state[KeyModelVirtualDirectoryPath] as string);
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

            DirectoryEntry virtualDirectory = new DirectoryEntry(metapath);
            if (virtualDirectory != null)
            {
                using (DirectoryEntry parent = virtualDirectory.Parent)
                {
                    parent.Children.Remove(virtualDirectory);
                    parent.CommitChanges();
                }
            }
        }
    }
}
