# Introduction #
The beauty of source control is that we can collaborate and build on each other's work, but at the same time protect the project's history.

Using an open source control standard like Subversion (SVN) means you have a few options on how to manage versioning. See some suggestions below and feel free to comment on or build out these tutorials as needed.

# SVN Primer #

---

**See SVN Tutorial at http://svnbook.red-bean.com/.

---

## Tortoise SVN ##
  * Explorer, file-based shell integration with SVN
  * Get it at the [TortoiseSVN download page](http://tortoisesvn.net/downloads.html).**

## ankhsvn ##
  * Visual Studio integrated tool to connect to an SVN repository (like the PowerTools)
  * Can use with Tortoise SVN (ask Mihai or Angel) to pull updates directly into Visual Studio, but then do check-ins via the shell with Tortoise
Steps:
  1. Go to [the ankhsvn download page](http://ankhsvn.open.collab.net/downloads)
  1. Download the latest version and optionally create and account
  1. After install you should be able to connect to the source through Visual Studio under File > Open > Subversion Project
  1. Follow the [nunosenseguide](nononsenseguide.md) for what repository to open.
> Note for those used to TFS or doing single-user checkouts that lock files, multiple checkouts are allowed (think "updates"). You're not locking files or preventing work by checking out files. An explicit lock is required to do so.

# Other Windows-Based SVN clients #
SmartSVN (recommended by Peter)
http://subversion.apache.org/packages.html#windows