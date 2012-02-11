using System;
using System.Collections.Generic;
using System.Web;
using System.Text.RegularExpressions;

namespace PowerTools.Model.Utils
{
	/// <summary>
	/// Addes 4 propertys/methods to a string for retrieving the various TcmUri parts
	/// Add: using PowerTools.Model.Utils to your class and you can do this:
	/// "tcm:45-2345".ItemTypeId()
	/// "tcm:45-2341-64".PublicationId()
	/// "tcm:45-343-32".ItemId();
	/// "tcm:45-434-32-v4".Version();
	/// </summary>
	public static class StringExtensions
	{
		//Returns the PublicationId from a TcmUri
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

		//Returns the ItemId from a TcmUri
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

		//Returns the ItemTypeId from a TcmUri
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

		//Returns the Version from a TcmUri
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