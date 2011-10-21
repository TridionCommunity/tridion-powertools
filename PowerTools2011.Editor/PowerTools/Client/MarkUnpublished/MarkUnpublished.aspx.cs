using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Tridion.Web.UI.Core.Controls;
using Tridion.Web.UI.Controls;
using PowerTools2011.Common.Pages;

namespace PowerTools2011.Editor.PowerTools.Client.MarkUnpublished {

	[ControlResourcesDependency(new Type[] { typeof(Popup), typeof(Tridion.Web.UI.Controls.Button), typeof(Stack), typeof(Dropdown), typeof(List) })]
    [ControlResources("PowerTools2011.MarkUnpublished")]
    public partial class MarkUnpublished : PowerToolsPageBase
    {
	}
}