using System.Runtime.Serialization;

namespace PowerTools.Model.Services.DTO
{
	[DataContract]
	public class ServiceResponseBase
	{
		[DataMember]
		public string Message { get; set; }

		[DataMember]
		public bool Success { get; set; }

		[DataMember]
		public string ProcessId { get; set; }
	}
}