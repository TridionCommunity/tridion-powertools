using System;

namespace PowerTools2011.Model.Services.Exceptions
{
    public class BaseServiceException : Exception
    {
        public BaseServiceException() : base()
        {
        }

        public BaseServiceException(string message) : base(message)
        {
        }
    }
}