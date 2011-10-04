<%@ Page Language="C#" AutoEventWireup="true"%>
<%@ Import Namespace="Tridion.Web.UI" %>
<%@ Register TagPrefix="ui"  Namespace="Tridion.Web.UI.Editors.CME.Controls" Assembly="Tridion.Web.UI.Editors.CME"  %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html id="ExamplePageAdmin" class="tridion popup" xmlns="http://www.w3.org/1999/xhtml"    xmlns:c="http://www.sdltridion.com/web/ui/controls">
<head runat="server">
    <title></title>
    <cc:TridionManager runat="server" editor="PowerTools2011">
		<dependencies runat="server">		
			<dependency runat="server">Tridion.Web.UI.Editors.CME</dependency>					
			<dependency runat="server">Tridion.Web.UI.Editors.CME.commands</dependency>	
		</dependencies>
	</cc:TridionManager>   
</head>

<body id="StackElement" class="stack popupview">
    <form id="form" runat="server">
    <div id="container" style="padding:10px">
        
        <h1>Simple Page for Admin Users</h1>
        <hr />
        The selected item was: <%=Request.Params["id"] %><br/>
        Rendered at: <%=DateTime.Now %>

    </div>
    </form>
</body>
</html>
