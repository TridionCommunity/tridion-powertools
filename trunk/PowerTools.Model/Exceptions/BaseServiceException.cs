using System;

namespace PowerTools.Model.Exceptions
{
	public class BaseServiceException : Exception
	{
		public BaseServiceException()
		{
		}

		public BaseServiceException(string message) : base(message)
		{
		}
	}
}