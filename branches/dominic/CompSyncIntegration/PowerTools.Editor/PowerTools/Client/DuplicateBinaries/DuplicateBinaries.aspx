<%@ Page Title="Find duplicate binary filenames" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master"
	AutoEventWireup="true" CodeBehind="DuplicateBinaries.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.DuplicateBinaries.DuplicateBinaries" %>

<asp:Content ID="DuplicateBinaries" ContentPlaceHolderID="Main" runat="server">
	<div class="tool-explanation">
		Allows you to check the binaries within a publication to find items with duplicate binary filenames.

        <p><b>Note:</b> If your publication contains a large number of multimedia items, this process make a while to complete.</p>
	</div>
	<hr />
        <p>To check for all duplicate binaries within the publication please click below</p>
	<hr class="br" />
	<div>
		<c:button id="ExecuteButton" runat="server" label="Find" class="customButton" />
	</div>
</asp:Content>
