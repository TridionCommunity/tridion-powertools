<%@ Page Language="C#" AutoEventWireup="true" Inherits="PowerTools2011.Common.Pages.ExamplePage" %>
<%@ Import Namespace="Tridion.Web.UI" %>
<%@ Register TagPrefix="ui"  Namespace="Tridion.Web.UI.Editors.CME.Controls" Assembly="Tridion.Web.UI.Editors.CME"  %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html id="ExamplePage" class="tridion popup" xmlns="http://www.w3.org/1999/xhtml"    xmlns:c="http://www.sdltridion.com/web/ui/controls">
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
        This is a example Powertool Popup which shows the use of a status bar. The tool make use of CLient and Server elements:<br />
        <strong>Client</strong>
        <ul>
            <li><em>/PowerTools/Client/PT_Example/PopUp.aspx (this pop-up):</em> used to control the main layout of the page</li>
            <li><em>/PowerTools/Client/PT_Example/PopUp.js:</em> JavaScript functions for the popup</li>
            <li><em>/PowerTools/Client/PT_Example/Command.js:</em> JavaScript command set to add buttons to the GUI (isAvailable/isEnabled/_execute)</li>
            <li><em>/PowerTools/Client/PT_Example/ServiceProxy.js:</em> JavaScript functions to create calls to the WCF service that does the work</li>
            <li><em>/PowerTools/Client/PT_Example/Styles.css:</em> CSS to control look and feel of this popup</li>
            <li><em>/PowerTools/Client/Shared/Theme/styles.css:</em> CSS to control look and feel of the buttons</li>
        </ul>

        <strong>Server</strong>
        <ul>
            <li><em>/PowerTools/Server/Example/ExampleService.svc:</em> the backend web service (which uses the library PowerTools2011.Services)</li>
        </ul>

        <hr />
        <div>
		    <c:Button ID="ExecuteButton" runat="server" Label="Execute" Class="customButton" />
		    <c:Button ID="SelectItem" runat="server" Label="Open Item Selector" Class="customButton"/>
        </div>
        <!--Progress bar stuff-->
        <div id="ModalDialog">
            <div id="dialog" class="window" style="border:2px solid black;width: 300px; height: 100px; background-color: white; text-align:center">
                <div style="border: 1px solid black; background-color: white; width:100%">
                    <div id="ProgressBar" style="height:15px; width:1px; background-color: navy;">&nbsp;</div>
                </div>
                <div id="ProgressStatus" style="width:100%; text-align:center">Progress</div>
                <c:Button id="CloseDialog" runat="server" Label="Close" Class="customButton"/>
            </div>
            <div id="mask">
                &#160;
            </div>
        </div>
        
    </div>
    </form>

    
</body>
</html>
