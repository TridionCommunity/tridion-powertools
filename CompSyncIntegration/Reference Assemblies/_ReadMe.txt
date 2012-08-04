Use this folder to place DLLs and resources referenced from the PowerTools projects.

For legal reasons, do NOT add Tridion product DLLs to SVN. Instead, keep a local copy of
the file in the folder. Perhaps also add the file in question to the svn ignore list (by name).

Current contents of this folder (needed by projects, and added to svn ignore list):

- Tridion.Web.UI.Core.dll
- DocumentFormat.OpenXml.dll
- Tridion.ContentManager.CoreService.Client.dll (2011 SP1 version)

On a vanilla installation of the Content Manager, these DLLs can be found in the following locations:

"C:\Program Files (x86)\Tridion\web\WebUI\WebRoot\bin"
"C:\Program Files (x86)\Tridion\bin\client"
