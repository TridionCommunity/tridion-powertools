<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master" AutoEventWireup="true"
	CodeBehind="PagePublisher.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.PagePublisher.PagePublisher" %>

<asp:Content ID="PagePublisher" ContentPlaceHolderID="Main" runat="server">
        <h1>Page publisher V2</h1>

        <div class="tool-explanation">
            This tool will individually publish all items within a structure group or publication.
        </div>

        <hr />

                <div id="StackElement2" class="panel1 stack horizontal">
                    <!-- Select target types -->
                    <div class="ttLabel stack-elem">
						<asp:Literal ID="Literal3" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupTargetTypesList %>" />:
					</div>
					<div class="ttList stack-calc">
						<c:List id="TargetTypeList" runat="server" TabIndex="1" MultiSelect="true" />
					</div>
                </div>



        <div>
            <div>Publishing in child publications?: </div>
            <div>Yes | No </div>
        </div>

        <div>
            <div><asp:Literal ID="Literal1" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupTargetTypesList %>" />Publishing targets: </div>
            <div>Yes | No </div>
        </div>


        <hr />

        <div>
		    <c:Button ID="ExecuteButton"  runat="server" Label="Publish pages" Class="customButton" />
        </div>

        


</asp:Content>
