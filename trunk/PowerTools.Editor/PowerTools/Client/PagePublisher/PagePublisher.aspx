<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master" AutoEventWireup="true"
	CodeBehind="PagePublisher.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.PagePublisher.PagePublisher" %>



<asp:Content ID="PagePublisher" ContentPlaceHolderID="Main" runat="server">
        <h1>Page publisher</h1>
        <div class="tool-explanation">
Publish a collection of pages individually, as seperate publish instructions. This can be necessary as when you press publish on a publication in Tridion R5, if a failure occurs, the entire transaction will be fail.
        </div>

        <div id="StackElement1" class="stack horizontal">
            <div id="MsgCenter" class="stack-elem">
                MESSAGE CENTER HERE
            </div>
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
                    <!--
                    TODO:)
                    <div class="stack-elem box-spacer-5">
	                    <input id="publishNow" type="radio" name="p" class="radio" tabindex="3" checked="checked" />
	                    <label for="publishNow"><asp:Literal ID="Literal2" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupPublishNow %>" /></label>
                    </div>
                    <div class="stack-elem box-spacer-5">
	                    <div>
		                    <input id="publishLater" type="radio" name="p" class="radio" tabindex="3" />
		                    <label for="publishLater"><asp:Literal ID="Literal3" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupPublishLater %>" /></label>
	                    </div>
	                    <div id="setPublishLater" style="display:none" class="left-tabbed top-spacer-5 dt-box">
		                    <c:Date id="PublishLaterDate" runat="server" IsSeparateFields="false" AddClearButton="false" TabIndex="19"></c:Date>
	                    </div>
                    </div>
                    -->
                    <div class="stack-elem box-spacer-5">
	                    <input id="recursive" type="checkbox" class="radio" tabindex="3"  />
	                    <label for="recursive"><asp:Literal ID="Literal4" runat="server" Text="Recursive" /></label>
                    </div>
                    <div class="stack-elem box-spacer-5">
	                    <div>
		                    <input id="republish" type="checkbox" tabindex="4" checked="checked" />
		                    <label for="republish"><asp:Literal ID="Literal12" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupRepublish %>" /></label>
	                    </div>
                    </div>
					<div class="stack-elem box-spacer-5">
						<input id="propagateInChildren" type="checkbox" tabindex="26" />
						<label for="propagateInChildren"><asp:Literal ID="Literal6" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupPropagateInChildren %>" /></label>
					</div>
                    <div class="stack-elem box-spacer-5">
	                    <div>
							<div id="setPriority" class="left-tabbed top-spacer-5">
								<table border="0" style="height:auto; width:auto">
									<tbody><tr>
										<td><label><asp:Literal ID="Literal5" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, Priority %>" />:</label></td>
										<td><c:Dropdown ID="Priority" runat="server" Nullable="false" TabIndex="5" /></td>
									</tr></tbody>
								</table>
							</div>
	                    </div>
                    </div>
								
                    </div>

            </div>

            <div id="Footer" class="footer stack-elem">
                <!-- Buttons -->
                <c:Button ID="ExecuteButton"  runat="server" Label="Publish pages" Class="customButton" />
            </div>
        </div>

</asp:Content>
