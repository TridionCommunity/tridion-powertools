<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master"  AutoEventWireup="true" CodeBehind="ImageUploader.aspx.cs" 
Inherits="PowerTools2011.Editor.PowerTools.Client.PT_ImageUploader.ImageUploader" %>


<asp:Content ID="Content1" ContentPlaceHolderID="Main" runat="server">
<div id="container" style="padding:10px">
       <cc:TridionManager runat="server" editor="PowerTools2011">
	        <dependencies runat="server">		
		        <dependency runat="server">Tridion.Web.UI.Editors.CME</dependency>					
		        <dependency runat="server">Tridion.Web.UI.Editors.CME.commands</dependency>	
	        </dependencies>
	    </cc:TridionManager>  

        <h1>Batch Image Uploader</h1>

          
        This will upload files from <asp:TextBox ID="txtSourceFolder" runat="server">c:\temp</asp:TextBox> to the folder :
        <asp:Label ID="lblFolderUri" runat="server" Text="Label"><%=Request.Params["id"] %></asp:Label>
           
        <hr />
        <div>
		    <c:Button ID="ExecuteButton"  runat="server" Label="Upload Images" Class="customButton" />
        </div>

        
    </div>

</asp:Content>
