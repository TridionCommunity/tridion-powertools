<%@ Page Title="Find duplicate binary filenames" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master"
	AutoEventWireup="true" CodeBehind="DuplicateBinaries.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.DuplicateBinaries.DuplicateBinaries" %>

<asp:Content ID="DuplicateBinaries" ContentPlaceHolderID="Main" runat="server">
	<div id="DuplicateBinaries">
		<div class="tool-explanation">
			<p>Allows you to check the binaries within a Publication to find items with duplicate binary filenames.<br/>
			<b>Note:</b> If your publication contains a large number of multimedia items, this process may take a while to complete.</p>
		</div>
		<hr class="br" />
		<div id="resultsArea">
			<table ID="resultsTable" cellspacing="0" cellpadding="0"">
				<thead>
					<tr id="resultsHeader">
						<th class="idColumn">ID</th>
						<th class="fileNameColumn">File name</th>  
					</tr>
				</thead>
				<tbody id="tbody">
				</tbody>
			</table>
		</div>
		<div>
			<c:button id="ExecuteButton" runat="server" label="Find" class="customButton" />
		</div>
	</div>
</asp:Content>
