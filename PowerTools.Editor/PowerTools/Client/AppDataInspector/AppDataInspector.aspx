<%@ Page Title="Application Data Inspector" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master"
	AutoEventWireup="true" CodeBehind="AppDataInspector.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.AppDataInspector.AppDataInspector" %>

<asp:Content ID="AppDataInspector" ContentPlaceHolderID="Main" runat="server">
	<div class="tool-explanation">
		Retrieves the AppData of a given item in read-only mode.
	</div>
	<div>
		<c:button id="RefreshButton" runat="server" label="Refresh" class="customButton" />
	</div>
	<hr class="br" />
	<table>
		<thead>
			<tr>
				<th>
					ApplicationId
				</th>
				<th>
					Data
				</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>
					Loading...
				</td>
			</tr>
		</tbody>
	</table>
	<hr class="br" />
</asp:Content>
