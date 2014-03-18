using System;
using System.Globalization;
using System.Text.RegularExpressions;

namespace PowerTools.Model.Utils
{
	/// <summary>
    /// Initializes a new instance of the TcmUri class.
    /// </summary>
	public class TcmUri
	{
        public int ItemId { get; set; }
		public int ItemType { get; set; }
        public int PublicationId { get; set; }
        public int Version { get; set; }


        /// <summary>
        /// Initializes a new instance of the TcmUri class.
        /// </summary>
        /// <param name="uri">The string representation of the TCM URI.</param>
        public TcmUri(string uri)
		{
            int publicationId;
            int itemId;
            int itemType;
            int version;

            if (!Parse(uri, out publicationId, out itemId, out itemType, out version))
            {
                throw new Exception(string.Format(CultureInfo.InvariantCulture, Resources.ErrorInvalidTcmUri, uri));
            }

            PublicationId = publicationId;
            ItemId = itemId;
            ItemType = itemType;
            Version = version;
		}

        /// <summary>
        /// Initializes a new instance of the TcmUri class.
        /// </summary>
        /// <param name="publicationId">The ID of the Publication the item belongs to.</param>
        /// <param name="itemId">The ID of the item itself.</param>
        /// <param name="itemType">The type of item (e.g. 16 for a Component)</param>
        public TcmUri(int publicationId, int itemId, int itemType) 
            : this(publicationId, itemId, itemType, 0)
        {
        }

        /// <summary>
        /// Initializes a new instance of the TcmUri class.
        /// </summary>
        /// <param name="publicationId">The ID of the Publication the item belongs to.</param>
        /// <param name="itemId">The ID of the item itself.</param>
        /// <param name="itemType">The type of item (e.g. 16 for a Component)</param>
        /// <param name="version">The specific version of the item to retrieve.</param>
	    public TcmUri(int publicationId, int itemId, int itemType, int version)
            : this(string.Format(CultureInfo.InvariantCulture, "tcm:{0}-{1}-{2}-v{3}", publicationId, itemId, itemType, version))
		{
		}

        /// <summary>
        /// Returns the string representation of the TCM URI.
        /// </summary>
        public override string ToString()
        {
            if (Version > 0)
            {
                return string.Format(CultureInfo.InvariantCulture, "tcm:{0}-{1}-{2}-v{3}", PublicationId, ItemId, ItemType, Version);
            }
            if (ItemType == 16)
            {
                return string.Format("tcm:{0}-{1}", PublicationId, ItemId);
            }
            return string.Format("tcm:{0}-{1}-{2}", PublicationId, ItemId, ItemType);
        }

        /// <summary>
        /// Check if a given string is a valid TCM URI.
        /// </summary>
        /// <param name="uri">The string representation of a TCM URI (e.g. "tcm:2-255-32").</param>
        /// <returns><code>true</code> if the string is valid as a TCM URI; <code>false</code> otherwise.</returns>
        public static bool IsValid(string uri)
        {
            int publicationId;
            int itemId;
            int itemType;
            int version;

            return Parse(uri, out publicationId, out itemId, out itemType, out version);
        }

        /// <summary>
        /// Returns the equivalent of a <code>null</code> value for a TCM URI.
        /// </summary>
        public static TcmUri UriNull
        {
            get { return new TcmUri("tcm:0-0-0"); }
        }

        /// <summary>
        /// Converts the string representation of a TCM URI to integers representing the different parts of the URI.
        /// </summary>
        /// <param name="input">The string to parse.</param>
        /// <param name="publicationId">The ID of the Publication the item belongs to.</param>
        /// <param name="itemId">The ID of the item itself.</param>
        /// <param name="itemType">The type of the item (e.g. 16 for a Component)</param>
        /// <param name="version">The version of the item. Defaults to 0 which is the current version.</param>
        /// <returns><code>true</code> if the parsing succeeded; <code>false</code> otherwise.</returns>
        protected static bool Parse(string input, out int publicationId, out int itemId, out int itemType, out int version)
        {
            publicationId = 0;
            itemId = 0;
            itemType = 0;
            version = 0;

            if (string.IsNullOrEmpty(input)) return false;

            var re = new Regex(@"tcm:(\d+)-(\d+)-?(\d*)-?v?(\d*)");
            var m = re.Match(input);
            
            if (!m.Success) return false;

            try
            {
                publicationId = Convert.ToInt32(m.Groups[1].Value);
                itemId = Convert.ToInt32(m.Groups[2].Value);
                version = 0;
                itemType = 16;

                // The groups are always there, even if they did not match anything. They'll just have an empty string value in that case.
                if (!String.IsNullOrWhiteSpace(m.Groups[3].Value))
                {
                    itemType = Convert.ToInt32(m.Groups[3].Value);
                }

                if (!String.IsNullOrWhiteSpace(m.Groups[4].Value))
                {
                    version = Convert.ToInt32(m.Groups[4].Value);
                }

                if (publicationId == 0 && itemId == 0 && itemType == 0 && version == 0) return true;
                return (publicationId > -1) && (itemId > 0) && (itemType > 0) && (version > -1);
            }
            catch (FormatException)
            {
            }
            catch (OverflowException)
            {
            }

            return false;
        }
	}

	
}