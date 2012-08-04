<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master" AutoEventWireup="true"
	CodeBehind="ImageUploader.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.ImageUploader.ImageUploader" %>

<asp:Content ID="ImageUploader" ContentPlaceHolderID="Main" runat="server">
	<h1>
		Image Uploader</h1>
	<div class="tool-explanation">
		This will upload all files in a given directory (as Multimedia Components) to the
		Folder you have selected.
	</div>
	<hr />
	<div>
		<div>
			Enter the directory on the server to scan for files to upload:</div>
		<div>
			<asp:TextBox ID="SourceFolder" Text="C:\Temp" runat="server" /></div>
	</div>
	<div>
		<div>
			Select the Schema to use for the Components:</div>
		<div>
			<c:dropdown id="Schema" runat="server" nullable="false" /></div>
	</div>
	<hr />
	<div>
		<c:button id="ExecuteButton" runat="server" label="Upload images" class="customButton" />
	</div>
</asp:Content>
