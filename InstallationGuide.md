
---

**_To help develop a PowerTool see [Development Guide](nononsenseguide.md) instead._**

---


**Update: only use the following to build your PowerTools from Visual Studio, otherwise use the [RC1 installer](http://code.google.com/p/tridion-2011-power-tools/downloads/detail?name=PowerTools%202011%20RC1_1.msi).**

# Installation guide #

The following describes how to get the libraries (dll), create the necessary virtual directories in IIS, and set up the CME system configuration file. We'll eventually revisit the options for a [build script](DevelopmentTools#Tools.md).

## Prerequisites and Assumptions ##
  1. Be sure you have a [Tridion Developer Virtual Machine](http://www.sdltridionworld.com/articles/sdltridion2011/tutorials/creating-development-vm-1.aspx) or other working SDL Tridion 2011 or higher environment
  1. This assumes Tridion is installed in the default location for 64-bit Windows.
  1. These instructions will assume that you have checked out the power tools to the following directory:<br />
**C:\powertools**

## Get the code ##
First get the code from the repository following the guidance at
http://code.google.com/p/tridion-2011-power-tools/source/checkout

Read-only copy at
http://tridion-2011-power-tools.googlecode.com/svn/trunk/

## Add virtual directories in IIS ##
Open the IIS management snap-in.

  1. Open the Tridion web site, and find: **WebUI/Editors**
  1. Create a new virtual directory within Editors, called PowerTools
  1. Configure its physical path as: **C:\powertools\PowerTools.Editor\**
  1. Open the Tridion web site, and find: **WebUI/Models**
  1. Create a new virtual directory within Models, called PowerTools
  1. Configure its physical path as: **C:\powertools\PowerTools.Model\**

_The name and location of the virtual directory are referenced in the configuration. See below._

## Edit the Tridion GUI Extensions configuration ##

Open the configuration file:
C:\Program Files (x86)\Tridion\web\WebUI\WebRoot\Configuration\System.config

Locate the '

&lt;editors/&gt;

' element and add the power tools editor.

```
    <editor name="PowerTools" xmlns="http://www.sdltridion.com/2009/GUI/Configuration">
      <installpath>C:\powertools\PowerTools.Editor\</installpath>
      <configuration>Configuration\Editor.config</configuration>
      <vdir>PowerTools</vdir>
    </editor>
```

Locate the '

&lt;models/&gt;

' element and add the power tools editor.

```
    <model name="PowerTools" xmlns="http://www.sdltridion.com/2009/GUI/Configuration">
      <installpath>C:\powertools\PowerTools.Model\</installpath>
      <configuration>Configuration\Model.config</configuration>
      <vdir>PowerTools</vdir>
    </model>
```


## Add the Tridion Web.UI.Core DLL ##

  1. Open the Solution in Visual Studio 2010.
  1. Open the PowerTools.Common project
  1. Remove the Tridion.Web.UI.Core reference with the yellow warning icon
  1. Add the Tridion.Web.UI.Core reference from your server at 'C:\Program Files\Tridion\web\WebUI\WebRoot\bin'
  1. Repeat the same for the PowerTools.Editor project
  1. Build and compile(Ctrl-Shift-B shortcut)

## Update the URL to the Core Service (if not running CMS on http://localhost) ##
  1. Open the PowerTools.Common project
  1. Open the Client.cs file located in the CoreService folder
  1. Edit the Endpoint to your CMS URL with port number.  For example, var endpoint = new EndpointAddress("http://localhost:8080/WebServices/CoreService.svc/wsHttp_2010");

## Final step ##
[Clear your browser cache](ClearBrowserCache.md).

## Test ##
  1. Select a Folder and then choose the 'Count items' PowerTool.

# Moving an Installation #

If you have to move an existing setup, be sure to update the following:
  1. Cut and Paste your existing project folder (if copying, you may need to update folder permissions).
  1. Update the virtual directories in IIS to point to the new locations for the editor and model folders.
  1. Update the System.Config file with the new folder locations.
  1. Finally, optionally clean and build the solution in Visual Studio to update old references.

# Uninstall #
Use Windows Add/Remove programs to remove an installed version of PowerTools. To manually remove PowerTools, do the following:

  1. Edit %TRIDION\_HOME%\web\WebUI\WebRoot\Configuration\System.config (on default install it's C:\Program Files (x86)\Tridion\web\WebUI\WebRoot\Configuration)
    * Remove references to 

&lt;model name="PowerTools"&gt;

 and 

&lt;editor&gt;

 nodes. (This is enough to remove them from the CME)
  1. In IIS, remove the PowerTools folders under the CMS site > WebUI > Editors and Models.
  1. (Do the same for SiteEdit if installed since SiteEdit needs copies of extensions to work)
  1. Optionally remove permission or delete the source folders that IIS pointed to.
  1. Remove the dlls from "%TRIDION\_CM\_HOME%\Web\WebUI\WebRoot\bin" including:
    * The built dlls that start with PowerTools, along with...
    * Tridion.ContentManager.CoreService.Client.2010.dll
    * DocumentFormat.OpenXml.dll (from Stan's documenting tool)

It's always safer to rename and/or backup files instead of deleting.