using System;
using System.Web.UI;

namespace PowerTools.Editor.PowerTools.Client.Shared.Views
{
	public class PopupMaster : MasterPage
	{
		protected override void OnInit(EventArgs e)
		{
			base.OnInit(e);

			var notificationsPlaceHolder = FindControl("NotificationsPlaceHolder");
			if (notificationsPlaceHolder == null) return;

#if TRIDION2013
			notificationsPlaceHolder.Controls.Add(new Tridion.Web.UI.Editors.CME.Controls.UserInfoBar { ID = "UserNotification", SourceEditor = "CME" });
#else
			notificationsPlaceHolder.Controls.Add(new Tridion.Web.UI.Controls.ActiveMessageCenter { ID = "MessageCenter" });
#endif
		}
	}
}
