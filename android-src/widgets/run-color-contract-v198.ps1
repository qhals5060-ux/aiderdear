param(
 [string]$JavaPath='java', [string]$CompilerJar=$env:ECJ_JAR,
 [string]$AndroidJar=$env:ANDROID_JAR, [string]$JsonJar=$env:JSON_JAR,
 [string]$OutputPath=(Join-Path $PSScriptRoot ('../../work/color-v198-'+(Get-Date -Format 'yyyyMMdd-HHmmss')))
)
$ErrorActionPreference='Stop'
foreach($dependency in @($CompilerJar,$AndroidJar,$JsonJar)){if(!$dependency -or !(Test-Path -LiteralPath $dependency -PathType Leaf)){throw 'Set CompilerJar/AndroidJar/JsonJar to existing local dependencies.'}}
if(Test-Path -LiteralPath $OutputPath){throw 'Choose a new OutputPath; existing outputs are never replaced.'}
$production=Join-Path $OutputPath 'production';$recording=Join-Path $OutputPath 'recording'
New-Item -ItemType Directory -Path $production,$recording|Out-Null
$sources=@(Get-ChildItem -LiteralPath $PSScriptRoot -File -Filter '*.java'|Where-Object {$_.Name -notmatch 'Test|Contract'}|Select-Object -ExpandProperty FullName)
$sources+=Join-Path $PSScriptRoot "WidgetColorContractV198.java"
& $JavaPath -jar $CompilerJar -1.8 -proc:none -nowarn -encoding UTF-8 -classpath "$JsonJar;$AndroidJar" -d $production @sources
if($LASTEXITCODE -ne 0){throw 'Production compilation failed'}
$boundaries=@(Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot 'transport-v197') -Recurse -File -Filter '*.java'|Select-Object -ExpandProperty FullName)
$boundaries+=@(Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot "transport-v198") -Recurse -File -Filter "*.java"|Select-Object -ExpandProperty FullName)
& $JavaPath -jar $CompilerJar -1.8 -proc:none -nowarn -encoding UTF-8 -classpath "$production;$JsonJar;$AndroidJar" -d $recording @boundaries
if($LASTEXITCODE -ne 0){throw 'Recording boundary compilation failed'}
foreach($test in @("WidgetColorContractV198","WidgetColorRenderContractV198","WidgetTransportContractV197")){
 & $JavaPath -cp "$recording;$production;$JsonJar;$AndroidJar" ("com.aiderlog.v22app."+$test)
 if($LASTEXITCODE -ne 0){throw "Native color/transport contracts failed"}
}
