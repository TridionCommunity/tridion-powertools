# Introduction #

When testing a PowerTool (or any GUI Extension), it is difficult to read JavaScript errors when the code comes minified.

Below you will find how to disable this behaviour. Thanks to [Frank van Puffelen](http://code.google.com/u/frank.vanpuffelen/) for this great tip.

# Details #

Edit yout System.config file, located in: $\Tridion\web\WebUI\WebRoot\Configuration

Modify the following node:
```
<filter for="Script" type="Tridion.Web.UI.Resources.Filters.JScriptMinifier, Tridion.Web.UI.Resources.Filters" enabled="always">
```

to

```
<filter for="Script" type="Tridion.Web.UI.Resources.Filters.JScriptMinifier, Tridion.Web.UI.Resources.Filters" enabled="never">
```