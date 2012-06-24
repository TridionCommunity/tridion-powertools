using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PowerTools.Model.Utils
{
    public static class Extensions
    {
        public static HashSet<T> ToHashSet<T>(this IEnumerable<T> source)
        {
            return new HashSet<T>(source);
        }
    }
}