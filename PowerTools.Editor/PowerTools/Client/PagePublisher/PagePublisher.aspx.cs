using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Tridion.Web.UI.Core.Controls;
using PowerTools.Common.Pages;
using Tridion.Web.UI.Controls;

namespace PowerTools.Editor.PowerTools.Client.PagePublisher
{
    [ControlResourcesDependency(new Type[] { typeof(Popup), typeof(Tridion.Web.UI.Controls.Button), typeof(Stack), typeof(Dropdown), typeof(List) })]
    [ControlResources("PowerTools.PagePublisher")]
    public partial class PagePublisher : PowerToolsPageBase
    {
    }
}