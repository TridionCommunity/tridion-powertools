<%@ Page Language="C#" AutoEventWireup="true" Inherits="PowerTools2011.Editor.PowerTools.Client.Example.ExamplePage"
    MasterPageFile="../Shared/Views/PopUp.Master" %>

<asp:Content ID="ExampleContent" ContentPlaceHolderID="Main" runat="server">
<div id="container" style="padding: 10px">
            This is an example PowerTool which shows the use of a status bar. The tool make
            use of Client and Server elements:<br />
            <strong>Client</strong>
            <ul>
                <li><em>/PowerTools/Client/Example/Example.aspx (this pop-up):</em> used to control
                    the main layout of the page</li>
                <li><em>/PowerTools/Client/Example/Example.js:</em> JavaScript functions for the popup</li>
                <li><em>/PowerTools/Client/Example/ExampleCommand.js:</em> JavaScript command set to
                    add buttons to the GUI (isAvailable/isEnabled/_execute)</li>
                <li><em>/PowerTools/Client/Example/Example.css:</em> CSS to control look and feel of
                    this popup</li>
                <li><em>/PowerTools/Client/Shared/Theme/styles.css:</em> CSS to control look and feel
                    of the buttons</li>
            </ul>
            <strong>Server</strong>
            <ul>
                <li><em>PowerTools2011 - Model/Services/Example.svc:</em> the back-end web service</li>
            </ul>
            <hr />
            <div>
                <p>
                    <c:button id="ExecuteButton" runat="server" label="Execute" class="customButton" />
                    <c:button id="SelectItem" runat="server" label="Open Item Selector" class="customButton" />
                    <label id="SelectedItem"></label>  
                </p>
                <br />
                <p>                
                    <label>Dropdown with publications:</label>
                    <c:Dropdown ID="Publications" runat="server" Nullable="false" />           
                    <label id="selectedPublication"></label>                                   
                </p>

            </div>
            <!--Progress bar stuff-->
            <div id="ModalDialog">
                <div id="dialog" class="window" style="border: 2px solid black; width: 300px; height: 100px;
                    background-color: white; text-align: center">
                    <div style="border: 1px solid black; background-color: white; width: 100%">
                        <div id="ProgressBar" style="height: 15px; width: 1px; background-color: navy;">
                            &nbsp;</div>
                    </div>
                    <div id="ProgressStatus" style="width: 100%; text-align: center">
                        Progress</div>
                    <c:button id="CloseDialog" runat="server" label="Close" class="customButton" />
                </div>
                <div id="mask">
                    &#160;
                </div>
            </div>
        </div>
</asp:Content>
  