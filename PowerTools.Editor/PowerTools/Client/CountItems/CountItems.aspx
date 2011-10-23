<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master" AutoEventWireup="true"
	CodeBehind="CountItems.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.CountItems.CountItems" %>

<asp:Content ID="CountItems" ContentPlaceHolderID="Main" runat="server">
	<h1>
		Count Items
	</h1>
	<div class="tool-explanation">
		Counts items in a Publication, Structure Group or Folder. User can select the types
		of items to count.
	</div>
	<hr />
	<div>
		<span class="fl">Item Types:</span><span class="fl">
			<ul>
				<li>
					<input type="checkbox" id="FolderChk" value="2" /><label for="FolderChk">Folders</label></li>
				<li>
					<input type="checkbox" id="ComponentChk" value="16" /><label for="ComponentChk">Components</label>
				</li>
			</ul>
		</span><span class="fl">
			<ul>
				<li>
					<input type="checkbox" id="StructureGroupChk" value="4" /><label for="StructureGroupChk">Structure
						Groups</label></li>
				<li>
					<input type="checkbox" id="PageChk" value="64" /><label for="PageChk">Pages</label>
				</li>
			</ul>
		</span>
	</div>
	<div class="br">
		<c:button id="ExecuteButton" runat="server" label="Count" class="customButton" />
	</div>
	<hr class="br" />
	<div id="Response">
		<div class="fl">
			<fieldset id="FolderSet">
				<legend>Folders</legend><span></span>
			</fieldset>
			<fieldset id="ComponentSet">
				<legend>Components</legend><span></span>
			</fieldset>
		</div>
		<div class="fl">
			<fieldset id="StructureGroupSet">
				<legend>Structure Groups</legend><span></span>
			</fieldset>
			<fieldset id="PageSet">
				<legend>Pages</legend><span></span>
			</fieldset>
		</div>
	</div>
</asp:Content>
