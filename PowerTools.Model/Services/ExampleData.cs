using System.Runtime.Serialization;

namespace PowerTools.Model.Services
{
	[DataContract]
	public class ExampleData
	{
		[DataMember]
		public string UserName;

        // add additional serialized data members as needed
	}
}
