
<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master"  AutoEventWireup="true" CodeBehind="PagePublisher.aspx.cs" 
Inherits="PowerTools2011.Editor.PowerTools.Client.PagePublisher.PagePublisher" %>


<asp:Content ID="PagePublisher" ContentPlaceHolderID="Main" runat="server">
        <h1>Page publisher</h1>

        <div class="tool-explanation">
            This tool will individually publish all items within a structure group or publication.
        </div>

        <hr />

        <div>
            <div>Publishing options: </div>
            <div>High | Medium | Low</div>
        </div>


        <hr />

        <div>
		    <c:Button ID="ExecuteButton"  runat="server" Label="Publish pages" Class="customButton" />
        </div>

        


</asp:Content>

