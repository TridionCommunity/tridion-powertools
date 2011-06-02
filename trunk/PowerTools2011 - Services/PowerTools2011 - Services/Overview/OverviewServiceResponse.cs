using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace PowerTools2011.Services.Overview
{
	[DataContract]
	public class OverviewServiceResponse : ServiceResponseBase
	{
		[DataMember]
		public CalculationResult Result { get; set; }
	}
}