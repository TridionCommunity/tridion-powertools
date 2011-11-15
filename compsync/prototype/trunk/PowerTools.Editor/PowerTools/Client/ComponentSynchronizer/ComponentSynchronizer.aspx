<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master" AutoEventWireup="true"
	CodeBehind="ComponentSynchronizer.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.ComponentSynchronizer.ComponentSynchronizer" %>

<asp:Content ID="ComponentSynchronizer" ContentPlaceHolderID="Main" runat="server">
    <%--ui:ActiveMessageCenter id="MessageCenter" class="stack-elem" runat="server" /> --%>
	
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
            <c:button id="BtnRemove" runat="server" tabindex="11" title="<%$ Resources: Tridion.Web.UI.Strings, Remove %>" style="visibility:hidden" />
        </div>

        <table>
            <tr id="rowURI" valign="middle">
			    <td><input type="text" id="FieldTitle" maxlength="250" tabindex="2" style="width:100%; visibility:hidden;"/></td>	                
		    </tr>	            
        </table>
        
    </fieldset>
	
		
    <div id="SyncList">
    <div class="stack-calc">
    <c:TabControl runat="server" ID="TabControl" ActivePage="UsedIn" class="stack horizontal">
		<c:DeckPage ID="UsedIn" runat="server" Label="Components">
			<div>
				<div class="wulist">
					<div id="StackElement2" class="stack horizontal">
						<div id="UsedInListWrapper" class="stack-calc">
							<c:List ID="UsedInList" runat="server" MultiSelect="false" />
						</div>
						<div class="stack-elem" id="ItemDetails">
							<div id="ItemDetailsText"></div>
							<div id="ItemDetailsVersions"></div>
						</div>
					</div>
				</div>					
				<div class="wubuttons">
					<c:Button runat="server" ID="BtnUsedInOpen" Disabled="true" Label="<%$ Resources: Tridion.Web.UI.Strings, Open %>" />
					<c:Button runat="server" ID="BtnUsedInGoTo" Disabled="true" Label="<%$ Resources: Tridion.Web.UI.Strings, GotoLocation %>" />
					<c:Button runat="server" ID="BtnUsedInRefresh" Label="<%$ Resources: Tridion.Web.UI.Strings, Refresh %>" />
				</div>
			</div>
		</c:DeckPage>
    </c:TabControl>
	<c:List ID="ComponentsList" runat="server" MultiSelect="false" />
	
    </div>
    </div>
    <fieldset>
	<legend>Commmands</legend>
		<div>
			<c:button id="ExecuteButton" runat="server" label="Sync" class="customButton" disabled/>
            <c:Button ID="CloseButton" runat="server" TabIndex="10" Label="<%$ Resources: Tridion.Web.UI.Strings, Cancel %>" /> 
		</div>		
	</fieldset>
						
	
</asp:Content>
