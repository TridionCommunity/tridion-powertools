# Template #
Let's formalize testing requirements on a TestingTemplate. It could serve as the necessary steps to release a tool.

# Functional #
CME functionality is driven by context. Some things to test within the GUI include:
  * Main list view
    * Context menu in list
  * Tree view
    * Context menu on tree view
  * Pop-up selection dialogue
    * Context menus on pop-up tree view
    * Context menu in pop-up main list
  * Organizational items (folders) seen above but also virtual folders
  * Custom folders, favorites

Basically you'll want your tool to be visible where appropriate, not visible where not appropriate, and if possible "grayed out" if it should be available in that specific context, but not selectable for whatever reason.

# Tools #

Vesa mentioned:
  * Unit Test Suite (Beside their obvious function tests are also the
best documentation for developers)
> > NUnit is the most popular choice between collaborators and one of the most widely known.
  * NAnt/Maven script (Could work as a sort of an installer)

Dominic mentioned [Selenium](http://seleniumhq.org/) for front-end testing. These create JavaScript-powered client side testing scripts that we could  re-use and possibly share to walk through a browser such as the CME.

Please update, change, and add ideas...