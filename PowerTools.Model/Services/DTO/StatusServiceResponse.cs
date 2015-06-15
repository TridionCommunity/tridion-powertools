using System.Runtime.Serialization;

namespace PowerTools.Model.Services.DTO
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