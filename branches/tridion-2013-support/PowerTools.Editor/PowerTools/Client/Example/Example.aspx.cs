using System;
using PowerTools.Editor.PowerTools.Client.Shared.Views;
using Tridion.Web.UI.Controls;
using Tridion.Web.UI.Core.Controls;

namespace PowerTools.Editor.PowerTools.Client.Example
{
	[ControlResourcesDependency(new Type[] { typeof(Popup), typeof(Button), typeof(Stack) })]
	[ControlResources("PowerTools.Example")]
	public class ExamplePage : PowerToolsPageBase
	{
	}
}