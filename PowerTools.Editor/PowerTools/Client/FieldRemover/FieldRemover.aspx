<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master" AutoEventWireup="true"
	CodeBehind="FieldRemover.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.FieldRemover.FieldRemover" %>

<asp:Content ID="FieldRemover" ContentPlaceHolderID="Main" runat="server">
	<h1>
		Field Remover</h1>
	<div class="tool-explanation">
		This tool will check whether a schema's field is used by any components and allow
		you to delete a schema's field if it's not being used.
	</div>
	<hr />
	Multi select of schema's fields here
	<hr />
	<div>
		<c:button id="ExecuteButton" runat="server" label="Check fields" class="customButton" />
	</div>
</asp:Content>
