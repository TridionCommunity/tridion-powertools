<%@ Page Title="Application Data Inspector" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master"
	AutoEventWireup="true" CodeBehind="AppDataInspectorPopup.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.AppDataInspector.AppDataInspectorPopup" %>

<asp:Content ID="AppDataInspector" ContentPlaceHolderID="Main" runat="server">
	<div id="AppDataInspector">
		<div class="tool-explanation">
			Retrieves the AppData of a given item in read-only mode.
		</div>
		<hr class="br" />
		<div id="table">
			<table>
				<thead>
					<tr>
						<th width="25%">Application Id</th>
						<th width="50%">Data</th>
						<th width="25%">Type</th>
					</tr>
				</thead>
				<tbody id="tbody">
				</tbody>
			</table>
		</div>
		<hr class="br" />
		<div>
			<c:button id="RefreshButton" runat="server" label="Refresh" class="customButton" />
		</div>
	</div>
</asp:Content>
