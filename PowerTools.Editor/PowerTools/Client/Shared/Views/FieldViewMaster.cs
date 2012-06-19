using System;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using Tridion.Web.UI.Core.Controls;

namespace PowerTools.Editor.PowerTools.Client.Shared.Views
{
    public class FieldViewMaster : MasterPage
    {
        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            var contentPlaceHolder = FindControl("Main");
            if (contentPlaceHolder == null) return;

            var manager = new TridionManager { Editor = "PowerTools" };

            var dependency = new HtmlGenericControl("dependency") { InnerText = "Tridion.Web.UI.Editors.CME" };
            manager.dependencies.Add(dependency);

            dependency = new HtmlGenericControl("dependency") { InnerText = "Tridion.Web.UI.Editors.CME.commands" };
            manager.dependencies.Add(dependency);

            dependency = new HtmlGenericControl("dependency") { InnerText = "Tridion.Web.UI.fieldbuilder" };
            manager.dependencies.Add(dependency);

            contentPlaceHolder.Controls.Add(manager);
        }
    }
}
