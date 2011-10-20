<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master"  AutoEventWireup="true" CodeBehind="ComponentSynchronizer.aspx.cs" 
Inherits="PowerTools2011.Editor.PowerTools.Client.ComponentSynchronizer.ComponentSynchronizer" %>


<asp:Content ID="ComponentSynchronizer" ContentPlaceHolderID="Main" runat="server">
        <h1>Component Synchronizer</h1>

        <div class="tool-explanation">
            Syncronizing component explanation.
        </div>

        <hr />

        <div>
            <div>Select the Schema to be updated:</div>
            <div><c:Dropdown ID="Schema" runat="server" Nullable="false" /></div>
        </div>

        <hr />

        <div>
		    <c:Button ID="ExecuteButton"  runat="server" Label="Sync" Class="customButton" />
        </div>

        


</asp:Content>
