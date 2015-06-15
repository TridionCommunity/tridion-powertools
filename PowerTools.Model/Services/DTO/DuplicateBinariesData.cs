using System;
using System.Runtime.Serialization;
using System.Collections.Generic;

namespace PowerTools.Model.Services.DTO
{
    [DataContract]
    public class DuplicateBinariesData
    {
        [DataMember]
        public string ItemTcmId;

        [DataMember]
        public string ItemFileName;

    }
}
