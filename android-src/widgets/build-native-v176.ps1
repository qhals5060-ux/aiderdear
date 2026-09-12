param([string]$OutputRoot=(Join-Path $PSScriptRoot '../../../../outputs/widget-v176/native-build'))
$ErrorActionPreference='Stop'
$taskWorkspace176=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../../..'))
$taskOutput176=[IO.Path]::GetFullPath($OutputRoot)
if(!$taskOutput176.StartsWith($taskWorkspace176+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Native helper output must remain inside the task workspace.'}
if(Test-Path -LiteralPath $taskOutput176){throw 'Choose a fresh OutputRoot; previous helpers are preserved.'}
$taskJava176=Join-Path $taskWorkspace176 'work/android-tools/jre17/jdk-17.0.20.1+1-jre/bin/java.exe'
$taskTooling176='C:/AiderLogBuild/tooling-v163'
$taskPlatform176='C:/AiderLogBuild/android-platform35-v169/sdk/android-35/android.jar'
$taskD8176='C:/Users/김보민/Documents/Codex/2026-09-01/tkd/work/android-build-tools/30.0.3/android-11/lib/d8.jar'
$taskClasses176=Join-Path $taskOutput176 'classes'
$taskDex176=Join-Path $taskOutput176 'dex'
New-Item -ItemType Directory -Path $taskClasses176,$taskDex176 | Out-Null
$taskSources176=@('WidgetProvider.java','WidgetNativeV164.java','WidgetDesignV165.java','WidgetRowsV164.java','WidgetNavV164.java','WidgetSizeV169.java') | ForEach-Object {Join-Path $PSScriptRoot $_}
& $taskJava176 -jar (Join-Path $taskTooling176 'ecj.jar') -1.8 -proc:none -encoding UTF-8 -classpath "$taskPlatform176;$taskTooling176/json.jar" -d $taskClasses176 @taskSources176
if($LASTEXITCODE -ne 0){throw 'Widget Java compilation failed'}
$taskCompiled176=@(Get-ChildItem -LiteralPath $taskClasses176 -Recurse -File -Filter '*.class' | Select-Object -ExpandProperty FullName)
& $taskJava176 -cp $taskD8176 com.android.tools.r8.D8 --min-api 26 --lib "$taskTooling176/android.jar" --output $taskDex176 @taskCompiled176
if($LASTEXITCODE -ne 0){throw 'Widget D8 failed'}
Add-Type -AssemblyName System.IO.Compression.FileSystem
$taskHelper176=Join-Path $taskOutput176 'widget-helper.apk'
[IO.Compression.ZipFile]::CreateFromDirectory($taskDex176,$taskHelper176)
$taskDecoded176=Join-Path $taskOutput176 'decoded'
& $taskJava176 -jar (Join-Path $taskWorkspace176 'work/android-tools/apktool_2.12.1.jar') d $taskHelper176 -o $taskDecoded176 -r
if($LASTEXITCODE -ne 0){throw 'Helper disassembly failed'}
$taskPackage176=Join-Path $taskDecoded176 'smali/com/aiderlog/v22app'
$taskMirrors176=@((Join-Path $taskWorkspace176 'work/AiderLog-v145-decoded/smali/com/aiderlog/v22app'),(Join-Path $PSScriptRoot 'smali'))
$taskCount176=0
foreach($taskFile176 in Get-ChildItem -LiteralPath $taskPackage176 -File -Filter '*.smali'){
    if($taskFile176.Name -notmatch '^Widget(Provider|NativeV164|DesignV165|RowsV164|NavV164|SizeV169)(\$|\.)'){throw 'Unexpected helper class'}
    foreach($taskMirror176 in $taskMirrors176){Copy-Item -LiteralPath $taskFile176.FullName -Destination (Join-Path $taskMirror176 $taskFile176.Name)}
    $taskCount176++
}
Write-Output "Compiled and mirrored $taskCount176 helper classes. This is not the final installable APK: $taskHelper176"
