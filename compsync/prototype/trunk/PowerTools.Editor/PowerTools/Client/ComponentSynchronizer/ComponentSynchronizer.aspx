<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/FieldView.Master"
    AutoEventWireup="true" CodeBehind="ComponentSynchronizer.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.ComponentSynchronizer.ComponentSynchronizer" %>

<asp:Content ID="ComponentSynchronizer" ContentPlaceHolderID="Main" runat="server">
    <h1>
        Component Synchronizer</h1>
    <div class="tool-explanation">
        Synchronize item fields based on a specific schema.
    </div>ssss    
    <fieldset>
        <legend>Fields</legend>
        <br />
        <br />
        Fill fields to stablish default values 
        <br />
        <br />
        <fieldset>
        <legend>Content</legend>
            <div id="SchemaBasedFields" class="form fieldgroup fieldbuilder">
            </div>
        </fieldset>
        <br />
        <fieldset>
        <legend>Metadata</legend>
            <div id="MetadataSchemaBasedFields" class="form fieldgroup fieldbuilder">
            </div>
        </fieldset>
        <br />
        <br />
        <div>
            <c:button id="ExecuteButton" runat="server" label="Sync" class="customButton" />
        </div>
        <div>
            <c:button id="CloseButton" runat="server" label="Close" class="customButton" />
        </div>
    </fieldset>
</asp:Content>
