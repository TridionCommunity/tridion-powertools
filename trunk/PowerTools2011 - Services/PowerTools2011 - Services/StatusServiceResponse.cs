using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace PowerTools2011.Services
{
	[DataContract]
	public class StatusServiceResponse :ServiceResponseBase
	{
		[DataMember]
		public int PercentComplete { get; set; }

		[DataMember]
		public bool Complete { get; set; }
	}
}