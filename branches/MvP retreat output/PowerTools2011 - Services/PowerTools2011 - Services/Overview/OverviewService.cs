using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ServiceModel.Activation;
using PowerTools2011.Services.Example;
using System.ServiceModel;
using System.Threading;
using Tridion.ContentManager.CoreService.Client;
using PowerTools2011.Services.Progress;

namespace PowerTools2011.Services.Overview
{
	[ServiceBehavior(InstanceContextMode = InstanceContextMode.Single, ConcurrencyMode = ConcurrencyMode.Multiple)]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class OverviewService : IOverviewService
	{
		public StatusServiceResponse Calculate(string root)
		{
			var newProcess = new OverviewProcess();

			var storedProcess = new ServiceProcessHelper(newProcess);
			OperationContext.Current.InstanceContext.Extensions.Add(storedProcess);

			ThreadPool.QueueUserWorkItem(CalculatationWorker, new CalculateData() { Root = root, StoredProcess = storedProcess });

			return new StatusServiceResponse()
				{	Message = "Started Calculating", 
					Success =true,
					ProcessId = newProcess.Id,
					PercentComplete = 0
				};
		}

		public OverviewServiceResponse GetCalculationResult(string processId)
		{
			string message = String.Empty;

			try
			{
				var storedProcess = GetProcessFromContext(processId);
				
				if (storedProcess != null)
				{
					var innerProc =(OverviewProcess)storedProcess.Process;

					OperationContext.Current.InstanceContext.Extensions.Remove(storedProcess);

					return new OverviewServiceResponse()
					{
						Success = !innerProc.Failed,						
						Message = "Finished",
						Result = innerProc.Result						
					};
				}

				message = String.Format("Couldnt find process with ID: '{0}'", processId);
			}
			catch (Exception ex)
			{
				message = ex.Message;
			}

			return new OverviewServiceResponse()
			{
				Success = false,
				Message = message
			};
		}

		private ServiceProcessHelper GetProcessFromContext(string processId)
		{
			var processes = OperationContext.Current.InstanceContext.Extensions.FindAll<ServiceProcessHelper>();

			foreach (ServiceProcessHelper storedprocess in processes)
			{				
				if (storedprocess.Process.Id == processId)
				{
					return storedprocess;
				}
			}

			return null;
		}

		public StatusServiceResponse GetCalculateProcessStatus(string processId)
		{
			string message = String.Empty;

			try
			{
				var storedProcess = GetProcessFromContext(processId);

				if (storedProcess != null)
				{
					var innerProc = storedProcess.Process;

					if (innerProc.Failed)
					{
						OperationContext.Current.InstanceContext.Extensions.Remove(storedProcess);
					}

					return new StatusServiceResponse()
					{
						Success = !innerProc.Failed,
						Message = innerProc.Status,
						ProcessId = innerProc.Id,
						PercentComplete = innerProc.PercentComplete
					};
				}

				message = String.Format("Couldnt find process with ID: '{0}'", processId);
			}
			catch (Exception ex)
			{
				message = ex.Message;
			}

			return new StatusServiceResponse()
			{
				Success = false,
				Message = message
			};
		}

		private void CalculatationWorker(object state)
		{
			OverviewProcess innerPrc = null;

			try
			{
				var data = (CalculateData)state;
				innerPrc = (OverviewProcess)data.StoredProcess.Process;

				var rootUri = new TcmUri(data.Root);

				List<ItemType> types = GetRequiredTypes(rootUri);

				innerPrc.SetStatus(String.Format("Found {0} types to calculate", types.Count));
				innerPrc.SetCompletePercentage(1);

				Thread.Sleep(1200); //mimic work time

				var workPrec = 100 / types.Count;

				foreach (var type in types)
				{
					innerPrc.SetStatus("Calculating items for type: " + type.ToString());

					Thread.Sleep(2500); //mimic work time

					innerPrc.IncrementCompletePercentageBy(workPrec - 1);
				}

				var result = new CalculationResult()
				{
					CalculatedTypes = types,
					TotalItems = 10000
				};

				innerPrc.Result = result;

				innerPrc.Complete("Finished Calculation");
			}
			catch (Exception ex)
			{
				if (innerPrc != null)
				{
					innerPrc.PercentComplete = 0;
					innerPrc.SetStatus("Failed: " + ex.Message);
					innerPrc.Failed = true;
				}
			}
		}

		private List<ItemType> GetRequiredTypes(TcmUri rootUri)
		{
			switch (rootUri.ItemType)
			{
				case ItemType.Folder:
					return new List<ItemType>()
						{
							ItemType.Folder, ItemType.Component, ItemType.ComponentTemplate, 
							ItemType.PageTemplate, ItemType.Schema, ItemType.TemplateBuildingBlock, 
							ItemType.VirtualFolder
						};

				case ItemType.StructureGroup:
					return new List<ItemType>()
						{
							ItemType.StructureGroup, ItemType.Page
						};
					
				case ItemType.Category:

					return new List<ItemType>()
						{
							ItemType.Keyword
						};
					
				case ItemType.Publication:
					return new List<ItemType>()
						{
							ItemType.Folder, ItemType.Component, ItemType.ComponentTemplate, 
							ItemType.PageTemplate, ItemType.Schema, ItemType.TemplateBuildingBlock, 
							ItemType.VirtualFolder, ItemType.Page, ItemType.StructureGroup, ItemType.Category,
							ItemType.Keyword
						};
				default:
					throw new ArgumentException(String.Format("Cannot calculate overview for root of type: '{0}'", rootUri.ItemType));
			}			
		}

		private class CalculateData
		{
			public string Root { get; set; }
			public ServiceProcessHelper StoredProcess { get; set; }
		}
	}
}