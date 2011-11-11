using System;
using System.Runtime.Serialization;

namespace PowerTools.Model.Services
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
