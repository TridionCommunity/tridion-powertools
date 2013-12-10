<%@ Control Language="C#" AutoEventWireup="true" Inherits="PowerTools.Editor.PowerTools.Client.AppDataInspector.AppDataInspectorTab" %>
<div id="AppDataInspector" class="powertool">
	<table id="tabletab">
		<thead>
			<tr>
				<th width="25%">Application Id</th>
				<th width="50%">Data</th>
				<th width="25%">Type</th>
			</tr>
		</thead>
		<tbody id="tbody"></tbody>
	</table>
	<div id="ModalDialog">
		<div id="dialog" class="window">
			<div class="progressBorder">
				<div id="ProgressBar" class="progressBar">&nbsp;</div>
			</div>
			<div id="ProgressStatus" class="progressStatus">Loading...</div>
		</div>
		<div id="mask">
			&#160;
		</div>
	</div>
</div>