using System;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using Tridion.Web.UI.Core.Controls;


namespace PowerTools.Common.MasterPages
{
	public class PopupMaster : MasterPage
	{
		protected override void OnInit(EventArgs e)
		{
			base.OnInit(e);

			// Add them to the ContentPlaceHolder
            var contentPlaceHolder = FindControl("Main");
		    if (contentPlaceHolder == null) return;
		    
            var manager = new TridionManager { Editor = "PowerTools" };

		    var dependency = new HtmlGenericControl("dependency") { InnerText = "Tridion.Web.UI.Editors.CME" };
            manager.dependencies.Add(dependency);

            dependency = new HtmlGenericControl("dependency") { InnerText = "Tridion.Web.UI.Editors.CME.commands" };
            manager.dependencies.Add(dependency);
		    manager.IsStandAloneView = false;

		    contentPlaceHolder.Controls.Add(manager);
		}
	}
}
