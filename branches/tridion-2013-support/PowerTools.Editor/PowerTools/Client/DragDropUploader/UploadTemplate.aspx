<%@ Page Language="C#" AutoEventWireup="true"  CodeBehind="UploadTemplate.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.DragDropUploader.UploadTemplate" %>

<div id="pt_dragdropupload">
<div id="minmax"></div>
<div id="fileupload" class="fade well">       
    <div id="schemaDropdown">
      <p id="dropDownText">Select schema:</p>
      <c:dropdown id="SchemaDropDownForDdu" runat="server" nullable="false" />                    
    </div>
			
    <div id="uploadText">
        Drag and Drop files here to upload
    </div>   
</div>
</div>