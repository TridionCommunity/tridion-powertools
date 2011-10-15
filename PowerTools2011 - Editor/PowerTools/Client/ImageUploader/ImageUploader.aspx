<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master"  AutoEventWireup="true" CodeBehind="ImageUploader.aspx.cs" 
Inherits="PowerTools2011.Editor.PowerTools.Client.ImageUploader.ImageUploader" %>


<asp:Content ID="ImageUploader" ContentPlaceHolderID="Main" runat="server">
        <h1>Image Uploader</h1>

        <div class="tool-explanation">
            This will upload all files in a given directory (as Multimedia Components) to the Folder you have selected.
        </div>

        <hr />

        <div>
            <div>Enter the directory on the server to scan for files to upload:</div>
            <div><asp:TextBox ID="SourceFolder" Text="C:\Temp" runat="server" /></div>
        </div>

        <div>
            <div>Select the Schema to use for the Components:</div>
            <div><c:Dropdown ID="Schema" runat="server" Nullable="false" /></div>
        </div>

        <hr />

        <div>
		    <c:Button ID="ExecuteButton"  runat="server" Label="Upload images" Class="customButton" />
        </div>

        


</asp:Content>
