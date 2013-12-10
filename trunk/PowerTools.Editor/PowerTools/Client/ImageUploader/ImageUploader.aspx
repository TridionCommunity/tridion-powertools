<%@ Page Title="Image Uploader" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master" AutoEventWireup="true"
	CodeBehind="ImageUploader.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.ImageUploader.ImageUploader" %>

<asp:Content ID="ImageUploader" ContentPlaceHolderID="Main" runat="server">
	<div id="ImageUploader">
		<div class="tool-explanation">
			This will upload all files in a given directory (as Multimedia Components) to the Folder you have selected.
		</div>
		<hr class="br"/>
		<div class="sourceFolderSelection">
			<label for="SourceFolder">Enter the directory on the server to scan for files to upload:</label>
			<div><input id="SourceFolder" type="text" value="C:\Temp" /></div>
		</div>
		<div class="schemaSelection">
			<label for="Schema">Select the Schema to use for the Components:</label>
			<div><c:dropdown id="Schema" runat="server" nullable="false" /></div>
		</div>
		<hr class="br"/>
		<div><c:button id="ExecuteButton" runat="server" label="Upload images" class="customButton" /></div>
	</div>
</asp:Content>
