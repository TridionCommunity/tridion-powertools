<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/FieldView.Master" AutoEventWireup="true"
	CodeBehind="ComponentSynchronizer.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.ComponentSynchronizer.ComponentSynchronizer" %>

<asp:Content ID="ComponentSynchronizer" ContentPlaceHolderID="Main" runat="server">
	<h1>
		Component Synchronizer</h1>
	<div class="tool-explanation">
		Synchronize item fields based on a specific schema.
	</div>
	<fieldset>
		<legend>Fields</legend>
        Fill fields to stablish default value
        <div id="SchemaBasedFields" class="form fieldgroup fieldbuilder"></div>
        <div id="MetadataSchemaBasedFields" class="form fieldgroup fieldbuilder"></div>
		<div>
			<c:button id="ExecuteButton" runat="server" label="Sync" class="customButton" />
		</div>
		<div>
			<c:button id="CloseButton" runat="server" label="Close" class="customButton" />
		</div>
	</fieldset>
</asp:Content>
