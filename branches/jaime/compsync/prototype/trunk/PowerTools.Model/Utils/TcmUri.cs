using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text.RegularExpressions;

namespace PowerTools.Model.Utils
{
	/// <summary>
	/// Creates TcmUri class from a string. Makes it easy to retrieve TcmUri properties like PublicationId, ItemId, ItemTypeId and Version.
	/// Usage: var PubliationId = new TcmUri("tcm:45-3456-64").PublicationId;
	/// </summary>
	public class TcmUri
	{
		public int ItemId { get; set; }
		public int PublicationId { get; set; }
		public int ItemTypeId { get; set; }
		public int Version { get; set; }

		public TcmUri(string Uri)
		{
			Regex re = new Regex(@"tcm:(\d+)-(\d+)-?(\d*)-?v?(\d*)");
			Match m = re.Match(Uri);
			if (m.Success)
			{
				PublicationId = Convert.ToInt32(m.Groups[1].Value);
				ItemId = Convert.ToInt32(m.Groups[2].Value);
				if (m.Groups.Count > 3 && !string.IsNullOrEmpty(m.Groups[3].Value))
				{
					ItemTypeId = Convert.ToInt32(m.Groups[3].Value);
				} else
				{
					ItemTypeId = 16;
				}
				if (m.Groups.Count > 4 && !string.IsNullOrEmpty(m.Groups[4].Value))
				{
					Version = Convert.ToInt32(m.Groups[4].Value);
				} else
				{
					Version = 0;
				}
			}
		}
		public TcmUri(int PublicationId, int ItemId, int ItemTypeId, int Version)
		{
			this.PublicationId = PublicationId;
			this.ItemId = ItemId;
			this.ItemTypeId = ItemTypeId;
			this.Version = Version;
		}
		public override string ToString()
		{
			if (this.ItemTypeId == 16)
			{
				return string.Format("tcm:{0}-{1}", this.PublicationId, this.ItemId);
			}
			return string.Format("tcm:{0}-{1}-{2}", this.PublicationId, this.ItemId, this.ItemTypeId);
		}
	}

	
}