param(
    [string]$JavaPath='java',
    [string]$CompilerJar=$env:ECJ_JAR,
    [string]$AndroidJar=$env:ANDROID_JAR,
    [string]$JsonJar=$env:JSON_JAR,
    [string]$OutputPath=(Join-Path $PSScriptRoot ('../../work/calendar-contract-v195-'+(Get-Date -Format 'yyyyMMdd-HHmmss')))
)
$ErrorActionPreference='Stop'
foreach($dependency in @($CompilerJar,$AndroidJar,$JsonJar)){if(!$dependency -or !(Test-Path -LiteralPath $dependency -PathType Leaf)){throw 'Set CompilerJar/AndroidJar/JsonJar to the existing local build dependencies.'}}
if(Test-Path -LiteralPath $OutputPath){throw 'Choose a new OutputPath; existing outputs are never replaced.'}
New-Item -ItemType Directory -Path $OutputPath | Out-Null
$sources=@(Get-ChildItem -LiteralPath $PSScriptRoot -File -Filter '*.java' | Where-Object {$_.Name -notmatch 'Test|Contract'} | Select-Object -ExpandProperty FullName)
$sources+=Join-Path $PSScriptRoot 'WidgetCalendarContractV195.java'
& $JavaPath -jar $CompilerJar -1.8 -proc:none -encoding UTF-8 -classpath "$JsonJar;$AndroidJar" -d $OutputPath @sources
if($LASTEXITCODE -ne 0){throw 'Calendar contract Java compilation failed.'}
& $JavaPath -cp "$OutputPath;$JsonJar;$AndroidJar" com.aiderlog.v22app.WidgetCalendarContractV195
if($LASTEXITCODE -ne 0){throw 'Calendar contract assertions failed.'}
Write-Output 'Verified pure JVM calendar model contracts; Android launcher/UI inflation still requires a device.'
