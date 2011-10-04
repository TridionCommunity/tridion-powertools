using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using Tridion.ContentManager.CoreService.Client;

namespace PowerTools2011.Services.Overview
{
	[DataContract]
	public class CalculationResult
	{
		[DataMember]
		public IEnumerable<ItemType> CalculatedTypes { get; set; }

		[DataMember]
		public int TotalItems { get; set; }
	}
}