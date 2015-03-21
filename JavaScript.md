# Introduction #

New to JavaScript programming? Or have you been away so long and don't know how it connects with other technology, frameworks, and buzzwords (MVC, JQuery, Anguilla,etc).


# Chrome #
Debug JavaScript in Chrome.
  1. Open page or start pop-up.
  1. Use CTRL+SHIFT+I to open the Developer tools (CTRL+SHIFT+J to jump straight to the JavaScript console).
  1. Select a script from the top-left dropdown and set a breakpoint by right-clicking on the left-side numbered lines.
  1. Close the console (CTRL+W to close any Chrome tab/pop-up)
  1. Re-run the page or pop-up and press CTRL+SHIFT+I to trigger the breakpoint.

# Allow Breakpoints #
  * You can also place "debugger;" in your .js to create a breakpoint.
  * You'll need to set the stripdebugstatements attribute to "false" in:
> %TRIDION\_HOME%\web\WebUI\WebRoot\Configuration\System.config

Tip: Tough to read Anguilla's minified code? Check out [DeactivateJSMinifier](DeactivateJSMinifier.md)!