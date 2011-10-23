<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master" AutoEventWireup="true"
	CodeBehind="CountItems.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.CountItems.CountItems" %>

<asp:Content ID="CountItems" ContentPlaceHolderID="Main" runat="server">
	<h1>
		Count Items
	</h1>
	<div class="tool-explanation">
		Counts items in a Publication, Structure Group or Folder. User can select the type(s)
		of items to count.
	</div>
	<hr />
	<div>
		<div>
			Organizational item to count items in:
		</div>
		<div>
			<asp:TextBox ID="SourceOrgItem" runat="server" />
		</div>
	</div>
	<div>
		<div>
			Select the Schema to use for the Components:
		</div>
		<div>
			<c:dropdown id="Schema" runat="server" nullable="false" />
		</div>
	</div>
	<hr />
	<div>
		<c:button id="ExecuteButton" runat="server" label="Upload images" class="customButton" />
	</div>
</asp:Content>
