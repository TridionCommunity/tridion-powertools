# Introduction #

Good practices and considerations for creating look-and-feel, flow, and design for the PowerTools.

Let's confirm our design guidelines to help create a well-integrated end-user experience, especially considering our variety of development and system backgrounds.

### General Guiding Principle ###

> When in doubt, follow an existing behavior for a similar item or functionality in the CME.

## Branding (Disclaimers, Credit, and Banner) ##

We'll want the PowerTools to blend-in with the CME, but still be distinguishable and manageable as an extension. Nuno suggested the idea of a standard banner in PowerTool dialogue boxes, but we can consider other ways to "brand" the set of tools.

We should also identify standard ways to add disclaimers and credit to those that worked on each tool and the overall framework. But as a "thank you" reward for your efforts and to help clarify what's _extended_ functionality.

## Ribbon Buttons ##

Not all extensions and PowerTools need to have a top-navigation Ribbon Button and physical aspx page. If a button in the Ribbon is appropriate, consider grouping the PowerTool with similar tools based on permissions.

For example, we may have separate sets of tools for general end users, Power Users, Developers, and System Administrators.

## Context-Menu (right-click) ##

Tridion makes several single-item actions available through the context-menu. This include versioning, history, localization, publishing, and copying/pasting.

A PowerTool that targets one or more selected items could benefit from being placed in the context-menu.

## Tree versus List Behavior ##
Tree means left-side navigation whereas list refers to the main area (what's a better term?)

  1. Most Ribbon Toolbar buttons affect items selected in the list
  1. However, content creation buttons work on the organization item (folder or structure group) selected in the tree

This follows a familiar pattern in Windows Explorer.

  1. Open Explorer and select an item in the list. Creating a new folder with add an additional (sibling) item regardless of what item is selected.
  1. However, select an item in the "tree" (such as My Documents), creating a new folder will create an item _inside_ of that organization item.

The distinction is subtle, but worth following. When in doubt refer to the CME and keep in mind the same items may have different behaviors based on context.

## No GUI ##

Are there situations where a PowerTool wouldn't be in the [CME](Definitions#Content_Management_Editor.md)?