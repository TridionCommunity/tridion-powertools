"Not all SDL Tridion GUI extensions are PowerTools." -- SDL Buddy

# Introduction #

To clarify what tools are "done," we collect thoughts and plans on potential tools here. Move your tool to the [Requirements](Requirements.md) index when it's in development or ready for release.

# Details #

## New Suggestions ##
  * ComponentPublisher, (search helps replace functionality, but component publisher useful for Tridion folder publish)
  * FieldContentCopier
  * UnlocalizeChildren (based on URI)
  * [XMLFieldRenamer](XMLFieldRenamer.md) (see [discussion](http://groups.google.com/group/tridion-powertools/browse_thread/thread/b641aa78f181da63))
  * Copy WebDAVUrl to clipboard (This is more difficult than for old-skool GUI extensions, as we can no longer assume IE as the browser, and security restrictions on access to the clipboard pretty much make every design a kludge) Could also form part of a "Developer toolbar". (Further suggestions for developer toolbar, anyone? -- Get XPath!)
  * ReportGenerator to be able to output the results of CME functionality. (e.g. output a "where used" or search results to .csv or show in copy-friendly HTML view)
  * MultiItemWhereUsed - Checks Where Used for all items in a specific folder or keywords in a category(maybe). Would need to be used with care or paged, could have a recursive option to check sub folders or not)

Not all extensions are PowerTools, but with other extension work needing similar setups (and being developed by the same community), it makes sense to collect "PowerTool candidates" here. Feel free to add and update suggestions here.

  * Chris Summers brainstormed an idea with the Skype group for a micro-site publisher functionality that would take a zip file possibly from a third-party and publish it out to a site. This could be done via variants, treating the zip as a multimedia component but alternatives exist.
  * Julian demo'ed this to a client using Dreamweaver as the entry point. The scenario works well as a technical way of getting a microsite imported and published. If the DW import API could be utilized :)

## Old List ##
In October 2011, the SDL Tridion MVPs planned the following for the PowerTools reboot. Each item links to its requirements page. For the full list, see the [deprecated Spreadsheet](http://code.google.com/p/tridion-2011-power-tools/downloads/detail?name=PowerTools2011Matrix_Prioritized_v01.xlsx&can=4&q=#makechanges) and unhide all rows.

See [Requirements](Requirements.md) for the official list or the PowerTools wiki page for links to the original source code (you'll need an [R5](https://code.google.com/p/tridion-2011-power-tools/source/detail?r=5).3 or 2009 environment to try the old versions).

<a href='Hidden comment: 
hint: each row has 9 fields, use a tr to wrap 9 td"s
<tr>
<td>{name}

Unknown end tag for &lt;/td&gt;


<td>{description}

Unknown end tag for &lt;/td&gt;


<td>{audience}

Unknown end tag for &lt;/td&gt;


<td>{CME location}

Unknown end tag for &lt;/td&gt;


<td>{author or idea from}

Unknown end tag for &lt;/td&gt;


<td>{priority}

Unknown end tag for &lt;/td&gt;


<td>{difficulty}

Unknown end tag for &lt;/td&gt;


<td>{status}

Unknown end tag for &lt;/td&gt;


<td>{notes}

Unknown end tag for &lt;/td&gt;




Unknown end tag for &lt;/tr&gt;


'></a>

<table border='1'>

<blockquote><tr>
<blockquote><th>Name</th></blockquote></blockquote>

<blockquote><th>Description</th></blockquote>

<blockquote><th>Audience</th></blockquote>

<blockquote><th>Suggested implementation</th></blockquote>

<blockquote><th>Original Developer</th></blockquote>

<blockquote><th>Priority</th></blockquote>

<blockquote><th>Difficulty</th></blockquote>

<blockquote><th>Status</th></blockquote>

<blockquote><th>Notes</th>
</blockquote><blockquote></tr></blockquote>

<blockquote><tr>
<blockquote><td>ComponentSynchronizer</td></blockquote></blockquote>

<blockquote><td>For all components based on the chosen schema, default a field to a certain<br>
value. If you leave the overrule checkbox unchecked, then current values are not<br>
overwritten, ...</td></blockquote>

<blockquote><td>Power User</td></blockquote>

<blockquote><td>Context Menu on Schema</td></blockquote>

<blockquote><td>Willem-Jan van den Bichelaer &amp; Quirijn Slings</td></blockquote>

<blockquote><td>Highest priority</td></blockquote>

<blockquote><td>Hard</td></blockquote>

<blockquote><td></td></blockquote>

<blockquote><td>Let's start with the hardest, most useful tool (utility is subjective, but at least two or more have asked for this and PagePublisher</td>
</blockquote><blockquote></tr></blockquote>

<blockquote><tr>
<blockquote><td>PagePublisher</td></blockquote></blockquote>

<blockquote><td>Publish pages, separately, track status</td></blockquote>

<blockquote><td>All / Mihai</td></blockquote>

<blockquote><td>Context Menu on folders</td></blockquote>

<blockquote><td></td></blockquote>

<blockquote><td>First</td></blockquote>

<blockquote><td>Medium</td></blockquote>

<blockquote><td>We have volunteers</td></blockquote>

<blockquote><td>Assumed not needed because of search functionality, but PagePublisher is<br>
more than that</td>
</blockquote><blockquote></tr></blockquote>

<blockquote><tr>
<blockquote><td>CountItems</td></blockquote></blockquote>

<blockquote><td>Count items in a publication, folder or structure group</td></blockquote>

<blockquote><td>All</td></blockquote>

<blockquote><td>Context Menu on OrgItems</td></blockquote>

<blockquote><td>Quirijn Slings</td></blockquote>

<blockquote><td>High</td></blockquote>

<blockquote><td>Easy</td></blockquote>

<blockquote><td>Complete</td></blockquote>

<blockquote><td>Needed more than ever as this is missing from the GUI</td>
</blockquote><blockquote></tr></blockquote>

<blockquote><tr>
<blockquote><td>AppDataInspector</td></blockquote></blockquote>

<blockquote><td>Allows admins to inspect AppData on pretty much any Tridion item</td></blockquote>

<blockquote><td>Admin</td></blockquote>

<blockquote><td>Tab in all views and popup accessed from Context Menu on all items and from Ribbon Button</td></blockquote>

<blockquote><td>Mihai Cadariu</td></blockquote>

<blockquote><td>Normal</td></blockquote>

<blockquote><td>Easy</td></blockquote>

<blockquote><td>Complete</td></blockquote>

<blockquote><td></td>
</blockquote><blockquote></tr></blockquote>


<blockquote><tr>
<blockquote><td>AddUser</td></blockquote></blockquote>

<blockquote><td>Add a user directly (from a domain or directory service)</td></blockquote>

<blockquote><td>Power User</td></blockquote>

<blockquote><td>Added to existin add user screen</td></blockquote>

<blockquote><td>Quirijn Slings</td></blockquote>

<blockquote><td>High</td></blockquote>

<blockquote><td>Easy</td></blockquote>

<blockquote><td>Complete</td></blockquote>

<blockquote><td>Created by Tory</td>
</blockquote><blockquote></tr></blockquote>

<blockquote><tr>
<blockquote><td>ShowLists</td></blockquote></blockquote>

<blockquote><td>Shows the output of different Tridion XML Lists, with column and row<br>
filters</td></blockquote>

<blockquote><td>Developer</td></blockquote>

<blockquote><td>PowerTool Button on Ribbon</td></blockquote>

<blockquote><td>Nuno Linhares</td></blockquote>

<blockquote><td>Medium</td></blockquote>

<blockquote><td>Easy</td></blockquote>

<blockquote><td></td></blockquote>

<blockquote><td></td>
</blockquote><blockquote></tr></blockquote>

<blockquote><tr>
<blockquote><td><a href='Overview.md'>Overview</a></td></blockquote></blockquote>

<blockquote><td>Gives an overview of several items in a publication</td></blockquote>

<blockquote><td>Power User</td></blockquote>

<blockquote><td>Context menu on publication</td></blockquote>

<blockquote><td>Quirijn Slings</td></blockquote>

<blockquote><td>High</td></blockquote>

<blockquote><td>Medium</td></blockquote>

<blockquote><td></td></blockquote>

<blockquote><td></td>
</blockquote><blockquote></tr></blockquote>

<blockquote><tr>
<blockquote><td>ComponentUnpublisher</td></blockquote></blockquote>

<blockquote><td>Resets the Published status of every Component in a publication to Not<br>
Published.</td></blockquote>

<blockquote><td>Admin.</td></blockquote>

<blockquote><td>Context menu on publication</td></blockquote>

<blockquote><td>Will Price</td></blockquote>

<blockquote><td>High</td></blockquote>

<blockquote><td>Medium</td></blockquote>

<blockquote><td></td></blockquote>

<blockquote><td>Useful for broken or removed publication targets</td>
</blockquote><blockquote></tr></blockquote>

<blockquote><tr>
<blockquote><td>PageUnpublisher</td></blockquote></blockquote>

<blockquote><td>Resets the Published status of every Page in a publication to Not<br>
Published.</td></blockquote>

<blockquote><td>Admin.</td></blockquote>

<blockquote><td>Context menu on publication</td></blockquote>

<blockquote><td>Nuno Linhares</td></blockquote>

<blockquote><td>High</td></blockquote>

<blockquote><td>Medium</td></blockquote>

<blockquote><td></td></blockquote>

<blockquote><td></td>
</blockquote><blockquote></tr></blockquote>

<blockquote><tr>
<blockquote><td>SchemaTemplateRelationships</td></blockquote></blockquote>

<blockquote><td>Shows the relationships between schemas and component templates, and allows<br>
you to change these relationships.</td></blockquote>

<blockquote><td>Power User</td></blockquote>

<blockquote><td>Context menu on publication</td></blockquote>

<blockquote><td>Quirijn Slings</td></blockquote>

<blockquote><td>Medium</td></blockquote>

<blockquote><td>Medium</td></blockquote>

<blockquote><td></td></blockquote>

<blockquote><td>Updates don't seem to work</td>
</blockquote><blockquote></tr></blockquote>

<blockquote><tr>
<blockquote><td>XMLViewerXPathSearcher</td></blockquote></blockquote>

<blockquote><td>Shows the xml of a Tridion item, and allows you to search it using<br>
xpath</td></blockquote>

<blockquote><td>Developer</td></blockquote>

<blockquote><td>Context Menu on all items and orgitems</td></blockquote>

<blockquote><td>Jean-Baptiste Minchelli</td></blockquote>

<blockquote><td>Medium</td></blockquote>

<blockquote><td>Medium</td></blockquote>

<blockquote><td></td></blockquote>

<blockquote><td>Yoav made a working prototype</td>
</blockquote><blockquote></tr></blockquote>

<blockquote><tr>
<blockquote><td>AccessExplorer</td></blockquote></blockquote>

<blockquote><td>Show permissions on folders and structure groups</td></blockquote>

<blockquote><td>Power User</td></blockquote>

<blockquote><td>Context Menu on all items and orgitems</td></blockquote>

<blockquote><td>Quirijn Slings</td></blockquote>

<blockquote><td>Medium</td></blockquote>

<blockquote><td>Medium</td></blockquote>

<blockquote><td></td></blockquote>

<blockquote><td></td>
</blockquote><blockquote></tr></blockquote>

<blockquote><tr>
<blockquote><td>SchemaFieldRemover</td></blockquote></blockquote>

<blockquote><td>Safely remove a field from a schema. The tool warns you if any components<br>
have a value for the field</td></blockquote>

<blockquote><td>Admin.</td></blockquote>

<blockquote><td>Context Menu on Schema</td></blockquote>

<blockquote><td>Quirijn Slings</td></blockquote>

<blockquote><td>Medium</td></blockquote>

<blockquote><td>Medium</td></blockquote>

<blockquote><td></td></blockquote>

<blockquote><td></td>
</blockquote><blockquote></tr></blockquote>

<blockquote><tr>
<blockquote><td>AccessPermissionsManager</td></blockquote></blockquote>

<blockquote><td>Show/Set permissions on folders and structure groups for multiple<br>
groups</td></blockquote>

<blockquote><td>Power User</td></blockquote>

<blockquote><td>Context Menu on OrgItems</td></blockquote>

<blockquote><td>James English</td></blockquote>

<blockquote><td>High</td></blockquote>

<blockquote><td>Hard</td></blockquote>

<blockquote><td></td></blockquote>

<blockquote><td>See "System" below for access explorer</td>
</blockquote><blockquote></tr></blockquote>



<blockquote><tr>
<blockquote><td>QuickSearchReplace</td></blockquote></blockquote>

<blockquote><td>Search and replace XML of components. Warning: this tool can damage your<br>
content if you don't know what you're doing!</td></blockquote>

<blockquote><td>Power User</td></blockquote>

<blockquote><td>Context menu on schema</td></blockquote>

<blockquote><td>Quirijn Slings</td></blockquote>

<blockquote><td>Medium</td></blockquote>

<blockquote><td>Hard</td></blockquote>

<blockquote><td></td></blockquote>

<blockquote><td>Not sure on this one</td>
</blockquote><blockquote></tr></blockquote>

<blockquote><tr>
<blockquote><td>AccessRightsManager</td></blockquote></blockquote>

<blockquote><td>Show access rights on groups for all publications, and change them</td></blockquote>

<blockquote><td>Admin.</td></blockquote>

<blockquote><td></td></blockquote>

<blockquote><td>James English</td></blockquote>

<blockquote><td>Medium</td></blockquote>

<blockquote><td>Hard</td></blockquote>

<blockquote><td></td></blockquote>

<blockquote><td></td>
</blockquote><blockquote></tr></blockquote>


</table>