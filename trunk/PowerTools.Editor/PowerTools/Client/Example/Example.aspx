<%@ Page Language="C#" Title="Example: PowerTool" AutoEventWireup="true" Inherits="PowerTools.Editor.PowerTools.Client.Example.ExamplePage"
    MasterPageFile="../Shared/Views/PopUp.Master" %>

<asp:Content ID="ExampleContent" ContentPlaceHolderID="Main" runat="server">
	<div id="Example">
		<div class="tool-explanation">
	        <p>This example PowerTool demonstrates the status bar using Client (JavaScript) and Server (Core Service) code:</p>
		</div>

        <c:tabcontrol runat="server" id="ContactTabs" activepage="ClientTab" class="vertical">
            <c:deckpage runat="server" id="ClientTab" label="Client">
                <table summary="Paths and descriptions of the client and server parts of a PowerTool.">
                    <thead>
                        <tr>
                            <th>Path</th>
                            <th>Purpose</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>/PowerTools/Client/Example/Example.aspx<br />
                                (this pop-up)
                            </td>
                            <td>Displays content and controls layout</td>
                        </tr>
                        <tr>
                            <td>/PowerTools/Client/Example/Example.js:</td>
                            <td>JavaScript functions for this popup</td>
                        </tr>
                        <tr>
                            <td>/PowerTools/Client/Example/ExampleCommand.js:</td>
                            <td>JavaScript commands to add buttons to the GUI, for example:
                                <ul>
                                    <li>isAvailable</li>
                                    <li>isEnabled</li>
                                    <li>_execute</li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td>/PowerTools/Client/Example/Example.css</td>
                            <td>Cascading Style Sheet (CSS) controls look and feel of page (pop-up) elements</td>
                        </tr>
                        <tr>
                            <td>/Themes/Carbon/General.css</td>
                            <td>CSS controls look and feel of the buttons</td>
                        </tr>
                    </tbody>
                </table>
            </c:deckpage>
            

            <c:deckpage runat="server" id="ServerTab" label="Server">
                <ul>
                    <li><em>PowerTools.Model/Services/Example.svc:</em> the back-end web service</li>
                </ul>
                <hr />
            </c:deckpage>


            <c:deckpage runat="server" id="ExampleTab" label="Examples">
                <div>
                    <label class="exampleLabel">Get the current user</label>
                    <c:button id="UserButton" runat="server" label="Get User Info" class="customButton" />
               </div>
                <hr class="clearline"/>
               <div>
                    <label class="exampleLabel">Select an item from the Building Blocks Folder</label>
                    <c:button id="SelectItem" runat="server" label="Open Item Selector" class="customButton" />
               </div>
               <hr  class="clearline"/>
               <div>
                    <label class="exampleLabel">Execute a background task</label>
                    <c:button id="ExampleExecuteButton" runat="server" label="Execute" class="customButton" />
               </div>
               <hr  class="clearline"/>
               <div>
                    <label class="exampleLabel">Populate publications list</label><br/>
                    <c:dropdown id="Publications" runat="server" nullable="false" /><br/>
                    <label id="selectedPublication"> </label>
               </div>
            
            </c:deckpage>
        </c:tabcontrol>
	</div>
</asp:Content>
