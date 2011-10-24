using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text.RegularExpressions;

namespace PowerTools.Model.Utils
{
	public static class StringExtensions
	{
		public static int PublicationId(this String str)
		{

			Regex re = new Regex(@"tcm:(\d+)-(\d+)-?(\d*)-?v?(\d*)");
			Match m = re.Match(str);
			if (m.Success)
			{
				return Convert.ToInt32(m.Groups[1].Value);
			}

			return 0;

		}

		public static int ItemId(this String str)
		{

			Regex re = new Regex(@"tcm:(\d+)-(\d+)-?(\d*)-?v?(\d*)");
			Match m = re.Match(str);
			if (m.Success)
			{
				return Convert.ToInt32(m.Groups[2].Value);
			}

			return 0;

		}

		public static int ItemTypeId(this String str)
		{
			Regex re = new Regex(@"tcm:(\d+)-(\d+)-?(\d*)-?v?(\d*)");
			Match m = re.Match(str);
			if (m.Groups.Count > 3 && !string.IsNullOrEmpty(m.Groups[3].Value))
			{
				return Convert.ToInt32(m.Groups[3].Value);
			} else
			{
				return 16;
			}
		}

		public static int Version(this String str)
		{
			Regex re = new Regex(@"tcm:(\d+)-(\d+)-?(\d*)-?v?(\d*)");
			Match m = re.Match(str);
			if (m.Groups.Count > 4 && !string.IsNullOrEmpty(m.Groups[4].Value))
			{
				return Convert.ToInt32(m.Groups[4].Value);
			} else
			{
				return 0;
			}
		}
	}
}