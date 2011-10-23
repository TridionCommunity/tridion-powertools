using System;
using PowerTools.Common.Pages;
using Tridion.Web.UI.Controls;
using Tridion.Web.UI.Core.Controls;

namespace PowerTools.Editor.PowerTools.Client.ImageUploader
{

	[ControlResourcesDependency(new Type[] { typeof(Popup), typeof(Tridion.Web.UI.Controls.Button), typeof(Stack), typeof(Dropdown), typeof(List) })]
	[ControlResources("PowerTools.ImageUploader")]
	public partial class ImageUploader : PowerToolsPageBase
	{
	}
}