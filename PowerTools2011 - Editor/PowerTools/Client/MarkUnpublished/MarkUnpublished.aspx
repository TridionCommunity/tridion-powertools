<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master"  AutoEventWireup="true" CodeBehind="MarkUnpublished.aspx.cs" 
Inherits="PowerTools2011.Editor.PowerTools.Client.MarkUnpublished.MarkUnpublished" %>


<asp:Content ID="MarkUnpublished" ContentPlaceHolderID="Main" runat="server">
        <h1>Mark as Unpublished</h1>

        <div class="tool-explanation">
            This tool will allow you to force items to be marked as published. 
            Sometimes required when a Publication Target is removed before all items are unpublished.
            <strong>Note</strong> that this will not attempt to physically remove the file - if this is what you require then use the standard Tridion Unpublish option.
        </div>

        <hr />

        <div>
            <div>Would you like items in sub-Folders or sub-Structure groups to be marked as unpublished also?:</div>
            <div><c:Dropdown ID="Schema" runat="server" Nullable="false" /></div>
        </div>

        <div>
            <div>Select the Schema to use for the Components:</div>
            <div><asp:TextBox ID="SourceFolder" Text="C:\Temp" runat="server" /></div>
        </div>

        <hr />

        <div>
		    <c:Button ID="ExecuteButton"  runat="server" Label="Upload images" Class="customButton" />
        </div>

        


</asp:Content>
