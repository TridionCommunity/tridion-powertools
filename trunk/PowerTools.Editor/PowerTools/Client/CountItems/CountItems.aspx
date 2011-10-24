<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master" AutoEventWireup="true"
	CodeBehind="CountItems.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.CountItems.CountItems" %>

<asp:Content ID="CountItems" ContentPlaceHolderID="Main" runat="server">
	<h1>
		Count Items
	</h1>
	<div class="tool-explanation">
		Counts items in a Publication, Structure Group or Folder. Select the types of items
		to count.
	</div>
	<hr />
	<table>
		<tr>
			<td>
				<ul>
					<li>
						<input type="checkbox" id="FolderChk" value="2" /><label for="FolderChk">Folders</label>
						<span></span></li>
					<li>
						<input type="checkbox" id="ComponentChk" value="16" /><label for="ComponentChk">Components</label>
						<span></span></li>
					<li>
						<input type="checkbox" id="SchemaChk" value="8" /><label for="SchemaChk">Schemas</label>
						<span></span></li>
					<li>
						<input type="checkbox" id="ComponentTemplateChk" value="32" /><label for="ComponentTemplateChk">Component
							Templates</label>
						<span></span></li>
					<li>
						<input type="checkbox" id="PageTemplateChk" value="128" /><label for="PageTemplateChk">Page
							Templates</label>
						<span></span></li>
					<li>
						<input type="checkbox" id="TemplateBuildingBlockChk" value="2048" /><label for="TemplateBuildingBlockChk">Template
							Building Blocks</label>
						<span></span></li>
				</ul>
			</td>
			<td>
				<ul>
					<li>
						<input type="checkbox" id="StructureGroupChk" value="4" /><label for="StructureGroupChk">Structure
							Groups</label>
						<span></span></li>
					<li>
						<input type="checkbox" id="PageChk" value="64" /><label for="PageChk">Pages</label>
						<span></span></li>
				</ul>
			</td>
			<td>
				<ul>
					<li>
						<input type="checkbox" id="CategoryChk" value="512" /><label for="CategoryChk">Categories</label>
						<span></span></li>
					<li>
						<input type="checkbox" id="KeywordChk" value="1024" /><label for="KeywordChk">Keywords</label>
						<span></span></li>
				</ul>
			</td>
		</tr>
	</table>
	<hr class="br" />
	<div>
		<c:button id="ExecuteButton" runat="server" label="Count" class="customButton" />
	</div>
</asp:Content>
