param(
    [string]$JavaPath='java',
    [string]$CompilerJar=$env:ECJ_JAR,
    [string]$AndroidJar=$env:ANDROID_JAR,
    [string]$JsonJar=$env:JSON_JAR,
    [string]$OutputPath=(Join-Path $PSScriptRoot ('../../work/private-contract-v196-'+(Get-Date -Format 'yyyyMMdd-HHmmss')))
)
$ErrorActionPreference='Stop'
foreach($dependency in @($CompilerJar,$AndroidJar,$JsonJar)){if(!$dependency -or !(Test-Path -LiteralPath $dependency -PathType Leaf)){throw 'Set CompilerJar/AndroidJar/JsonJar to existing local build dependencies.'}}
if(Test-Path -LiteralPath $OutputPath){throw 'Choose a new OutputPath; existing outputs are never replaced.'}
New-Item -ItemType Directory -Path $OutputPath | Out-Null
$sources=@(Get-ChildItem -LiteralPath $PSScriptRoot -File -Filter '*.java' | Where-Object {$_.Name -notmatch 'Test|Contract'} | Select-Object -ExpandProperty FullName)
$sources+=Join-Path $PSScriptRoot 'WidgetPrivateContractV196.java'
$sources+=Join-Path $PSScriptRoot 'WidgetNoteContractV196.java'
& $JavaPath -jar $CompilerJar -1.8 -proc:none -encoding UTF-8 -classpath "$JsonJar;$AndroidJar" -d $OutputPath @sources
if($LASTEXITCODE -ne 0){throw 'Private widget Java compilation failed.'}
foreach($name in @('WidgetPrivateContractV196','WidgetNoteContractV196')){& $JavaPath -cp "$OutputPath;$JsonJar;$AndroidJar" ('com.aiderlog.v22app.'+$name);if($LASTEXITCODE -ne 0){throw ('Contract failed: '+$name)}}
Write-Output 'Verified pure JVM private queue/form contracts; Android launcher/UI behavior still requires a device.'
