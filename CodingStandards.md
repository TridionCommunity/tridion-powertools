Use existing guidelines, Clean Code by "Uncle Bob" Martin, and the appropriate frameworks/languages (Anguilla, MSDN's suggestions for C#, etc).

# JavaScript #
Coding guidelines for JavaScript / CSS:
  * [Tridion CME guidelines](CodingGuidelines_Anguilla.md)

# Compiled Code #
Coding guidelines for C#:
  * [Microsoft's  .NET 4.0 Design Guidelines](http://msdn.microsoft.com/en-us/library/ms229042.aspx)
  * Some further details discussed on [Brad Abrahm's blog](http://blogs.msdn.com/b/brada/archive/2005/01/26/361363.aspx).

General code layout:
  * Avoid copyright / author statement at the top of each file. Maintain this information here, in a readme, or other obvious place.
  * Add "using" statements at the top of files, removing unreferenced statements (no unused imports).
  * Order members from unchanging, more private aspects of a class to the more public behaviors and attributes. Example:
    1. fields
    1. constructors
    1. events
    1. properties
    1. methods
  * Further sort members by visibility:
    1. private
    1. protected,
    1. internal
    1. public, etc.

The most "interesting," worked-on, and more visible (public) code will tend to be at the bottom of your code files.

Also:
  * **Add comments!** Especially public methods and members.
  * Consider ReSharper or CodeRush Xpress (free)
  * See Uncle Bob Martin's [Clean Code](http://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882). Summary can be found [here](http://dl.dropbox.com/u/7845538/Clean%20Code%20Summary.pdf).