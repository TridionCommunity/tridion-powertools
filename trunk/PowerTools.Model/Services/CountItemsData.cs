using System.Runtime.Serialization;

namespace PowerTools.Model.Services
{
	[DataContract]
	public class CountItemsData
	{
		[DataMember]
		public int Folders;

		[DataMember]
		public int Components;

		[DataMember]
		public int StructureGroups;

		[DataMember]
		public int Pages;
	}
}
