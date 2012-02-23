using System;
using PowerTools.Common.Pages;
using Tridion.Web.UI.Controls;
using Tridion.Web.UI.Core.Controls;

namespace PowerTools.Editor.PowerTools.Client.DuplicateBinaries
{
	[ControlResourcesDependency(new Type[] { typeof(Popup), typeof(Tridion.Web.UI.Controls.Button), typeof(Stack), typeof(Dropdown), typeof(List) })]
	[ControlResources("PowerTools.DuplicateBinaries")]
	public partial class DuplicateBinaries : PowerToolsPageBase
	{
	}
}