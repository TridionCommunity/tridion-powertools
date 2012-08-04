using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CustomInstallerView.StringExtensions
{
    
    public static class StringExtensions
    {   
        //Thanks StackOverflow.com
        public static bool Contains(this string source, string toCheck, StringComparison comp)
        {
            return source.IndexOf(toCheck, comp) >= 0;
        }
    }
    
}
