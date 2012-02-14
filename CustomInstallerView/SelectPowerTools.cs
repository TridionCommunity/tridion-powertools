using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.IO;
using System.Xml.Linq;
using CustomInstallerView.StringExtensions;

namespace CustomInstallerView
{
    public partial class SelectPowerTools : Form
    {
        System.Configuration.Install.InstallContext formContext;
        protected XNamespace merge = XNamespace.Get("http://www.sdltridion.com/2009/GUI/Configuration/Merge");
        protected XNamespace cfg = XNamespace.Get("http://www.sdltridion.com/2009/GUI/Configuration");
        protected XNamespace ext = XNamespace.Get("http://www.sdltridion.com/2009/GUI/extensions");
        protected XNamespace cmenu = XNamespace.Get("http://www.sdltridion.com/2009/GUI/extensions/ContextMenu");

        public SelectPowerTools()
        {
            InitializeComponent();
        }

        public SelectPowerTools(System.Configuration.Install.InstallContext context)
        {
            formContext = context;
            InitializeComponent();
            this.CenterToScreen();
            
        }

        private void SelectPowerTools_Load(object sender, EventArgs e)
        {
            XElement editor = XElement.Load(GetPTEditorConfigurationFileName());           

            //Get list of powertools
            var powerTools = editor.DescendantsAndSelf(merge + "pt");

            //Create checkboxes for each powertool
            powerTools.ToList().ForEach(
                pt =>
                addToPanel(pt)                
            );

        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            //Not sure about this button yet. Should it be here or not?
            this.Close();
        }
        
        private void btnNext_Click(object sender, EventArgs e)
        {
            CommentOut(GetPowerToolsToRemove());

            this.Close();
        }
        
        private void btnSelectGeneral_Click(object sender, EventArgs e)
        {
            ToggleSelection(panelGeneral);
        }

        private void btnSelectSystem_Click(object sender, EventArgs e)
        {
            ToggleSelection(panelSystem);
        }

        private void btnSelectDevelopers_Click(object sender, EventArgs e)
        {
            ToggleSelection(panelDevelopers);
        }
       
        #region Utilities

        private void addToPanel(XElement powerTool)
        {
            string category = "general";
            if (powerTool.Attribute("category") != null && powerTool.Attribute("category").Value != null)
            {
                category = powerTool.Attribute("category").Value;
            }

            switch (category.ToLower(System.Globalization.CultureInfo.InvariantCulture))
            {
                case "system":
                    AddChecboxToPanel(panelSystem, powerTool);
                    break;
                case "developers":
                    AddChecboxToPanel(panelDevelopers, powerTool);
                    break;
                case "general":
                default:
                    AddChecboxToPanel(panelGeneral, powerTool);
                    break;
            }
        }

        private void AddChecboxToPanel(Panel panel, XElement powerTool)
        {
            int counter = CountCheckBoxes(panel);
            panel.Controls.Add(new CheckBox
            {
                Text = powerTool.Value,
                Tag = powerTool.Attribute("id").Value,
                Size = new System.Drawing.Size(200, 16),
                Location = new Point(10, counter * 15),
                Checked = true
            });
        }

        private int CountCheckBoxes(Panel panel)
        {
            int counter = 0;
            foreach (var ctrl in panel.Controls)
            {
                if (ctrl is CheckBox)
                {
                    counter++;
                }
            }
            return counter;
        }       

        /// <summary>
        /// Comments out the relevant config in the Editor.config
        /// It does this by searching the xml for Elements which contain(!) the id as mentioned in the Editor.config (<pt id="powrtoolId"...>)
        /// It also searches all attributes if they contain the id. The id can contain more than 1 id's. They must be comma seperated.
        /// </summary>
        /// <param name="powerTools">List of id's (powertools) to search for and to comment out</param>
        private void CommentOut(List<string> powerTools)
        {
            List<XElement> elemsToCommentOut = new List<XElement>();
            var editorPath = GetPTEditorConfigurationFileName();
            XElement editor = XElement.Load(editorPath);

            foreach (var pt in powerTools)
            {
                //Node (text value's)
                var foundNodes = editor.DescendantNodesAndSelf()
                    .Where(node => node.NodeType.Equals(System.Xml.XmlNodeType.Text))
                    .Select(node => node)
                    .Where(node => node.ToString().Contains(pt, StringComparison.InvariantCultureIgnoreCase))
                    .Select(node => node.Parent);

                //attributes
                var foundNodes2 = editor.DescendantsAndSelf().Attributes()
                    .Where(attr => attr.Value.ToString().Contains(pt, StringComparison.InvariantCultureIgnoreCase))
                    .Select(attr => attr.Parent);

                //Merge found elements
                elemsToCommentOut.AddRange(foundNodes2.Union(foundNodes));

                //Comment out the elements. Don't comment out the powertool in the list of powertools
                elemsToCommentOut.Where(elem => !elem.Ancestors(merge + "listofpowertools").Any())
                    .Where(elem => elem.Parent != null)
                    .ToList()
                    .ForEach(elem =>
                        elem.ReplaceWith(new XComment(elem.ToString())));
            }

            //Save Editor configuration file
            editor.Save(editorPath);

        }

        /// <summary>
        /// Reads the checkboxes and constructs a list with PowerTools which will not be installed
        /// </summary>
        /// <returns></returns>
        private List<string> GetPowerToolsToRemove()
        {
            List<string> returnValue = new List<string>();
            List<Panel> panels = new List<Panel>() {panelDevelopers, panelGeneral, panelSystem };
            
            List<Control> ctrls = new List<Control>();            
            panels.ForEach(pan => ctrls.AddRange(pan.Controls.Cast<Control>()));           

            foreach (var ctrl in ctrls)
            {
                if (ctrl is CheckBox)
                {
                    CheckBox c = ctrl as CheckBox;
                    if (c != null)
                    {
                        if (!c.Checked)
                        {                            
                            returnValue.AddRange(c.Tag.ToString().Split(',').ToList());
                        }
                    }
                }
            }

            return returnValue;
        }


        private void ToggleSelection(Panel panel)
        {
            //If first control is selected, deselect everything, else select everything
            bool selected = false;
            int counter = 0;
            foreach (var checkBoxControl in panel.Controls)
            {
                if (checkBoxControl is CheckBox)
                {
                    if (counter == 0)
                    {
                        selected = !(checkBoxControl as CheckBox).Checked;
                    }

                    (checkBoxControl as CheckBox).Checked = selected;
                    counter++;
                }
            }
        }

        protected string GetTargetDir()
        {
            string result = formContext.Parameters["TARGETDIR"] as string;
            if (string.IsNullOrEmpty(result))
            {
                throw new Exception("Target directory could not be determined.");
            }

            return result.TrimEnd('\\');
        }

        protected string GetPTEditorConfigurationFileName()
        {
            return Path.Combine(GetTargetDir(), "Editor", "Configuration", "Editor.config");
        }
        #endregion

        

       

       
    }
}
