

# Introduction #
The following is a modified version of the coding guidelines that were used during development of the (client-side) 2011 CME and its underlying core framework.

Use them to guide your PowerTools and other extension development.

# JavaScript and HTML guidelines #

## Code organization ##

  * Use a separate file for each class you write.
  * Name a file after the class it defines (excluding the namespace).
    * For instance ''Control.js'' for a file containing a definition of ''Tridion.Control'' class.

## Namespaces ##

  * Use namespace prefixes for the classes you write.
  * Include namespace definition at the top of the file that uses that namespace. _Type.registerNamespace_ ensures that a namespace prefix exists before you attempt to use it.
  * Namespaces should use Pascal Case
```
Type.registerNamespace("Tridion.MessageCenter");
```

## Functions ##

  * Name every function. This enables the stack trace to display actual names for function calls, instead of a series of anonymous() calls, which is a great help during debugging.
  * Use camel-case for all function names and arguments. This includes get and set functions.

```
this.methodName = function Class$methodName(paramName)
{
	...
}
```
  * ''id'' in function names should be capitalized like ''Id'', not ''ID''. For instance: ''getId()''
  * Functions that are used as callback functions or event handlers should be named using the following format: on[''Object''][''Event''], where ''Object'' is a name that identifies an object. For instance, _onButtonClick()_ or _onPageLoad()_.
  * Functions do not need a _return_ statement at the end if they do not return a value.
  * All function definitions should have a semicolon at the end
  * 
```
function thisFunctionName() 
{ 
   ... 
};
```

This is to prevent problems when the next statement is started with an opening parenthesis, for example the following code will generate an error:

```
MyClass = function () {}

(function()
{
	var item = new MyClass();
})();
```
> , while the following code will run fine:
```
MyClass = function () {};

(function()
{
	var item = new MyClass();
})();
```

## Constants ##

All constant names should be in UPPERCASE ```

Tridion.Constants.PublishPriority =
{
LOW : 2,
NORMAL : 4,
HIGH : 6
};
```

## Variables ##

  * Avoid global variables
  * All global variables should be under a Tridion.`*` namespace
  * Use camel-case for local variables, object properties, and function arguments.<br></li></ul>

Usage: <pre><code><br>
var variableName = "";<br>
var otherVariableName = false;<br>
</code></pre> <br>

  * Have a single ''var'' definitions for a local variable:

WRONG: ```

function func(flag)
{
if (flag)
{
var result = true;
}
else
{
var result = false;
}
return result;
}
``` RIGHT: ```

function func(flag)
{
var result;
if (flag)
{
result = true;
}
else
{
result = false;
}
return result;
}
```

## Classes/Objects ##

  * Classes (constructors) should use Pascal Case
  * All properties used by the class should be explicitly listed and initialized in the constructor, even if the initialization value is ''undefined''
  * ''Private'' methods (methods that are intended for internal use by the class itself and should not be considered as part of the API of the class) should start with an underscore character:

```

function ClassA()
{
}

ClassA.prototype.public = function ClassA$public()
{
}

ClassA.prototype._private= function ClassA$_private()
{
}
```

  * When creating a class constructor prefereably use ''prototype'' object to define methods of the class. If a single instance of the class is going to be created at a time (i.e. a singleton pattern), closures may be used as well

Using ''prototype'': ```

function ClassA()
{
}

ClassA.prototype.method1 = function ClassA$method1()
{
}
``` Using closures: ```

function ClassA()
{
this.method1 = function ClassA$method1()
{
}
}
```

  * When defining objects using a shorthand notation, unlike defined by JSON format, the properties of the objects will not be in quotes. The quotes are allowed if required in case of special characters.<br></li></ul>

The use of reserved words is not permitted.<br>

```

var o = { type: "button", action: "textbutton", text: "Text Button", "composite.property": false };
```

## Code formatting ##

  * Group related code lines together; or in other words, separate different things in code with a blank line.
  * Add an empty line after each function definition
  * Use tabs for indenting and spaces for formatting
  * Tabs use a single character and can be configured differently on each developer’s machine, according to his or her preference.
  * When formatting code, it is important to keep in mind that because the amount of spaces a tab takes is relative, certain formatting can look ‘wrong’ in another developers editor.

WRONG: ```

// you format your code to align nicely using 4-space tabs:
var item          = "Item 1";
var x             = "Item 015";
var somethingElse = "Item 46";
var blue          = "45";
var red           = "177";
```

WRONG: ```

// another developer that uses 2-spaces tabs opens the file and sees this:
var item          = "Item 1";
var x       = "Item 015";
var somethingElse = "Item 46";
var blue       = "45";
var red        = "177";
```

RIGHT: ```

var item = "Item 1";
var x = "Item 015";
var somethingElse = "Item 46";
var blue = "45";
var red = "177";
```

  * Spell out your intention clearly, rather then to compress logic in 'smart' statements:

WRONG: ```

x().doStuff(x != 1 ? true : false, y != 2);
``` BETTER: ```

var instance = x();
var useGreen = x != 1 ? true : false;
var usePurple = y != 2;
instance.doStuff(useGreen, usePurple);
```

  * Space before and after each binary and ternary operator ( =, +, -, `<`, `>`, `*`, /, ? :, etc.)

```

var x = 10;
x += 2;
y = x % 2 == 0 ? 10 : 30;
```
No space before semicolon: ```

fox.jump();
u = w / 4;
```
No space around unary operators: ```

y++;
```
No space after an opening and before a closing bracket: ```

x.subtract(45);
for (var name in colors) { ... }
t = y.substring(0, 10);
```
No space before, one space after a comma:
```

function Object$convert(value1, value2) { ... }
```

  * Have a space between if/for/while/do and an opening bracket.
  * Break long lines (longer than about 120 character positions) into shorter lines.
  * When breaking lines and specifying a number of arguments to a function add an extra TAB to indent the arguments:

#### Curly braces ####

Curly braces are required when defining a block of code (after statements such as for, while, do, if, etc.), even when the block consists of a single line. The braces must be on their own line, aligned with the statement that starts the block. ```

for (var i = 0; i < 10; i++)
{
a.push(i);
}
```

When defining an object on a single line curly braces may be on the same line, with a space after the opening brace and a space before the closing brace. ```

var o = { prop1: value1, prop2: value2 };
```

### Shorthand notations ###

Preferably use shorthand notations unless it reduces clarity of the code. For instance:

```

if (obj1)
{
res = obj1;
}
else
{
res = obj2;
}
```

Should be written as: ```

res = obj1 || obj2;
```

Whereas:
```

if (typeof(par) == "undefined" || par == null)
{
...
}
```

Will be more concise (and cover more cases of ''par'' being not an object) if written as: ```

if (!par)
{
...
}
```

## Code commenting ##
**The Pragmatic Programmer**, _Andrew Hunt, David Thomas_:
> [...] keep the low-level knowledge in the code, where it belongs, and reserve the comments for other, high-level explanations.
> Otherwise, we're duplicating knowledge, and every change means changing both the code and the comments.
> The comments will inevitably become out of date, and untrustworthy comments are worse than no comments at all.
> [...] Code should have comments, but too many comments can be just as bad as too few. In general, comments should discuss why something is done, its purpose and its goal. The code already shows how it is done, so commenting on this is redundant.

  * Document your functions using JDoc tags

```

```
/**
 * Provides the information about a list.
 * @param {List} listControl Reference to the list control that this definition is a part of.
 * @param {XmlDocument} definitionDoc An xml document that contains the definition of the list.
 */
Tridion.Controls.ListDefinition = function ListDefinition(listControl, definitionDoc)
{
  this.properties = {};
  /**
   * Holds the reference to the list control that this definition is a part of.
   * @type {Tridion.Controls.List}
   */
  this.properties.control = listControl;
}
```
```

  * Do not comment out code 'temporarily'. Those 'temporary' comments tend to outlive the employment of the developer who put them there. Just remove the code and put any information you want to pass on to the source control system when checking-in the changes.

## Validation/Error handling<br></h2>

  * Use methods defined in Types.js to check for the type of input arguments, return values, etc., instead of using _typeof(object)_
    * Type.isArray
    * Type.isDate
    * Type.isBoolean
    * Type.isNumber
    * ...

  * Always use assert methods to validate input parameters, for example: ```
$assert.isArray(par1)```
  * Do not use ```
throw Error("...")``` to throw errors. Use a specialized method for raising errors: ```
$assert.raiseError("...");```
  * Do not use alert() to show errors. Use a specialized method for logging/handling errors.
  * Avoid using alert() and confirm(). Implement wrappers for these and use them.

## Best practices ##

### Iterating ###

Performing lengthy operations in a loop is a typical source of performance problems.

When iterating through an array or a collection, store the upper bound of the list in a local variable instead of evaluating it after each iteration:

LESS OPTIMAL: ```

for (var i = 0; i < list.length; i++)
{
...
}
```

BETTER: ```

for (var i = 0, len = list.length; i < len; i++)
{
...
}
```

If an item is being accessed multiple times in an iteration, cache it in a local variable instead of resolving it several times using its index (which might be a very expensive operation)

LESS OPTIMAL: ```

```
for (var i = 0, len = list.length; i < len; i++)
{
    list[i].do1(...);
    list[i].do2(...);
}
```
```

BETTER: ```

```
for (var i = 0, len = list.length; i < len; i++)
{
    var item = list[i];
    item.do1(...);
    item.do2(...);
}
```
``` <br>

<h3>Node Lists</h3>

Accessing an element by an index in a long node list can be costly. Sometimes it can be optimized by using direct node references.<br>
<br>
Consider the following example that loops through all child nodes of an element and adds them to an array: <pre><code><br>
&lt;pre&gt;&lt;code&gt;var a = [];<br>
var nodes = xmlNode.childNodes;<br>
var length = nodes.length;<br>
for (var i=0; i &lt; length; i++)<br>
      {<br>
            a.push(nodes[i]);<br>
      }<br>
</code></pre>
</code></pre> Alternatively it can be rewritten like this: <pre><code><br>
&lt;pre&gt;&lt;code&gt;var a = [];<br>
var node = xmlNode.firstChild;<br>
if (node)<br>
{<br>
    do<br>
    {<br>
        a.push(node);<br>
        node = node.nextSibling;<br>
    }<br>
    while(node);<br>
}<br>
</code></pre>
</code></pre>

On 10,000 items in IE the latter version is about 10 times faster. In FireFox the difference isn’t that big, about 10%. IE simply couldn’t handle 100,000 items when using an index, but when using nextSibling it outperformed FireFox by 3.5 times.<br>
<br>
<br>
<br>
<h3>Local variables</h3>

Local variables are considerably faster in access then object properties. When the same property is being accessed multiple times, it makes sense to have it in a local variable. <pre><code><br>
function()<br>
{<br>
var p = this.properties;<br>
p.prop1 = ...;<br>
p.prop2 = ...;<br>
}<br>
</code></pre>

It is even faster to cache a ''document'' object in a local variable and use that, if it is being accessed many times. It's because ''document'' is in fact a property of a ''window'' object, thus is resolved using ''window.document'', which is slower than accessing a local variable.<br>
<br>
<h3>Redundant code</h3>

Avoid redundant code. For instance in the following snippet the initial initialization of a variable is not always needed: <pre><code><br>
&lt;pre&gt;&lt;code&gt;string ret = AppDomain.CurrentDomain.BaseDirectory;<br>
if (HttpContext.Current != null)<br>
{<br>
    ret = HttpContext.Current.Request.ApplicationPath;<br>
}<br>
</code></pre>
</code></pre>
A better code would be: <pre><code><br>
&lt;pre&gt;&lt;code&gt;string ret;<br>
if (HttpContext.Current != null)<br>
{<br>
    ret = HttpContext.Current.Request.ApplicationPath;<br>
}<br>
else<br>
{<br>
    ret = AppDomain.CurrentDomain.BaseDirectory<br>
}<br>
</code></pre>
</code></pre>

<h3>String manipulation</h3>

String concatenation is slow. In IE it's ridiculously slow. Keep in mind the possibility of pushing pieces of a string into an array and then calling <i>.join('')</i>.<br>
<br>
On a test machine the following code took some 690 milliseconds in FireFox and 490 milliseconds in Chrome with NUM=1000, and it took about 15 seconds in IE with NUM=200. It took several hours in IE with NUM=1000. <pre><code><br>
&lt;pre&gt;&lt;code&gt;var s = "&lt;table&gt;";<br>
for (var i = 0; i &lt; NUM; i++)<br>
{<br>
    s += "&lt;tr&gt;"<br>
    for (var j = 0; j &lt; NUM; j++)<br>
    {<br>
        s += "&lt;td&gt;X&lt;/td&gt;"<br>
    }<br>
    s += "&lt;/tr&gt;"<br>
}<br>
s += "&lt;/table&gt;";<br>
</code></pre>
</code></pre>

The following code was slightly slower in FF (720 milliseconds with NUM=1000), faster in Chrome (310 milliseconds with NUM=1000), and considerably faster in IE (170 milliseconds with NUM=200, and 4.4 seconds with NUM=1000) <pre><code><br>
&lt;pre&gt;&lt;code&gt;var a = ["&lt;table&gt;"];<br>
for (var i = 0; i &lt; NUM; i++)<br>
{<br>
	a.push("&lt;tr&gt;");<br>
	for (var j = 0; j &lt; NUM; j++)<br>
	{<br>
		a.push("&lt;td&gt;X&lt;/td&gt;")<br>
	}<br>
	a.push("&lt;/tr&gt;");<br>
}<br>
a.push("&lt;/table&gt;");<br>
s = a.join("");<br>
</code></pre>
</code></pre>

For comparison, the code below (though difficult to understand but doing the same task) took about 400 milliseconds in FF, 15 milliseconds in Chrome, and 140 milliseconds in IE (all with NUM=1000). <pre><code><br>
&lt;pre&gt;&lt;code&gt;var a = new Array(NUM+1);<br>
var s1 = "&lt;tr&gt;" + a.join("&lt;td&gt;X&lt;/td&gt;", "") + "&lt;/tr&gt;";<br>
var s = "&lt;table&gt;" + a.join(s1, "") + "&lt;/table&gt;";<br>
</code></pre>
</code></pre>

<h3>Browser detection vs. Object detection</h3>

Avoid doing browser detection for determining which method to call. Use DOM method detection instead.<br>
<br>
WRONG: <pre><code><br>
&lt;pre&gt;&lt;code&gt;if ($dom.isIE)<br>
{<br>
	return elem.ownerDocument.parentWindow;<br>
}<br>
else<br>
{<br>
	return elem.ownerDocument.defaultView;<br>
}<br>
</code></pre>
</code></pre> RIGHT: <pre><code><br>
&lt;pre&gt;&lt;code&gt;if (elem.ownerDocument.parentWindow)<br>
{<br>
	return elem.ownerDocument.parentWindow;<br>
}<br>
else<br>
{<br>
	return elem.ownerDocument.defaultView;<br>
}<br>
</code></pre>
</code></pre>
or a shorter version: <pre><code><br>
&lt;pre&gt;&lt;code&gt;return elem.ownerDocument.parentWindow || elem.ownerDocument.defaultView;<br>
</code></pre>
</code></pre>

This code will support any possible non-IE browsers that implement <i>.parentWindow</i> property.<br>
<br>
Browser detection should be used only when working around known problems/bugs with specific browsers or in the case of inconsistent behavior of the same method in different browsers.<br>
<br>
<h2>Using Domain Model</h2>

<ul><li>Do not cache objects that implement ''Tridion.MarshallableObject'' in member variables. This is because a marshallable object can be moved to another instance, thus invalidating the previous reference.</li></ul>

Use <i>Tridion.ContentManager.Model.getItem(id)</i> to get the reference when it's needed.<br>
<br>
WRONG: <pre><code><br>
&lt;pre&gt;&lt;code&gt;var page = Tridion.ContentManager.Model.getItem("tcm:1-2-64");<br>
function checkIn()<br>
{<br>
   page.checkIn();<br>
}<br>
</code></pre>
</code></pre> RIGHT: <pre><code><br>
&lt;pre&gt;&lt;code&gt;function checkIn()<br>
{<br>
   var page = Tridion.ContentManager.Model.getItem("tcm:1-2-64");<br>
   page.checkIn();<br>
}<br>
</code></pre>
</code></pre>

<ul><li>Avoid using and manipulating internal properties and xml of items in the domain model. Always use the API provided by the model. If access to some functionality is missing from the API it's not an excuse to have hardcoded xpath strings in your code, but a good reason to extend the API.</li></ul>

<h1>HTML/ASPX</h1>

<ul><li>Within the html document, you need to declare the DOCTYPE set to ‘transitional’<br>
<pre><code><br>
&lt;pre&gt;&lt;code&gt;&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;<br>
</code></pre>
</code></pre>
</li><li>All aspx page must have <pre><code>xmlns:c="http://www.sdltridion.com/web/ui/controls"</code></pre> defined, as some of our controls use custom client-side attributes with "c" prefix.<br>
</li><li>Use lowercase ''id'' attribute name for client side HTML elements<br>
</li><li>Use uppercase ''ID'' attribute name for server side ASP.NET controls<br>
</li><li>Specify ''id'' and ''ID'' only when necessary and use meaningful values (make sure to remove ID's that are auto-generated by Visual Studio).</li></ul>


<h1>CSS</h1>

<h2>Targeting Specific Browsers</h2>

To support browser specific styles, the core adds one or more a classes to the document's HTML element to identify the browser.<br>
<br>
For example, when using Internet Explorer 7, the classes <i>ie</i> and <i>ie7</i> are set on the HTML element. Therefore, any CSS properties that should be set only for Internet Explorer should use <i>.ie</i> before any other selectors. For example:<br>
<pre><code><br>
.ie input<br>
{<br>
outline: none;<br>
}<br>
</code></pre>

The browser-specific classes added to the HTML element are:<br>
<ul><li>Internet Explorer 7: ie and ie7<br>
</li><li>Internet Explorer 8: ie<br>
</li><li>Firefox: gecko<br>
</li><li>Chrome and Safari: webkit</li></ul>

<h2>Code Guidelines</h2>

The following fragment illustrates the coding style to be used for CSS. Note that to improve legibility each property should appear on a separate line.<br>
<pre><code><br>
&lt;pre&gt;&lt;code&gt;.dropdown .arrow<br>
{<br>
   min-height: 14px;<br>
   min-width: 14px;<br>
   background-image: url(Images/Controls/Dropdown/down.png);<br>
   background-repeat: no-repeat;<br>
   padding: 0px;<br>
   margin: 0px;<br>
}<br>
</code></pre>
</code></pre>