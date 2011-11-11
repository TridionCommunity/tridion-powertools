<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master" AutoEventWireup="true"
	CodeBehind="ComponentSynchronizer.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.ComponentSynchronizer.ComponentSynchronizer" %>

<asp:Content ID="ComponentSynchronizer" ContentPlaceHolderID="Main" runat="server">
	<h1>Component Synchronizer</h1>
	<div class="tool-explanation">
		Synchronize item fields based on a specific schema.
	</div>
    <fieldset>
        <legend>Reference Component Creation</legend>
        <div>
			<c:button id="CreateReferenceButton" runat="server" label="Create Reference Component" class="customButton" />
		</div>
        <div>
			<c:button id="BtnBrowse" runat="server" tabindex="2" title="<%$ Resources: Tridion.Web.UI.Strings, Browse %>" />
		</div>
        <div>
            <c:button id="BtnRemove" runat="server" tabindex="11" title="<%$ Resources: Tridion.Web.UI.Strings, Remove %>" />
        </div>
        <table>
            <tr id="rowURI" valign="middle">
			    <td>URI:<input type="text" id="FieldURI" maxlength="250" tabindex="1" /> </td>			    		    
			    <td>Title:<input type="text" id="FieldTitle" maxlength="250" tabindex="2" /></td>	
                <td>Schema:<input type="text" id="FieldSchema" maxlength="250" tabindex="1" /> </td>		    
		    </tr>	            
        </table>
        
    </fieldset>
	<fieldset>
		
        <legend>Preview</legend>
        <div id="PreviewContent">Preview content</div>
        
        </fieldset>
        
    </fieldset>
    <fieldset>
	<legend>Commmands</legend>
		<div>
			<c:button id="ExecuteButton" runat="server" label="Sync" class="customButton" />
            <c:Button ID="CloseButton" runat="server" TabIndex="10" Label="<%$ Resources: Tridion.Web.UI.Strings, Cancel %>" /> 
		</div>		
	</fieldset>
						
	
</asp:Content>
