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
		public int Schemas;

		[DataMember]
		public int ComponentTemplates;

		[DataMember]
		public int PageTemplates;

		[DataMember]
		public int TemplateBuildingBlocks;

		[DataMember]
		public int StructureGroups;

		[DataMember]
		public int Pages;

		[DataMember]
		public int Categories;

		[DataMember]
		public int Keywords;
	}
}
