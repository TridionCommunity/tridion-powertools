<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Example.aspx.cs" Inherits="PowerTools2011Editor.PowerTools.Example.WCFJQueryTest"  ClassName="ExamplePowerTool" %>
<%@ Import Namespace="Tridion.Web.UI" %>
<%@ Register TagPrefix="ui"  Namespace="Tridion.Web.UI.Editors.CME.Controls" Assembly="Tridion.Web.UI.Editors.CME"  %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html id="ExamplePage" xmlns="http://www.w3.org/1999/xhtml"    xmlns:c="http://www.sdltridion.com/web/ui/controls">
<head runat="server">
    <title></title>
    <cc:TridionManager runat="server" editor="PowerTools2011">
		<dependencies runat="server">		
			<dependency runat="server">Tridion.Web.UI.Editors.CME</dependency>					
			<dependency runat="server">Tridion.Web.UI.Editors.CME.commands</dependency>	

		</dependencies>
	</cc:TridionManager>
    
    <style type="text/css">
        body{
                font-family: Arial;
    font-size:12px;
        }
        /* Z-index of #mask must lower than #boxes .window */
        #mask
        {
            position: absolute;
            top: 0;
            left:0;
            z-index: 9000;
            background-color: #000;
            display: none;
        }
        
        #ModalDialog .window
        {
            position: absolute;
            width: 440px;
            height: 200px;
            display: none;
            z-index: 9999;
            padding: 20px;
        }
        
        
        /* Customize your modal window here, you can add background image too */
        #boxes #dialog
        {
            width: 375px;
            height: 203px;
        }
    </style>
    <script type="text/javascript" src="../Shared/JQuery.js"></script>
    <script type="text/javascript" src="ExampleService.js"></script>
   
</head>
<body id="StackElement" class="stack popupview">
    <form id="form" runat="server">
    <div id="container">
<%--		<div id="TopPanel" class="stack-elem tridion-logo-background">
			<ui:ActiveMessageCenter id="MessageCenter" runat="server" />
			<img src="../../../Styles/icons/manage.png" alt="manage"/>
		</div>--%>
        

    <div>
        <input type="button" name="modal" id="ExecuteButton" onclick="Execute()" value="Execute()" />
        <input type="button" name="btnSelectItem" id="btnSelectItem" onclick="OpenItemSelectPopUp()" value="OpenItemSelectPopUp()" />
    </div>
    <div id="ModalDialog">
        <div id="dialog" class="window" style="border:2px solid black;width: 300px; height: 100px; background-color: white;">
            <div style="border: 1px solid black; background-color: white; width:100%">
                <div id="ProgressBar" style="height:15px; background-color: navy;">&nbsp;</div>
            </div>
            <div id="ProgressStatus" style="width:100%; text-align:center">Status</div>
            <input type="button" name="btnCloseDialog" id="btnCloseDialog" onclick="CloseDialog()" value="Close" style="display:none" />
            
        </div>
        <div id="mask">
            &#160;
        </div>
    </div>
    </div>
    </form>
    <script type="text/javascript">



        var proxy = new ServiceProxy();
        var processid;
        var pollinterval = 500;//Milliseconds between each call to check the status of an process

        $(document).ready(function () {

        });

        function Execute() {
            proxy.Execute(handleExecute);
            var id = "#dialog";

            //Get the screen height and width
            var maskHeight = $(document).height();
            var maskWidth = $(window).width();

            //Set height and width to mask to fill up the whole screen
            $('#mask').css({ 'width': maskWidth, 'height': maskHeight });

            //transition effect     
            $('#mask').fadeIn(1000);
            $('#mask').fadeTo("slow", 0.8);

            //Get the window height and width
            var winH = $(window).height();
            var winW = $(window).width();

            //Set the popup window to center
            $(id).css('top', winH / 2 - $(id).height() / 2);
            $(id).css('left', winW / 2 - $(id).width() / 2);

            //transition effect
            $(id).fadeIn(2000);       
        }

        function GetStatus(id) {
            if (id != "") {
                proxy.GetProcessStatus(id, handleStatusResponse);
            }
        }

        function handleExecute(response) {
            processid = response.d.Id;
            setTimeout("GetStatus(processid);", pollinterval);
        }

        function handleStatusResponse(response) {
            processid = response.d.Id;
            UpdateProgressBar(response)
            if (response.d.PercentComplete < 100) {
                setTimeout("GetStatus(processid);", pollinterval);
            } else {
                $('#btnCloseDialog').show();
                processid = ""
            }
        }

        function UpdateProgressBar(process) {

            $('#ProgressStatus').html(process.d.Status);
            $('#ProgressBar').css({ 'width': process.d.PercentComplete + '%', 'display': 'block' });
        }

        function CloseDialog() {
            $('#mask, .window').hide();
            $('#ProgressStatus').html("");
            $('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
        }




        


//        function OpenItemSelectPopUp(event)

//         {
//            var p;
//            // Open item selector popup
//            var filter = {
//                conditions:
//			    {
//			        ItemTypes: [$const.ItemType.COMPONENT],
//			        ShowNewItems: false
//			    }//            };

//			var rootId = "tcm:1-1-2";
//			var locationId = "tcm:1-1-2";

//            var self = this;

//                ItemPopup = $popup.create($cme.Popups.ITEM_SELECT.URL.format(rootId), $cme.Popups.ITEM_SELECT.URL.format(locationId), $cme.Popups.ITEM_SELECT.FEATURES, { filter: filter });

//            function Link$_onBrowseClicked$onPopupClosed(event) {
//                // Release
//                if (p.ItemPopup) {
//                    p.ItemPopup.dispose();
//                    p.ItemPopup = null;
//                }
//            };

//            $evt.addEventHandler(ItemPopup, "insert",
//			function Link$_onBrowseClicked$onPopupSubmitted(event) {
//			    // Update
//			    var items = event.data.items;
//			    if (items) {
//			        var itemId, itemName;
//			        for (var i = 0, len = items.length; i < len; i++) {
//			            itemId = items[i];
//			            if (!String.isNullOrEmpty(itemId)) {
//			                var item = $models.getItem(itemId);
//			                if (item) {
//			                    itemName = item.getStaticTitle();
//			                }
//			            }
//			            break;
//			        }

//			        if (itemId && itemName) {
//			            p.NewLink.href = itemId;
//			            p.NewLink.tcmuri = itemId;
//			            p.NewLink.value = itemId;
//			            if (p.NewLink.title !== undefined) {
//			                p.NewLink.title = itemName;
//			            }
//			            p.NewLink.tcmname = itemName;

//			            self._onTypeChange();
//			        }
//			    }

//			    // Release
//			    Link$_onBrowseClicked$onPopupClosed();
//			});
//                $evt.addEventHandler(ItemPopup, "unload", Link$_onBrowseClicked$onPopupClosed);

//                ItemPopup.open();
//            }
        

    </script>
</body>
</html>
