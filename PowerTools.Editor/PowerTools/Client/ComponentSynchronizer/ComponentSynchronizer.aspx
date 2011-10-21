<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master" AutoEventWireup="true"
	CodeBehind="ComponentSynchronizer.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.ComponentSynchronizer.ComponentSynchronizer" %>

<asp:Content ID="ComponentSynchronizer" ContentPlaceHolderID="Main" runat="server">
	<h1>
		Component Synchronizer</h1>
	<div class="tool-explanation">
		Synchronize item fields based on a specific schema.
	</div>
	<fieldset>
		<legend>Options</legend>
		<div>
			<label>
				Select the Schema to be updated:</label>
			<div>
				<c:dropdown id="Schema" runat="server" nullable="false" /></div>
		</div>
		<div>
			<c:button id="ExecuteButton" runat="server" label="Sync" class="customButton" />
		</div>
		<div>
			<c:button id="CloseButton" runat="server" label="Close" class="customButton" />
		</div>
	</fieldset>
</asp:Content>
