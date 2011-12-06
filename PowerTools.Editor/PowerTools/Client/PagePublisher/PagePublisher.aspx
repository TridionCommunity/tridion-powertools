<%@ Page Title="Page Publisher" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master" AutoEventWireup="true"
	CodeBehind="PagePublisher.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.PagePublisher.PagePublisher" %>



<asp:Content ID="PagePublisher" ContentPlaceHolderID="Main" runat="server">
        <div class="tool-explanation">Publish a collection of pages individually, as separate publish instructions. This can be necessary as when you press publish on a publication in SDL Tridion, if a failure occurs, the entire transaction will be fail.</div>

        <div id="StackElement1" class="stack horizontal">
            <div id="Options" class="stack-calc splitter vertical bottom-spacer-10">
                <div id="StackElement2" class="panel1 stack horizontal">
                    <!-- Select target types -->
                    <div class="ttLabel stack-elem">
						<asp:Literal ID="Literal1" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupTargetTypesList %>" />:
					</div>
					<div class="ttList stack-calc">
						<c:List id="TargetTypeList" runat="server" TabIndex="1" MultiSelect="true" />
					</div>
                </div>
                <div class="handle"></div>
                <div id="StackElement3" class="panel2">
                    <!-- All options -->
					<c:TabControl runat="server" ID="OptionsTabControl" ActivePage="PublishTab" Class="stack horizontal">
						<c:DeckPage runat="server" ID="PublishTab" Label="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupPublishSettings %>" IsHidden="true">
							<!-- Publish opts -->
							<div id="publishFields" class="stack horizontal">
								<div class="stack-elem box-spacer-5">
									<input id="publishNow" type="radio" name="publishWhen" class="radio" tabindex="3" checked="checked" />
									<label for="publishNow"><asp:Literal ID="litPublishNow" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupPublishNow %>" /></label>
								</div>
								<div class="stack-elem box-spacer-5 clearfix">
									<div>
										<input id="publishLater" type="radio" name="publishWhen" class="radio" tabindex="3" />
										<label for="publishLater"><asp:Literal ID="litPublishLater" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupPublishLater %>" /></label>
									</div>
									<div id="setPublishLater" style="display:none" class="top-spacer-5 dt-box">
										<c:Date id="PublishLaterDate" runat="server" IsSeparateFields="false" AddClearButton="false" TabIndex="19"></c:Date>
									</div>
								</div>
								<div class="stack-elem box-spacer-5">
									<div>
										<input id="schedulePublish" type="radio" name="publishWhen" class="radio" tabindex="3" />
										<label for="schedulePublish"><asp:Literal ID="Literal4" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupPublishScheduled %>" /></label>
									</div>
									<div id="setSchedulePublish" style="display:none" class="left-tabbed top-spacer-5">
										<table border="0" width="100%" cellpadding="0" cellspacing="5" class="sp">
											<tbody>
												<tr>
													<td class="text_highlight"><asp:Literal ID="Literal5" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupPhase1 %>" /></td>
												</tr>
												<tr>
													<td>
														<div id="StackElement4" class="sp-elem stack horizontal">
															<div class="stack-elem box-spacer-5">
																<input id="generateContentNow" type="radio" name="gpc" class="radio" tabindex="3" checked="checked" />
																<label for="generateContentNow"><asp:Literal ID="Literal6" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupPhase1GenerateContentNow %>" /></label>
															</div>
															<div class="stack-elem box-spacer-5">
																<div>
																	<input id="generateContentLater" type="radio" name="gpc" class="radio" tabindex="3" />
																	<label for="generateContentLater"><asp:Literal ID="Literal7" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupPhase1GenerateContentLater %>" /></label>
																</div>
																<div id="setGenerateContentLater" style="display:none" class="top-spacer-5 dt-box">
																	<c:Date id="GenerateContentDate" runat="server" IsSeparateFields="false" AddClearButton="false" TabIndex="19"></c:Date>
																</div>
															</div>
														</div>
													</td>
												</tr>
												<tr>
													<td class="text_highlight"><asp:Literal ID="Literal8" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupPhase2 %>" /></td>
												</tr>
												<tr>
													<td>
														<div id="StackElement5" class="sp-elem stack horizontal">
															<div class="stack-elem box-spacer-5">
																<input id="placeContentNow" type="radio" name="pco" class="radio" tabindex="3" checked="checked" />
																<label for="placeContentNow"><asp:Literal ID="Literal9" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupPhase2PlaceContentNow %>" /></label>
															</div>
															<div class="stack-elem box-spacer-5">
																<div>
																	<input id="placeContentLater" type="radio" name="pco" class="radio" tabindex="3" />
																	<label for="placeContentLater"><asp:Literal ID="Literal10" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupPhase2PlaceContentLater %>" /></label>
																</div>
																<div id="setPlaceContentLater" style="display:none" class="top-spacer-5 dt-box">
																	<c:Date id="PlaceContentDate" runat="server" IsSeparateFields="false" AddClearButton="false" TabIndex="19"></c:Date>
																</div>
															</div>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>								
								<div class="stack-elem box-spacer-10 smaller">
									<asp:Literal ID="Literal11" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupPublishNote %>" />
								</div>
								<div class="stack-elem box-spacer-5 top-spacer-15" style="display:none">
									<div>
										<input id="republish" type="checkbox" tabindex="27" checked="checked" />
										<label for="republish"><asp:Literal ID="Literal12" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupRepublish %>" /></label>
									</div>
								</div>									
							</div>
                            <div class="stack-elem box-spacer-5">
	                            <div>
		                            <input id="RepublishChk" type="checkbox" tabindex="4" />
		                            <label for="republish"><asp:Literal ID="litRepublish" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishPopupRepublish %>" /></label>
	                            </div>
                            </div>
                            <div class="stack-elem box-spacer-5">
                                <label><asp:Literal ID="litPublishPriority" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, Priority %>" />:</label>
                                <select id="Priority">
                                    <option value="2">Low</option>
                                    <option value="4">Normal</option>
                                    <option value="6">High</option>
                                </select>	
                            </div>
						</c:DeckPage>
						<c:DeckPage runat="server" ID="AdvancedTab" Label="<%$ Resources: Tridion.Web.UI.Strings, Advanced %>" IsHidden="false">
                            <div class="stack-elem box-spacer-5">
	                            <input id="RecursiveChk" type="checkbox" class="radio" tabindex="3"  />
	                            <label for="recursive"><asp:Literal ID="litRecursive" runat="server" Text="Recursive" /></label>
                            </div>
				            <div class="stack-elem box-spacer-5">
					            <input id="PublishChildrenChk" type="checkbox" tabindex="26" />
					            <label for="propagateInChildren"><asp:Literal ID="litPublishChildren" runat="server" Text="Publish in child publications" /></label>
				            </div>  
				            <div class="stack-elem box-spacer-5">
					            <input id="resolveStructureGroupInfoChk" type="checkbox" tabindex="23" />
					            <label for="resolveStructureGroupInfo"><asp:Literal ID="litPublishStructureGroup" runat="server" Text="<%$ Resources: Tridion.Web.UI.Strings, PublishUnpublishStructureInformation %>" /></label>
				            </div> 
				            <div class="stack-elem box-spacer-5">
					            <input id="includeComponentLinksChk" type="checkbox" tabindex="24" />
					            <label for="includeComponentLinks"><asp:Literal ID="litIncludeComponentLinks" runat="server" Text="Include Component Links" /></label>
				            </div>                          
				            <div class="stack-elem box-spacer-5">
					            <input id="includeWorkFlowChk" type="checkbox" tabindex="25" />
					            <label for="includeWorkFlow"><asp:Literal ID="litIncludeWorkflow" runat="server" Text="Include Workflow" /></label>
				            </div>                                                    
						</c:DeckPage>
					</c:TabControl>



            </div>
            </div>
            <div id="Footer" class="footer stack-elem">
                <!-- Buttons -->
                <div class="box-spacer-10">
                    <div class="alignRight" style="width:50%">
                        <c:Button ID="ExecuteButton"  runat="server" disabled="disabled" Label="<%$ Resources: Tridion.Web.UI.Strings, Publish %>" Class="customButton" />
                    </div>
                </div>
            </div>
        </div>

</asp:Content>
