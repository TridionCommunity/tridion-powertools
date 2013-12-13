Param(
	[Parameter(Mandatory=$true, Position=1)]
	[string]$productName,
	[Parameter(Mandatory=$true, Position=2)]
	[int]$buildNumber,
	[Parameter(Position=3)]
	[string]$newTheme = "",
	[Parameter(Position=4)]
	[string]$newIcon = ""
);
   

# Utility functions
function FailBuild($errorMessage)
{
	Write-Host "##teamcity[buildStatus status='FAILURE' text='$errorMessage']";
	throw $errorMessage;
}

# Update installer project file
function UpdateProjectFile
{
	$projectFile = "..\PowerTools.Installer\PowerTools.Installer.vdproj";
	$version = "1.1.$buildNumber";
	$productCode = [System.Guid]::NewGuid().ToString().ToUpperInvariant();

	Write-Host "Updating setup file '$projectFile':";
	Write-Host "  Product = $productName";
	Write-Host "  Product code = $productCode";
	Write-Host "  Version = $version";

	if (!(Test-Path $projectFile))
	{
		FailBuild "Could not find the setup project file (looking for '$projectFile').";
	}

	(gc $projectFile) `
		-replace "`"Title`" = `"8:Tridion PowerTools`"", "`"Title`" = `"8:$productName`"" `
		-replace "`"ProductName`" = `"8:Tridion PowerTools`"", "`"ProductName`" = `"8:$productName`"" `
		-replace "`"ProductVersion`" = `"8:1.1.0`"", "`"ProductVersion`" = `"8:$version`"" `
		-replace "`"ProductCode`" = `"8:{B3C8C239-D235-49C5-AF09-737BF4354BC4}`"", "`"ProductCode`" = `"8:{$productCode}`"" `
	| Out-File $projectFile;

	Write-Host "Double-checking that the changes are in the setup file..."

	$newContent = ((gc $projectFile) -join [Environment]::NewLine);
	$doubleCheckSucceeded = ($newContent.IndexOf($productCode) -gt 0);

	if (!$doubleCheckSucceeded)
	{
		FailBuild "Double-check of the version failed. Apparently the setup file wasn't updated correctly.";
	}
}

function UpdateEditorConfiguration
{
	if ($newTheme -eq "") { return; }

	$editorConfig = '..\PowerTools.Editor\Configuration\Editor.config';
	
	Write-Host "Setting default theme to $newTheme in '$editorConfig'."
	
	if (!(Test-Path $editorConfig))
	{
		FailBuild "Could not find the editor configuration file (looking for '$editorConfig')."
	}

	(gc $editorConfig) -replace "<path>/Themes/Carbon</path>", "<path>/Themes/$newTheme</path>" | Out-File $editorConfig;
}

function UpdateInstallerIcon
{
	if ($newIcon -eq "") { return; }
	Copy-Item -Path "$newIcon" -Destination "..\PowerTools.Installer\power-tools-logo-without-text-48-48.ico";
}



# Execution of steps
UpdateProjectFile;
UpdateEditorConfiguration;
UpdateInstallerIcon;