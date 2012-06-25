﻿using System;
using System.Web.UI;
using Tridion.Web.UI.Core.Controls;


namespace PowerTools.Common.MasterPages
{
    public class FieldViewMaster : MasterPage
    {
        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            TridionManager tm = new TridionManager();

            tm.Editor = "PowerTools";
            System.Web.UI.HtmlControls.HtmlGenericControl dep = new System.Web.UI.HtmlControls.HtmlGenericControl("dependency");
            dep.InnerText = "Tridion.Web.UI.Editors.CME";
            tm.dependencies.Add(dep);

            System.Web.UI.HtmlControls.HtmlGenericControl dep2 = new System.Web.UI.HtmlControls.HtmlGenericControl("dependency");
            dep2.InnerText = "Tridion.Web.UI.Editors.CME.commands";
            tm.dependencies.Add(dep2);


            System.Web.UI.HtmlControls.HtmlGenericControl dep3 = new System.Web.UI.HtmlControls.HtmlGenericControl("dependency");
            dep3.InnerText = "Tridion.Web.UI.fieldbuilder";
            tm.dependencies.Add(dep3);


            //Add them to the ContentPlaceHolder
            this.FindControl("Main").Controls.Add(tm);


        }
    }
}