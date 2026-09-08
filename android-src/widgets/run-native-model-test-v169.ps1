param(
    [string]$JavaPath='C:/Users/김보민/Documents/Codex/2026-09-01/new-chat/work/android-tools/jre17/jdk-17.0.20.1+1-jre/bin/java.exe',
    [string]$ToolingPath='C:/AiderLogBuild/tooling-v163',
    [string]$AndroidJar='C:/AiderLogBuild/android-platform35-v169/sdk/android-35/android.jar',
    [string]$OutputPath=('C:/AiderLogBuild/widget-model-test-v169-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
)
$ErrorActionPreference='Stop'
foreach($taskTestInput169 in @($JavaPath,(Join-Path $ToolingPath 'ecj.jar'),(Join-Path $ToolingPath 'json.jar'),$AndroidJar)){
    if(!(Test-Path -LiteralPath $taskTestInput169 -PathType Leaf)){throw "Missing local test dependency: $taskTestInput169"}
}
if(Test-Path -LiteralPath $OutputPath){throw 'Choose a new OutputPath; existing outputs are never replaced.'}
New-Item -ItemType Directory -Path $OutputPath | Out-Null
$taskTestClasspath169=(Join-Path $ToolingPath 'json.jar') + ';' + $AndroidJar
$taskTestSources169=@('WidgetProvider.java','WidgetNativeV164.java','WidgetDesignV165.java','WidgetRowsV164.java','WidgetNavV164.java','WidgetSizeV169.java','WidgetNativeContractTest.java') | ForEach-Object { Join-Path $PSScriptRoot $_ }
& $JavaPath -jar (Join-Path $ToolingPath 'ecj.jar') -1.8 -proc:none -encoding UTF-8 -classpath $taskTestClasspath169 -d $OutputPath @taskTestSources169
if($LASTEXITCODE -ne 0){throw 'Native model test Java compilation failed.'}
# Real org.json precedes the Android API stub; model tests call no Android UI methods.
& $JavaPath -cp ($OutputPath + ';' + $taskTestClasspath169) com.aiderlog.v22app.WidgetNativeContractTest
if($LASTEXITCODE -ne 0){throw 'Native model test assertions failed.'}
Write-Output "Native model assertions passed. Classes: $OutputPath"
Write-Output 'This is a desktop JVM model test, not Android RemoteViews inflation or a Samsung launcher test.'
