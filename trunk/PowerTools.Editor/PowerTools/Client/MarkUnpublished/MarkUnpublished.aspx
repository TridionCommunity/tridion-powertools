<%@ Page Title="Mark as Unpublished" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master" AutoEventWireup="true"
	CodeBehind="MarkUnpublished.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.MarkUnpublished.MarkUnpublished" %>

<asp:Content ID="MarkUnpublished" ContentPlaceHolderID="Main" runat="server">
	<div id="MarkUnpublished">
		<div class="tool-explanation">
			This tool will allow you to force items to be marked as published. Sometimes required
			when a Publication Target is removed before all items are unpublished. <strong>Note</strong>
			that this will not attempt to physically remove the file - if this is what you require
			then use the standard Tridion Unpublish option.
		</div>
		<hr />
		<div>
			<div>Would you like items in sub-Folders or sub-Structure groups to be marked as unpublished also?</div>
		</div>
	</div>
</asp:Content>
