using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using System.Text;
using System.Web.UI;
using Tridion.Web.UI.Core.Controls;
using Tridion.Web.UI.Controls;

namespace PowerTools2011.Common.MasterPages
{
	public class PopupMaster : MasterPage
	{
		protected override void OnInit(EventArgs e) {
			base.OnInit(e);

			TridionManager tm = new TridionManager();

			tm.Editor = "PowerTools2011";
			System.Web.UI.HtmlControls.HtmlGenericControl dep = new System.Web.UI.HtmlControls.HtmlGenericControl("dependency");
			dep.InnerText = "Tridion.Web.UI.Editors.CME";
			tm.dependencies.Add(dep);

			System.Web.UI.HtmlControls.HtmlGenericControl dep2 = new System.Web.UI.HtmlControls.HtmlGenericControl("dependency");
			dep2.InnerText = "Tridion.Web.UI.Editors.CME.commands";
			tm.dependencies.Add(dep2);
	
			//Add them to the ContentPlaceHolder
			this.FindControl("Main").Controls.Add(tm);

			
			
			
			
		}

		

	}
}
