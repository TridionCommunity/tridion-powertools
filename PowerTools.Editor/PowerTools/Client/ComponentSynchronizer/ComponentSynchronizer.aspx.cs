﻿using System;
using PowerTools.Editor.PowerTools.Client.Shared.Views;
using Tridion.Web.UI.Controls;
using Tridion.Web.UI.Core.Controls;

namespace PowerTools.Editor.PowerTools.Client.ComponentSynchronizer
{
	[ControlResourcesDependency(new[] { typeof(Popup), typeof(Button), typeof(Stack), typeof(Dropdown), typeof(List) })]
	[ControlResources("PowerTools.ComponentSynchronizer")]
	public partial class ComponentSynchronizer : PowerToolsPageBase
	{
	}
}