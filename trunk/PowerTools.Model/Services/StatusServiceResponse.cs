using System.Runtime.Serialization;

namespace PowerTools.Model.Services
{
	[DataContract]
	public class StatusServiceResponse : ServiceResponseBase
	{
		[DataMember]
		public int PercentComplete { get; set; }

		[DataMember]
		public bool Complete { get; set; }
	}
}