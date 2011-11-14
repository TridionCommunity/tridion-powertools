<%@ Page Title="Page Publisher" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master" AutoEventWireup="true"
	CodeBehind="PagePublisher.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.PagePublisher.PagePublisher" %>



<asp:Content ID="PagePublisher" ContentPlaceHolderID="Main" runat="server">
        <div class="tool-explanation">
Publish a collection of pages individually, as seperate publish instructions. This can be necessary as when you press publish on a publication in Tridion R5, if a failure occurs, the entire transaction will be fail.
        </div>

        <div id="StackElement1" class="stack horizontal">
            <div id="Options" class="stack-calc splitter vertical box-spacer-10">
                <div id="StackElement2" class="panel1 stack horizontal">
                    <!-- Select target types -->
                    <div class="ttLabel stack-elem">
						<asp:Literal ID="Literal1" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupTargetTypesList %>" />:
					</div>
					<div class="ttList stack-calc">
						<c:List id="TargetTypeList" runat="server" TabIndex="1" MultiSelect="true" />
					</div>
                </div>
                <div class="handle"></div>
                <div id="StackElement3" class="panel2">
                    <asp:Literal ID="PubTitle" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupPublishSettings %>" />
                    <div class="stack-elem box-spacer-5">
	                    <input id="RecursiveChk" type="checkbox" class="radio" tabindex="3"  />
	                    <label for="recursive"><asp:Literal ID="Literal4" runat="server" Text="Recursive" /></label>
                    </div>
                    <div class="stack-elem box-spacer-5">
	                    <div>
		                    <input id="RepublishChk" type="checkbox" tabindex="4" />
		                    <label for="republish"><asp:Literal ID="Literal12" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupRepublish %>" /></label>
	                    </div>
                    </div>
					<div class="stack-elem box-spacer-5">
						<input id="PublishChildrenChk" type="checkbox" tabindex="26" />
						<label for="propagateInChildren"><asp:Literal ID="Literal6" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupPropagateInChildren %>" /></label>
					</div>
                    <div class="stack-elem box-spacer-5">
                        <label><asp:Literal ID="Literal5" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, Priority %>" />:</label>
                        <select id="Priority">
                            <option value="2">Low</option>
                            <option value="4">Normal</option>
                            <option value="6">High</option>
                        </select>	
                    </div>
            </div>
            <div id="Footer" class="footer stack-elem">
                <c:Button ID="ExecuteButton"  runat="server" Label="Publish pages" Class="customButton" />
            </div>
        </div>

</asp:Content>
