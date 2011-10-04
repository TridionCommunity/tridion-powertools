<%@ Page Language="C#" AutoEventWireup="true" Inherits="PowerTools2011.Common.Pages.ImageUploader" %>
<%@ Import Namespace="Tridion.Web.UI" %>
<%@ Register TagPrefix="ui"  Namespace="Tridion.Web.UI.Editors.CME.Controls" Assembly="Tridion.Web.UI.Editors.CME"  %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html id="ImageUploader" class="tridion popup" xmlns="http://www.w3.org/1999/xhtml"    xmlns:c="http://www.sdltridion.com/web/ui/controls">
<head runat="server">
    <title></title>
    <cc:tridionmanager runat="server" editor="PowerTools2011">
		<dependencies runat="server">	
            <dependency runat="server">Powertools2011.Example</dependency>	
			<dependency runat="server">Tridion.Web.UI.Editors.CME</dependency>					
			<dependency runat="server">Tridion.Web.UI.Editors.CME.commands</dependency>	
		</dependencies>
	</cc:tridionmanager>   
</head>

<body id="StackElement" class="stack popupview">
    <form id="form" runat="server">
    <div id="container" style="padding:10px">
        <h1>Batch Image Uploader</h1>

          <c:Dropdown ID="Schema" runat="server" Nullable="false"/>

        <hr />
        <div>
		    <c:Button ID="ExecuteButton" runat="server" Label="Execute" Class="customButton" />
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
