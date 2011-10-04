<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="../../Shared/Views/TreeView.master"
Inherits="PowerTools2011.Common.Pages.OverviewPage" ClassName="OverviewPage"%>

<asp:Content runat="server" ContentPlaceHolderID="TitleCPH">
	Overview Tool Page
</asp:Content>

<asp:Content runat="server" ContentPlaceHolderID="ContentCPH">

	<div id="overviewContainer">
		<div id="containerMessage">
			Select an item from the tree...
		</div>
	</div>
</asp:Content>

<asp:Content runat="server" ContentPlaceHolderID="BottomButtonsCPH">
		<c:Button ID="CalculateButton" runat="server" label="Calculate" />
		<c:Button ID="CloseButton" runat="server" label="<%$ Resources: Tridion.Web.UI.Strings, Close %>" />
</asp:Content>
