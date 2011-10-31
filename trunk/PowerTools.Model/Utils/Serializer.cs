using System;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using System.Xml.Serialization;


namespace PowerTools.Model.Utils
{
	/// <summary>
	/// A serialization helper class. Taken from http://madskristensen.net/post/Serialization-helper-class-in-C-20.aspx
	/// </summary>
	public static class Serializer
	{

		private static object _Lock = new object();

		#region Serialize

		/// <summary>
		/// Serialize an object and store it in a file.
		/// </summary>
		/// <param name="mode">The instance of an object to serialize</param>
		/// <param name="instance">The instance of an object to serialize.</param>
		/// <param name="filePath">The location on disk.</param>
		/// <returns>A serialized MemoryStream.</returns>
		public static void Serialize(SerializeMode mode, object instance, string filePath)
		{
			using (FileStream fs = new FileStream(filePath, FileMode.Create))
			{
				MemoryStream stream = Serialize(mode, instance);
				byte[] buffer = stream.ToArray();
				fs.Write(buffer, 0, buffer.Length);
				fs.Flush();
			}
		}

		/// <summary>
		/// Serializes any instances of any objects.
		/// </summary>
		/// <param name="mode">The instance of an object to serialize</param>
		/// <param name="instance">The instance of an object to serialize.</param>
		/// <returns>A serialized MemoryStream.</returns>
		public static MemoryStream Serialize(SerializeMode mode, object instance)
		{
			if (instance == null)
				throw new ArgumentNullException("The instance object is null.");

			lock (_Lock)
			{
				MemoryStream stream = new MemoryStream();
				switch (mode)
				{
					case SerializeMode.Xml:
						SerializeXml(ref stream, ref instance);
						return stream;

					default:
						SerializeBinary(ref stream, ref instance);
						return stream;
				}
			}
		}

		private static void SerializeBinary(ref MemoryStream stream, ref object instance)
		{
			BinaryFormatter bfor = new BinaryFormatter();
			bfor.Serialize(stream, instance);
			bfor = null;
		}

		private static void SerializeXml(ref MemoryStream stream, ref object instance)
		{
			XmlSerializer ser = new XmlSerializer(instance.GetType());
			XmlSerializerNamespaces xsn = new XmlSerializerNamespaces();
			xsn.Add(string.Empty, null);
			ser.Serialize(stream, instance, xsn);
			ser = null;
		}

		#endregion

		#region Deserialize

		/// <summary>
		/// Deserialize an object from a byte array
		/// </summary>
		/// <param name="mode">The mode to deserialize the object.</param>
		/// <param name="instance">Specify an instance of an object to deserialize.</param>
		/// <param name="buffer">A byte array containing the serialized object, that needs
		/// to be deserialized</param>
		/// <returns>A deserialized object.</returns>
		public static T Deserialize<T>(SerializeMode mode, T instance, byte[] buffer)
		{
			if (buffer == null)
				throw new ArgumentNullException("The byte array is null.");

			lock (_Lock)
			{
				switch (mode)
				{
					case SerializeMode.Xml:
						return DeserializeXml<T>(instance, buffer);

					default:
						return DeserializeBinary<T>(instance, buffer);
				}
			}
		}

		/// <summary>
		/// Deserialize an object from a location on disk or network.
		/// </summary>
		/// <param name="mode">The mode to deserialize the object.</param>
		/// <param name="instance">Specify an instance of an object to deserialize.</param>
		/// <param name="filePath">The path to the serialized object.</param>
		/// <returns>A deserialized object.</returns>
		public static T Deserialize<T>(SerializeMode mode, T instance, string filePath)
		{
			byte[] buffer = null;

			try
			{
				using (FileStream fs = new FileStream(filePath, FileMode.Open))
				{
					buffer = new byte[fs.Length];
					fs.Read(buffer, 0, buffer.Length);
					return Deserialize<T>(mode, instance, buffer);
				}
			}
			finally
			{
				buffer = null;
			}
		}

		/// <summary>
		/// Deserializes an object from a byte array
		/// </summary>
		private static T DeserializeXml<T>(T instance, byte[] buffer)
		{
			using (MemoryStream stream = new MemoryStream(buffer))
			{
				XmlSerializer ser = new XmlSerializer(typeof(T));
				instance = (T)ser.Deserialize(stream);
				return instance;
			}
		}

		/// <summary>
		/// Deserializes the object from a byte array.
		/// </summary>
		/// <param name="instance">Specify an instance of an object to deserialize.</param>
		/// <param name="array">A serialized byte array</param>
		private static T DeserializeBinary<T>(T instance, byte[] array)
		{
			BinaryFormatter bf;
			MemoryStream ms = null;
			try
			{
				ms = new MemoryStream(array);
				{
					bf = new BinaryFormatter();
					instance = (T)bf.Deserialize(ms);
					return instance;
				}
			}
			finally
			{
				bf = null;
				if (ms != null) ms.Close();
				ms = null;
			}
		}

		#endregion

	}

	#region Enumeration

	/// <summary>
	/// The type of serialization.
	/// </summary>
	public enum SerializeMode
	{
		/// <summary>Will serialize to a binary format.</summary>
		Binary,
		/// <summary>Will serialize to an XML format.</summary>
		Xml
	}

	#endregion
}