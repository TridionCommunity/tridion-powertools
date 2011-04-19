<%@ Page Title="Example PowerTool with Pop-Up" Language="C#" MasterPageFile="/WebUI/Editors/PowerTools2011/PowerTools/Shared/PopUp.Master" AutoEventWireup="true" CodeBehind="Main_PopUp.aspx.cs" Inherits="PowerTools2011Editor.PowerTools.Example.Main_PopUp" %>
<asp:Content ID="Content2" ContentPlaceHolderID="Main" runat="server">
    ASPX page rendered at:<%=DateTime.Now.ToLongTimeString() %>
    <hr />
    This page has full access to TOM.NET, like accessing the info about your user "<asp:Label ID="UserNameLabel" runat="server" />"
</asp:Content>
