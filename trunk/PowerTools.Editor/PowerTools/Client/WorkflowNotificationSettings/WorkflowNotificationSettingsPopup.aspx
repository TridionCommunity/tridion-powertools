<%@ Page Title="User Workflow Notification Settings" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master"
	AutoEventWireup="true" CodeBehind="WorkflowNotificationSettingsPopup.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.WorkflowNotificationSettings.WorkflowNotificationSettingsPopup" %>

<asp:Content ID="WorkflowNotificationSettings" ContentPlaceHolderID="Main" runat="server">
	<div id="WorkflowNotificationSettings">
		<div class="tool-explanation">
			Allows a user to configure their workflow notification settings.
		</div>
	
		<hr class="br" />
		<div>
			<textarea rows="25" id="UserSettings" style="width:99%">Loading current settings...</textarea>
		</div>
		<c:button id="SaveButton" runat="server" label="Save Changes" class="customButton"/>
	</div>
</asp:Content>
