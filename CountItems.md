# Introduction #
This tool was originally created by Quirijn Slings (back in [R5](https://code.google.com/p/tridion-2011-power-tools/source/detail?r=5).2? times). For T2011, it was written originally by Mihai Cadariu (Oct 2011).

A great little tool to learn the T2011 GUI Extension mechanism, .NET WCF service contepts, JQuery, web-methods, PowerTools framework project.

![https://tridion-2011-power-tools.googlecode.com/svn/wiki/images/CountItems.png](https://tridion-2011-power-tools.googlecode.com/svn/wiki/images/CountItems.png)

**Difficulty:** easy/medium depending on skills.

# Details #

## Description ##

Currently the tool follows the GUI Extension mechanism:

  * Ribbon button and context menu activated on Publication, Folder, Structure Group, Category Manager and Category items.

  * Displays popup that allows user to select the item types to count items for. Currently the tool can count items for Folders, Components, Schemas, Component Templates, Page Templates, Template Building Blocks, Structure Groups, Pages, Categories and Keywords.

  * Call to 'count' invokes WCF service that performs the actual count. Only the selected item types are searched for by calling the Core Service API GetListXml.

  * The service returns a data object in JSon format, with the counts for each item type. Each count are obtained by calling repeatedly XmlElement's method SelectNodes and then retrieving the .Count property.

  * The data object is used in the popup to display the count next to each selected item type.

## Audience ##
Admins and Power Users

**Version #**
1.1

Original release date
23 Oct 2011

Last updated
23 Oct 2011

**Contributor(s)**

Mihai Cadariu

**Document Author(s)**

Mihai Cadariu

## Purpose ##

Need to be able to give counts on the number of various items in the TCM. The tool allows to specify the scope of the search (Oragnizational Item to count items underneath) and granularity of item types (breaks down the counts for different selectable item types).