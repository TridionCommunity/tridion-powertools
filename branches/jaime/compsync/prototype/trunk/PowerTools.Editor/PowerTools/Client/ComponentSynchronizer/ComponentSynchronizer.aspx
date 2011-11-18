<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master" AutoEventWireup="true"
	CodeBehind="ComponentSynchronizer.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.ComponentSynchronizer.ComponentSynchronizer" %>

<asp:Content ID="ComponentSynchronizer" ContentPlaceHolderID="Main" runat="server">
    <%--ui:ActiveMessageCenter id="MessageCenter" class="stack-elem" runat="server" /> --%>
	
	<h1>Component Synchronizer</h1>
	<div class="tool-explanation">
		Synchronize item fields based on a specific schema.
	</div>
    
	
		
    
    <div class="stack-calc">
    <fieldset>
        <legend>Reference Component Creation</legend>             
                
        <c:button id="CreateReferenceButton" runat="server" label="Create Reference Component" class="customButton" />
        <c:button id="BtnBrowse" runat="server" tabindex="2" title="<%$ Resources: Tridion.Web.UI.Strings, Browse %>" />
        <c:button id="BtnRemove" runat="server" tabindex="11" title="<%$ Resources: Tridion.Web.UI.Strings, Remove %>" style="visibility:hidden" />                  
		            
                
                        
	    <div class="stack-elem" id="Div1">
		    <div id="FieldTitle">No reference component selected</div>							        
	    </div>
                        
        
    </fieldset>
    <br />
    <fieldset>
        <legend>Synchronization List</legend>
        <c:TabControl runat="server" ID="TabControl" ActivePage="UsedIn" class="stack horizontal">
		    <c:DeckPage ID="UsedIn" runat="server" Label="Components">
            
			    <div>
				    <div class="wulist">
					    <div id="StackElement2" class="stack horizontal">
						    <div id="UsedInListWrapper" class="stack-calc">
							    <c:List ID="UsedInList" runat="server" MultiSelect="false" />
						    </div>
                                
					    </div>
				    </div>	
                    <div style="padding-top: 10px">
                    <fieldset>
                            <legend>Item Details</legend>
						    <div class="stack-elem" id="ItemDetails">
							    <div id="ItemDetailsText">No item selected</div>							        
						    </div>
                            </fieldset>				
                    </div>
				    
			    </div>
		    </c:DeckPage>
        </c:TabControl>
    </fieldset>
    <div class="wubuttons" style="padding-top: 10px">
                    <fieldset>
                    <legend>Commmands</legend>
                        <c:button id="ExecuteButton" runat="server" label="Sync" class="customButton" disabled/>
					    <c:Button runat="server" ID="BtnUsedInOpen" Disabled="true" Label="<%$ Resources: Tridion.Web.UI.Strings, Open %>" />
					    <c:Button runat="server" ID="BtnUsedInGoTo" Disabled="true" Label="<%$ Resources: Tridion.Web.UI.Strings, GotoLocation %>" />
					    <c:Button runat="server" ID="BtnUsedInRefresh" Label="<%$ Resources: Tridion.Web.UI.Strings, Refresh %>" />
                        <c:Button ID="CloseButton" runat="server" TabIndex="10" Label="<%$ Resources: Tridion.Web.UI.Strings, Cancel %>" /> 
                    </fieldset>
				    </div>
    </div>
    
	
		
	<div id="ModalDialog">
	<div id="dialog" class="window" style="border: 2px solid black; width: 300px; height: 100px;
		background-color: white; text-align: center">
		<div style="border: 1px solid black; background-color: white; width: 100%">
			<div id="ProgressBar" style="height: 15px; width: 1px; background-color: navy;">
				&nbsp;</div>
		</div>
		<div id="ProgressStatus" style="width: 100%; text-align: center">Progress</div>
	</div>
</div>	
            
		
	
						
	
</asp:Content>
