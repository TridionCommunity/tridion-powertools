<%@ Page Language="C#" AutoEventWireup="true" Inherits="PowerTools.Editor.PowerTools.Client.Example.ExamplePage"
    MasterPageFile="../Shared/Views/PopUp.Master" %>

<asp:Content ID="ExampleContent" ContentPlaceHolderID="Main" runat="server">
        <h2>PowerTools Help</h2>
        <p>
            This example PowerTool demonstrates the status bar using Client (JavaScript) and
            Server (Core Service) code:</p>
        <c:tabcontrol runat="server" id="ContactTabs" activepage="ClientTab" class="vertical">
            <c:deckpage runat="server" id="ClientTab" label="Client">
                <table summary="Paths and descriptions of the client and server parts of a PowerTool.">
                    <thead>
                        <tr>
                            <th>
                                Path
                            </th>
                            <th>
                                Purpose
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                /PowerTools/Client/Example/Example.aspx<br />
                                (this pop-up)
                            </td>
                            <td>
                                displays content and controls layout
                            </td>
                        </tr>
                        <tr>
                            <td>
                                /PowerTools/Client/Example/Example.js:
                            </td>
                            <td>
                                JavaScript functions for this popup
                            </td>
                        </tr>
                        <tr>
                            <td>
                                /PowerTools/Client/Example/ExampleCommand.js:
                            </td>
                            <td>
                                JavaScript commands to add buttons to the GUI, for example:
                                <ul>
                                    <li>isAvailable</li>
                                    <li>isEnabled</li>
                                    <li>_execute</li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                /PowerTools/Client/Example/Example.css
                            </td>
                            <td>
                                Cascading Style Sheet (CSS) controls look and feel of page (pop-up) elements
                            </td>
                        </tr>
                        <tr>
                            <td>
                                /PowerTools/Client/Shared/Theme/styles.css
                            </td>
                            <td>
                                CSS controls look and feel of the buttons
                            </td>
                        </tr>
                    </tbody>
                </table>
            </c:deckpage>
            

            <c:deckpage runat="server" id="ServerTab" label="Server">
                <ul>
                    <li><em>PowerTools.Model/Services/Example.svc:</em> the back-end web service</li>
                </ul>
                <hr />
                <div class="">
                    <div class="stack-elem box-spacer-5">
                        <c:button id="UserButton" runat="server" label="Get User Info" class="customButton" />
                        <c:button id="SelectItem" runat="server" label="Open Item Selector" class="customButton" />
                        <c:button id="ExecuteButton" runat="server" label="Execute" class="customButton" />
                        </div>
                        <div class="stack-elem box-spacer-5 clearfix">
                        <div class="dt-box">
                        <label id="UserInfo">
                            User Info</label>
                        <label id="SelectedItem">
                            Item</label>
                    
                        <label>
                            Dropdown with publications:</label>
                        <c:dropdown id="Publications" runat="server" nullable="false" />
                        <label id="selectedPublication">
                        </label>
                    
                    </div>
                </div>
            </c:deckpage>
        </c:tabcontrol>
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
</asp:Content>
