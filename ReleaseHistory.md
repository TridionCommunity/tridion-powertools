Build from [Source](http://code.google.com/p/tridion-2011-power-tools/source/checkout) or use the installer available under [downloads](http://code.google.com/p/tridion-2011-power-tools/downloads/list).

## Disclaimer ##
As a set of extensions without support from a commercial organization, the Tridion PowerTools extensions are released "as is" and user assumes all responsibility for their use.

### Open Source Project ###
The source code is open and developed, supported, and updated by a community of Tridion developers, consultants, partners, and customers.

# RC 1 #
(30-Jun-2012) The PowerTools extensions are ready for testing. Please test in a developer or test environment.

## Known issues and recommendations ##

  * Remove any manually-installed PowerTools before running the installer. Remove or comment-out your Model and Editor nodes in `%TRIDION_CM_HOME%\Web\WebUI\WebRoot\Configuration\System.config`.
  * Image uploader may delete source binaries in some cases. See [issue 35](https://code.google.com/p/tridion-2011-power-tools/issues/detail?id=35).
  * Item XML display spaces incorrectly. See [issue 32](https://code.google.com/p/tridion-2011-power-tools/issues/detail?id=32).
  * Clear browser cache or manually increment System.config "modification" setting. See [issue 25](https://code.google.com/p/tridion-2011-power-tools/issues/detail?id=25).
  * Count item results browser title sometimes shows "untitled." See [issue 29](https://code.google.com/p/tridion-2011-power-tools/issues/detail?id=29).
  * Progress bar doesn't work in Internet Explorer per [issue 6](https://code.google.com/p/tridion-2011-power-tools/issues/detail?id=6).
  * [See or report additional issues](http://code.google.com/p/tridion-2011-power-tools/issues/list).

If you have any problems, contact the PowerTools group:

  * In near real-time [on the FlowDock](https://powertools.flowdock.com/invitations/95cbb928d8bd132a537357de32d028f80722aa8a-main)
  * In the [discussion group](http://groups.google.com/forum/#!forum/tridion-powertools)
  * On Twitter #TridionPowerTools


---

(24-Oct-2011) CountItems v1.1 released.