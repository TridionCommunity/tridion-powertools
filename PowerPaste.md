# Introduction #

This tool is currently _not_ in progress.

The out-of-the-box Paste Special button does not work with Chrome due to browser restrictions on accessing the clipboard from Javascript, and it seems that a future Firefox version might also remove access to the clipboard.


![https://tridion-2011-power-tools.googlecode.com/svn/wiki/images/PowerPaste.png](https://tridion-2011-power-tools.googlecode.com/svn/wiki/images/PowerPaste.png)

# Details #

A better way to deal with cleaning up the content (the whole point of "Paste Special" would be to:

  1. "Power Paste" Button. Clicking on it opens a modal dialog with a resizable textbox, user is asked to use CTRL-V to paste the content in this textbox
  1. A couple of buttons in the dialog allow to modify the text inside it – remove markup, remove css, etc (same features as today)
  1. OK or Finished button takes this manipulated/cleaned up text and inserts it in the original field & cursor position
  1. Similar approach to work with Experience Manager (most of the dialog code should be the same)

Tridion Product Management has promised an iPad to the first developer to present this solution working for CME and Experience Manager