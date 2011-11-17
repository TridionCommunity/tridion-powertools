using System;

namespace PowerTools.Model.Services.Exceptions
{
	public class BaseServiceException : Exception
	{
		public BaseServiceException()
			: base()
		{
		}

		public BaseServiceException(string message)
			: base(message)
		{
		}
	}
}