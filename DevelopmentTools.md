Add information about the tools you use to set up a Tridion environment, program for, and maintain the PowerTools.

# Introduction #

Tridion consultants and developers come from a variety of backgrounds and amount of experience. Even the most experienced programers may not use the same tools. This wiki page let's us share example tools, plugins, and related information to smooth out the development process.

We want more time to focus on requirements and code by making the tools part easy!

**Contents**


Add info for your fellow team members on SVN clients, VMs, IDEs, refactoring tools, and even UI shortcuts.

# Tools #
## Source ##
**SourceControl** [Tortoise](SourceControl#Tortoise.md) (Explorer-based) or [ankhsvn](SourceControl#ankhsvn.md) (Visual Studio) for ways to connect to the SVN-based source
  * We can edit wiki pages "offline" (Suggestion by Dominic)
  * Tip: as a general "good practice" do not put your project files on your Desktop or other "special" user folders; these have restricted permissions that the the CMS may not have access to (thanks Hao for the tip).

## Refactoring Tools ##
Refactoring is a method of cleaning up code for readability without changing functionality. Regression tests help confirm refactored code is functionality equivalent. Refactor to fix "smelly code."
  * **ReSharper** (preferred) for refactoring (community license for the [full version](http://www.jetbrains.com/resharper/download/index.html) approved, contact a team member for the key)
  * Others
    * [Refactor plug-in for Visual Studio](http://msdn.microsoft.com/en-us/visualc/bb737896)
    * CodeRush free tool (suggestion by Mihai)

## Diagraming and Requirements ##
  * Visio for diagrams
  * [Web Sequence Diagrams site](http://www.websequencediagrams.com/)
  * [Chrome-based wireframe tools](https://chrome.google.com/webstore/search/wireframe) (Chrome Web Store search)

## Communication ##
  * IRC http://webchat.freenode.net/ channel #tridion<br />IRC may be quiet now, but may be useful for joint development sessions or as a community (old skool) "hang out;" use the forum, wiki, or group Skype for now. Email a lead to get invited to the Skype chat.

## Builds ##
  * Build scripts such as Maven and NANT (Mihai's volunteered to create a build script)

## Microsoft Stack of Development Tools ##
  * **Visual Studio**
  * **Internet Information Services (IIS)** may be unfamiliar for developers used to working on the code-side of Web development. Access it by running `inetmgr` on the CME server. Use IIS to create the virtual directories for the PowerTools editor and model folders in the [nononsenseguide](nononsenseguide.md).

## Browsers ##
  * The CME is very dependent on browser cache. Tip to clear cache in Chrome: CTRL-Shift-DEL.
  * You can also disable Firefox cache by writing "about:config" in the address bar and setting network.http.use-cache to false.

## Frameworks and Languages ##
Some topics you might want to learn about or share your expertise in.

  * JavaScript, JQuery, Anguilla...
  * ASP.NET
  * Model View Controller (MVC)...
    * On virtual directories: In IIS under WebUI\Models and WebUI\Editors, both should have a virutal directory called CME under them.
  * About GUI extensions for Tridion 2011
  * Tridion 2011 SP1 delta info

# Testing and Troubleshooting #
  * How to [Deactivate JS Minifier](DeactivateJSMinifier.md) to troubleshoot JavaScript
  * Also see [Testing](Testing.md) page.
  * Unclear error? Visit http://localhost/WebUI/Editors/CME/Views/Dashboard/Dashboard_v6.0.0.39607.6_.aspx?mode=js on your CMS environment to see the details.
  * Quick deactivate .bat script (backup original system.config before using!). If you need to see your CME without the PowerTools, create a .bat file with the following and run it as an administrator. It simply moves a file called "SystemPower.config" to a temp file, swaps out the existing config, and moves the temp back to the System.config file.

```
REM Info on path checking: http://support.microsoft.com/kb/121170

IF "%TRIDION_HOME%" == "" GOTO NOPATH
	:PATH FOUND
   @ECHO The TRIDION_HOME environment variable was detected.
   PATH=%TRIDION_HOME%
   GOTO COPY
   :NOPATH
   @ECHO The TRIDION_HOME environment variable was NOT detected. No changes will be made.
   GOTO END
   :COPY
   REM test for temp file!
   CD %PATH%\web\WebUI\WebRoot\Configuration
   MOVE "SystemPower.config" "Config_temp.config"
   MOVE "System.config" "SystemPower.config"
   MOVE "Config_temp.config" "System.config"
   :END

PAUSE	
```