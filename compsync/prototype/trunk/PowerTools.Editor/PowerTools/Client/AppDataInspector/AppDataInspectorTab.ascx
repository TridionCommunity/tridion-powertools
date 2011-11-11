<%@ Control Language="C#" AutoEventWireup="true" Inherits="PowerTools.Editor.PowerTools.Client.AppDataInspector.AppDataInspectorTab" %>
<table id="tabletab">
	<thead>
		<tr>
			<th width="25%">
				Application Id
			</th>
			<th width="50%">
				Data
			</th>
			<th width="25%">
				Type
			</th>
		</tr>
	</thead>
	<tbody id="tbody">
	</tbody>
</table>
<div id="ModalDialog">
	<div id="dialog" class="window" style="border: 2px solid black; width: 300px; height: 100px;
		background-color: white; text-align: center">
		<div style="border: 1px solid black; background-color: white; width: 100%">
			<div id="ProgressBar" style="height: 15px; width: 1px; background-color: navy;">
				&nbsp;</div>
		</div>
		<div id="ProgressStatus" style="width: 100%; text-align: center">
			Progress</div>
	</div>
</div>
