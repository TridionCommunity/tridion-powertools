# No-nonsense guide to creating a power tool #
<a href='Hidden comment: 
See http://code.google.com/p/support/wiki/WikiSyntax#+1_Button
for details on the PlusOne button.
'></a>




---

**This guide is for _developing_ a Power Tool. See the InstallationGuide  to just configure and install the existing set of tools.**

---




# Setup #
## Get Solution ##
  1. Get the latest power tools code from https://tridion-2011-power-tools.googlecode.com/svn/trunk/ (or use http:// instead for the read-only version of it)

> 2. Locate the Reference Assemblies folder and copy the Core dll into it from **TRIDION**\Web\WebUI\WebRoot\bin\Tridion.Web.UI.Core.dll

> 3. Confirm the post-build event to PowerTools.Common, PowerTools.Editor and PowerTools.Model (no changes needed if this matches):
```
IF DEFINED TRIDION_CM_HOME (
xcopy "$(TargetDir)$(TargetName).*" "%TRIDION_CM_HOME%\Web\WebUI\WebRoot\bin" /y
)
```

> 4. Build the CustomInstallerView project first before building the solution the first time.

> 5. Build the solution

## Configure CME ##
### System.Config ###
  1. Edit System.Config (in TRIDION\web\WebUI\WebRoot\Configuration)
  * Add the Editor configuration (copy from Editor.Fragment.Config and correct the path)
  * Add the Model configuration (copy from Model.Fragment.config and correct the path)

### Virtual Directories ###
  1. Add virtual directories in IIS:
  * Add a new virtual directory (not an application) called PowerTools under WebUI\Editors, pointing to the PowerTools.Editor folder.
  * Also add a new virtual directory called PowerTools under WebUI\Models, pointing to the PowerTools.Model folder.

> At this point the existing PowerTools and icons should be visible in the CME. Read on to create your new PowerTool!

# Create New Tool #
## Copy Example ##
  1. Create a copy of the “ImageUploader” Power Tool (copy the PowerTools\Client\ImageUploader folder to a folder named "PublicationInfo")

  1. Rename all files inside this folder to PublicationInfo**(replacing ImageUploader)**

## Edit Page ##
  1. Edit the PublicationInfo.aspx file:
```
<%@ Page Title="" Language="C#" MasterPageFile="../Shared/Views/PopUp.Master" AutoEventWireup="true"
    CodeBehind="PublicationInfo.aspx.cs" Inherits="PowerTools.Editor.PowerTools.Client.PublicationInfo.PublicationInfo" %>

<asp:Content ID="PublicationInfo" ContentPlaceHolderID="Main" runat="server">
    <h1>
        Publication Info</h1>
    <div class="tool-explanation">
        This tool will get you a list of publications currently on the server.
    </div>
    <hr />
    <div>
        <c:button id="ExecuteButton" runat="server" label="Get List of Publications" class="customButton" />
    </div>
    <div id="PublicationList" style="float: left;>
    </div>
</asp:Content>
```

### Edit Code-Behind File ###
  1. Edit the PublicationInfo.aspx.cs file
```
using System;
using Tridion.Web.UI.Core.Controls;
using Tridion.Web.UI.Controls;
using PowerTools.Common.Pages;

namespace PowerTools.Editor.PowerTools.Client.PublicationInfo
{
    [ControlResourcesDependency(new Type[] { typeof(Popup), typeof(Button), typeof(Stack) })]
    [ControlResources("PowerTools.PublicationInfo")]
    public class PublicationInfo : PowerToolsPageBase
    {
    }
}
```

### Edit JavaScript ###
#### PublicationInfo.js ####
  1. Edit the PublicationInfo.js file

  * Find/Replace “ImageUploader” ==> “PublicationInfo”
  * comment line 30 (c.SchemaControl …)
  * comment line 31 ($evt.addEventHandler(c.SchemaControl …)
  * comment lines 36 to 46 (related to params schemaUri, localDirectory)
  * replace params with null on lines 55 and 57 (schemaUri, localDirectory)
  * comment lines 68 to 92 (onSchemaLoadContent function)
  * comment lines 94 to 100 (getListFieldsSchemas function)

#### PublicationInfoCommand.js ####
  1. Edit the PublicationInfoCommand.js file

  * Find/Replace “ImageUploader” ==> “PublicationInfo”
  * Change isAvailable and isEnabled to always return true
  * Comment lines 25 to 28 (var uriSelection...var self)
  * Remove “+"#folderId=" + uriSelection” from line 30

### Icons ###
  1. Create the icons for the PowerTool
  * Go to [this page](http://openiconlibrary.sourceforge.net/gallery2/?./Icons/actions/db_status.png) to find the icon
  * Save the 16x16 and 32x32 files under PowerTools.Editor\PowerTools\Client\Shared\Theme\Icons, rename them to publicationinfo\_16.png and publicationinfo\_32.png

### Styles ###
  1. Edit PowerTools.Editor\PowerTools\Client\Shared\Theme\styles.css
  * Copy the following 3 lines to this CSS

```
.PT_PublicationInfo .image {background-image:url({ThemePath}/Icons/publicationinfo_16.png);}
.ribbontoolbar .button.PT_PublicationInfo .image {background-image: url({ThemePath}/Icons/publicationinfo_32.png);} 
.ribbontoolbar.minimized .button.PT_PublicationInfo .image {background-image: url({ThemePath}/Icons/publicationinfo_16.png);} 
```

## Configuration ##
  1. Edit PowerTools.Editor\Configuration\Editor.config
  * Create a cfg:group for this PowerTool
```
      <cfg:group name="PowerTools.PublicationInfo" merge="always">
        <cfg:fileset>
          <cfg:file type="style">/PowerTools/Client/PublicationInfo/PublicationInfo.css</cfg:file>
          <cfg:file type="script">/PowerTools/Client/PublicationInfo/PublicationInfoServiceProxy.js</cfg:file>
          <cfg:file type="script">/PowerTools/Client/PublicationInfo/PublicationInfo.js</cfg:file>
        </cfg:fileset>
        <cfg:dependencies>
          <cfg:dependency>Tridion.Web.UI.Editors.CME</cfg:dependency>
          <cfg:dependency>Tridion.Web.UI.Editors.CME.commands</cfg:dependency>
          <cfg:dependency>PowerTools.Resources.Base</cfg:dependency>
        </cfg:dependencies>
      </cfg:group>
```
  * Register the command for this power tool
```
<cfg:file type="script">/PowerTools/Client/PublicationInfo/PublicationInfoCommand.js</cfg:file>
```
  * Create the extension element for this power tool
```
            <!-- PublicationInfo PowerTool -->
            <ext:extension assignid="PublicationInfo" name="Publication&lt;br/&gt;Info" pageid="PowerTools 2012" groupid="Tools">
              <ext:command>PT_PublicationInfo</ext:command>
              <ext:title>Publication Info</ext:title>
              <ext:issmallbutton>false</ext:issmallbutton>
              <ext:dependencies>
                <cfg:dependency>PowerTools.Commands</cfg:dependency>
              </ext:dependencies>
              <ext:apply>
                <ext:view name="DashboardView" />
              </ext:apply>
            </ext:extension>
```
  * Configure the Command set
```
<cfg:command name="PT_PublicationInfo" implementation="PowerTools.Commands.PublicationInfo"/>
```

Rebuild the PowerTools.Editor project.

## Confirm Button ##
Save & Reload the CME, you should now see your new button in the PowerTools 2012 Ribbon toolbar, and clicking it will bring up the popup.

# Build the webservice #
## Copy the Example ##
Copy PowerTools.Model\Services\Example.svc into a PublicationInfo.svc file in the same folder

Set the code to:
```
<%@ ServiceHost Language="C#" Debug="true" Service="PowerTools.Model.Services.PublicationInfo"%>
```

## Configure and add Binding ##
Edit the Web.config in the Model project.
Add a Service binding:
```
      <service name="PowerTools.Model.Services.PublicationInfo" behaviorConfiguration="Tridion.Web.UI.ContentManager.WebServices.DeveloperBehavior">
        <endpoint name="PublicationInfo" address="" behaviorConfiguration="Tridion.Web.UI.ContentManager.WebServices.AspNetAjaxBehavior" binding="webHttpBinding" bindingConfiguration="Tridion.Web.UI.ContentManager.WebServices.WebHttpBindingConfig" contract="PowerTools.Model.Services.PublicationInfo"/>
      </service>
```

## Create "Data" Class File ##
Create a new "Class File" in this folder, name it PublicationData.cs with the following code:
```
using System.Runtime.Serialization;
namespace PowerTools.Model.Services
{
    [DataContract]
    public class PublicationData
    {
        [DataMember]
        public string Title;
        [DataMember]
        public string Id;
        [DataMember]
        public int ItemCount;
    }
}
```

## Create Model Services Class File ##
Create another class file, PublicationInfo.svc.cs with the following code:
```
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using PowerTools.Services.Progress;
using Tridion.ContentManager.CoreService.Client;

namespace PowerTools.Model.Services
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    [ServiceContract(Namespace = "PowerTools.Model.Services")]
    public class PublicationInfo : BaseService
    {
        private List<PublicationData> _publicationInfos;

        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public ServiceProcess Execute()
        {
            return ExecuteAsync(null);
        }

        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public override ServiceProcess GetProcessStatus(string Id)
        {
            return base.GetProcessStatus(Id);
        }

        [OperationContract, WebGet(ResponseFormat = WebMessageFormat.Json)]
        public List<PublicationData> GetPublicationInfo()
        {
            return _publicationInfos;
        }

        public override void Process(ServiceProcess process, object arguments)
        {
            _publicationInfos = new List<PublicationData>();
            var client = Common.CoreService.Client.GetCoreService();
            try
            {
                RepositoriesFilterData filter = new RepositoriesFilterData();
                IdentifiableObjectData[] datas = client.GetSystemWideList(filter);
                int totalPublications = datas.Length;
                int count = 0;
                foreach (RepositoryData repository in datas.Cast<RepositoryData>())
                {
                    process.SetStatus("Reading publication" + repository.Title);
                    PublicationData pubInfo = new PublicationData {Id = repository.Id, Title = repository.Title};
                    RepositoryItemsFilterData filterData = new RepositoryItemsFilterData {Recursive = true};
                    pubInfo.ItemCount = client.GetListXml(repository.Id, filterData).ChildNodes.Count;
                    _publicationInfos.Add(pubInfo);
                    process.SetCompletePercentage(++count * 100 / totalPublications);
                }
                process.Complete();
            }
            finally
            {
                if (client != null)
                    client.Close();
            }
        }
    }
}
```

## Update JavaScript File ##
Modify PublicationInfo.js to use the following code (which includes the handling of GetPublicationList):
```
Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.PublicationInfo = function () {

    Type.enableInterface(this, "PowerTools.Popups.PublicationInfo");
    this.addInterface("Tridion.Cme.View");

    var p = this.properties;

    p.processId = null;
    p.folderId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
};

PowerTools.Popups.PublicationInfo.prototype.initialize = function () {

    $log.message("initializing example popup...");
    this.callBase("Tridion.Cme.View", "initialize");
    var p = this.properties;
    var c = p.controls;


    c.ExecuteButton = $controls.getControl($("#ExecuteButton"), "Tridion.Controls.Button");
    c.CloseButton = $controls.getControl($("#CloseDialog"), "Tridion.Controls.Button");

    $evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._onExecuteButtonClicked));
    $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onCloseButtonClicked));
};

PowerTools.Popups.PublicationInfo.prototype._onExecuteButtonClicked = function () {

    $j('#CloseDialog').hide();

    var p = this.properties;
    var context = this;


    PowerTools.Model.Services.Execute

    p.proxy.Execute(function (response) {
        p.processId = response.d.Id;

        setTimeout(function () {
            context._getStatus(p.processId, context);
        }, p.pollInterval);
    }, null, null);

    var dialog = $j("#dialog");
    var win = $j(window);

    //Get the screen height and width
    var maskHeight = $j(document).height();
    var maskWidth = win.width();

    //Set height and width to mask to fill up the whole screen
    $j('#mask').css({ 'width': maskWidth, 'height': maskHeight }).fadeIn(1000).fadeTo("slow", 0.8);

    //Get the window height and width

    var winH = win.height();
    var winW = win.width();

    //Set the popup window to center
    dialog.css({ "top": (winH / 2 - dialog.height() / 2),
        "left": (winW / 2 - dialog.width() / 2)
    }).fadeIn(2000);
};

PowerTools.Popups.PublicationInfo.prototype._onCloseButtonClicked = function () {
    $j('#mask, .window').hide();
    $j('#ProgressStatus').html("");
    $j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
};



PowerTools.Popups.PublicationInfo.prototype._updateProgressBar = function (process) {

    $j('#ProgressStatus').html(process.Status);
    $j('#ProgressBar').css({ 'width': process.PercentComplete + '%', 'display': 'block' });
};

PowerTools.Popups.PublicationInfo.prototype._handleStatusResponse = function (response, context) {
    var p = context.properties;

    p.processId = response.Id;

    context._updateProgressBar(response);

    if (response.PercentComplete < 100) {
        setTimeout(function () {
            context._getStatus(p.processId, context);
        }, p.pollInterval);
    }
    else {
        context._getPublicationInfo(p.processId, context);
        $j('#ProgressStatus').html(response.Status);
        $j('#CloseDialog').show();
        p.processId = "";
    }

};

PowerTools.Popups.PublicationInfo.prototype._handlePublicationList = function (response, context) {
    var content = '';

    // alert(response.length);

    for (var i = 0; i < response.d.length; i++) {
        content += response.d[i].Title + ' (' + response.d[i].Id + '): ' + response.d[i].ItemCount + ' items.<br/>';
        //alert('processing ' + response.d[i].Id);
    };
    $j('#PublicationList').html(content);

};


PowerTools.Popups.PublicationInfo.prototype._getPublicationInfo = function (id, context) {
    if (id != "") {

        context.properties.proxy.GetPublicationList(id, this._handlePublicationList, context);
    }
};

PowerTools.Popups.PublicationInfo.prototype._getStatus = function (id, context) {
    if (id != "") {
        context.properties.proxy.GetProcessStatus(id, this._handleStatusResponse, context);
    }
};

$display.registerView(PowerTools.Popups.PublicationInfo);
```Type.registerNamespace("PowerTools.Popups");

PowerTools.Popups.PublicationInfo = function () {

    Type.enableInterface(this, "PowerTools.Popups.PublicationInfo");
    this.addInterface("Tridion.Cme.View");

    var p = this.properties;

    p.processId = null;
    p.folderId = null;
    p.pollInterval = 500; //Milliseconds between each call to check the status of a process
};

PowerTools.Popups.PublicationInfo.prototype.initialize = function () {

    $log.message("initializing example popup...");
    this.callBase("Tridion.Cme.View", "initialize");
    var p = this.properties;
    var c = p.controls;


    c.ExecuteButton = $controls.getControl($("#ExecuteButton"), "Tridion.Controls.Button");
    c.CloseButton = $controls.getControl($("#CloseDialog"), "Tridion.Controls.Button");

    $evt.addEventHandler(c.ExecuteButton, "click", this.getDelegate(this._onExecuteButtonClicked));
    $evt.addEventHandler(c.CloseButton, "click", this.getDelegate(this._onCloseButtonClicked));
};

PowerTools.Popups.PublicationInfo.prototype._onExecuteButtonClicked = function () {

    $j('#CloseDialog').hide();

    var p = this.properties;
    var context = this;


    PowerTools.Model.Services.Execute

    p.proxy.Execute(function (response) {
        p.processId = response.d.Id;

        setTimeout(function () {
            context._getStatus(p.processId, context);
        }, p.pollInterval);
    }, null, null);

    var dialog = $j("#dialog");
    var win = $j(window);

    //Get the screen height and width
    var maskHeight = $j(document).height();
    var maskWidth = win.width();

    //Set height and width to mask to fill up the whole screen
    $j('#mask').css({ 'width': maskWidth, 'height': maskHeight }).fadeIn(1000).fadeTo("slow", 0.8);

    //Get the window height and width

    var winH = win.height();
    var winW = win.width();

    //Set the popup window to center
    dialog.css({ "top": (winH / 2 - dialog.height() / 2),
        "left": (winW / 2 - dialog.width() / 2)
    }).fadeIn(2000);
};

PowerTools.Popups.PublicationInfo.prototype._onCloseButtonClicked = function () {
    $j('#mask, .window').hide();
    $j('#ProgressStatus').html("");
    $j('#ProgressBar').css({ 'width': 0 + '%', 'display': 'none' });
};



PowerTools.Popups.PublicationInfo.prototype._updateProgressBar = function (process) {

    $j('#ProgressStatus').html(process.Status);
    $j('#ProgressBar').css({ 'width': process.PercentComplete + '%', 'display': 'block' });
};

PowerTools.Popups.PublicationInfo.prototype._handleStatusResponse = function (response, context) {
    var p = context.properties;

    p.processId = response.Id;

    context._updateProgressBar(response);

    if (response.PercentComplete < 100) {
        setTimeout(function () {
            context._getStatus(p.processId, context);
        }, p.pollInterval);
    }
    else {
        context._getPublicationInfo(p.processId, context);
        $j('#ProgressStatus').html(response.Status);
        $j('#CloseDialog').show();
        p.processId = "";
    }

};

PowerTools.Popups.PublicationInfo.prototype._handlePublicationList = function (response, context) {
    var content = '';

    // alert(response.length);

    for (var i = 0; i < response.d.length; i++) {
        content += response.d[i].Title + ' (' + response.d[i].Id + '): ' + response.d[i].ItemCount + ' items.<br/>';
        //alert('processing ' + response.d[i].Id);
    };
    $j('#PublicationList').html(content);

};


PowerTools.Popups.PublicationInfo.prototype._getPublicationInfo = function (id, context) {
    if (id != "") {

        context.properties.proxy.GetPublicationList(id, this._handlePublicationList, context);
    }
};

PowerTools.Popups.PublicationInfo.prototype._getStatus = function (id, context) {
    if (id != "") {
        context.properties.proxy.GetProcessStatus(id, this._handleStatusResponse, context);
    }
};

$display.registerView(PowerTools.Popups.PublicationInfo);
}}}```