using System;
using System.Runtime.Serialization;

namespace PowerTools.Model.Services.DTO
{
	[DataContract]
	public class AppDataInspectorData
	{
		[DataMember]
		public String ApplicationId;

		[DataMember]
		public String Value;

		[DataMember]
		public String Type;
	}
}
