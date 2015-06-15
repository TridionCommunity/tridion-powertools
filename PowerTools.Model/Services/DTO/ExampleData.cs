using System.Runtime.Serialization;

namespace PowerTools.Model.Services.DTO
{
	[DataContract]
	public class ExampleData
	{
		[DataMember]
		public string UserName;
        [DataMember]
        public string UserDescription;
        [DataMember]
        public string UserID;
        // add additional serialized data members as needed
	}
}
