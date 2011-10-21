using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Tridion.Web.UI.Core.Controls;
using Tridion.Web.UI.Controls;
using PowerTools.Common.Pages;

namespace PowerTools.Editor.PowerTools.Client.MarkUnpublished {

	[ControlResourcesDependency(new Type[] { typeof(Popup), typeof(Tridion.Web.UI.Controls.Button), typeof(Stack), typeof(Dropdown), typeof(List) })]
    [ControlResources("PowerTools.MarkUnpublished")]
    public partial class MarkUnpublished : PowerToolsPageBase
    {
	}
}