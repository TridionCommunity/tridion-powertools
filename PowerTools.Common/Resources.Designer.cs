﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.239
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace PowerTools.Common {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "4.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    internal class Resources {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal Resources() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("PowerTools.Common.Resources", typeof(Resources).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Could not find the Editors virtual directory..
        /// </summary>
        internal static string ErrorEditorsVirtualDirNotFound {
            get {
                return ResourceManager.GetString("ErrorEditorsVirtualDirNotFound", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Could not find the Models virtual directory..
        /// </summary>
        internal static string ErrorModelsVirtualDirNotFound {
            get {
                return ResourceManager.GetString("ErrorModelsVirtualDirNotFound", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to The target directory was not passed to the custom action..
        /// </summary>
        internal static string ErrorTargetDirNotSet {
            get {
                return ResourceManager.GetString("ErrorTargetDirNotSet", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to The Content Manager Explorer website is empty..
        /// </summary>
        internal static string ErrorWebsiteEmpty {
            get {
                return ResourceManager.GetString("ErrorWebsiteEmpty", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to The ID of the SDL Tridion 2011 website was not passed to the custom action..
        /// </summary>
        internal static string ErrorWebsiteIdNotSet {
            get {
                return ResourceManager.GetString("ErrorWebsiteIdNotSet", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to The SDL Tridion 2011 website could not be found. Searched for a site with ID &apos;{0}&apos;..
        /// </summary>
        internal static string ErrorWebsiteNotFound {
            get {
                return ResourceManager.GetString("ErrorWebsiteNotFound", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Could not find the WebUI virtual directory..
        /// </summary>
        internal static string ErrorWebUiNotFound {
            get {
                return ResourceManager.GetString("ErrorWebUiNotFound", resourceCulture);
            }
        }
    }
}
