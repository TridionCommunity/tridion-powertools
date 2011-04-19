using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Tridion.ContentManager.ContentManagement;
using Tridion.ContentManager;

namespace PowerTools2011Editor.PowerTools.Example
{
    public partial class Main_PopUp : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
           System.Security.Principal.IPrincipal user = HttpContext.Current.User;     
           Tridion.ContentManager.Session session = new Session(user.Identity.Name);
           UserNameLabel.Text = session.User.Description;
        }
    }
}