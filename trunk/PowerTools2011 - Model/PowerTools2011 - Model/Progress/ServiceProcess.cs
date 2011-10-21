using System;

namespace PowerTools2011.Model.Services.Progress
{
	public class ServiceProcess
	{
		private int _complete = 0;
		private string _status = "";
		private string _id = "";

		private readonly object m_Lock = new object();

		public ServiceProcess()
		{
			var guid = Guid.NewGuid();

			this._id = guid.ToString();

			SetStatus("Initializing...");
		}

		public int PercentComplete
		{
			get { return _complete; }
			set { _complete = value; }
		}

		public string Id
		{
			get { return _id; }
			set { _id = value; }
		}

		public bool Failed { get; set; }

		public string Status
		{
			get { return _status; }
			set { _status = value; }
		}

		public void Complete()
		{
			Complete("Completed");
		}

		public void Complete(string status)
		{
			SetCompletePercentage(100);
			SetStatus(status);
		}

		public void SetCompletePercentage(int percent)
		{
			lock (m_Lock)
			{
				_complete = percent;
			}
		}

		public void IncrementCompletePercentage()
		{
			lock (m_Lock)
			{
				_complete++;
			}
		}

		public void IncrementCompletePercentageBy(int percent)
		{
			lock (m_Lock)
			{
				_complete += percent;
			}
		}

		public void SetStatus(string status)
		{
			lock (m_Lock)
			{
				_status = status;
			}
		}
	}
}