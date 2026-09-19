param([string]$BuildTag=(Get-Date -Format 'yyyyMMdd-HHmmss'))
$ErrorActionPreference='Stop'
if($BuildTag -notmatch '^[A-Za-z0-9-]+$'){throw 'Unsafe build tag'}
$taskRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../../..'))
$taskOutput=Join-Path $taskRoot ('outputs/native-media-v178-'+$BuildTag)
if(Test-Path -LiteralPath $taskOutput){throw 'Choose a fresh build tag'}
$taskJava=Join-Path $taskRoot 'work/android-tools/jre17/jdk-17.0.20.1+1-jre/bin/java.exe'
$taskTooling='C:/AiderLogBuild/tooling-v163'
$taskPlatform='C:/AiderLogBuild/android-platform35-v169/sdk/android-35/android.jar'
$taskD8='C:/Users/김보민/Documents/Codex/2026-09-01/tkd/work/android-build-tools/30.0.3/android-11/lib/d8.jar'
$taskClasses=Join-Path $taskOutput 'classes'
$taskDex=Join-Path $taskOutput 'dex'
New-Item -ItemType Directory -Path $taskClasses,$taskDex | Out-Null
& $taskJava -jar (Join-Path $taskTooling 'ecj.jar') -1.8 -proc:none -encoding UTF-8 -classpath $taskPlatform -d $taskClasses (Join-Path $PSScriptRoot 'MediaChooserV178.java')
if($LASTEXITCODE -ne 0){throw 'Media chooser Java compilation failed'}
$taskCompiled=@(Get-ChildItem -LiteralPath $taskClasses -Recurse -File -Filter '*.class' | Select-Object -ExpandProperty FullName)
& $taskJava -cp $taskD8 com.android.tools.r8.D8 --min-api 26 --lib (Join-Path $taskTooling 'android.jar') --output $taskDex @taskCompiled
if($LASTEXITCODE -ne 0){throw 'Media chooser D8 failed'}
Add-Type -AssemblyName System.IO.Compression.FileSystem
$taskHelper=Join-Path $taskOutput 'media-helper.apk'
[IO.Compression.ZipFile]::CreateFromDirectory($taskDex,$taskHelper)
$taskDecoded=Join-Path $taskOutput 'decoded'
& $taskJava -jar (Join-Path $taskRoot 'work/android-tools/apktool_2.12.1.jar') d $taskHelper -o $taskDecoded -r
if($LASTEXITCODE -ne 0){throw 'Media helper disassembly failed'}
$taskPackage=Join-Path $taskDecoded 'smali/com/aiderlog/v22app'
$taskMirrors=@((Join-Path $taskRoot 'work/AiderLog-v145-decoded/smali/com/aiderlog/v22app'),(Join-Path $PSScriptRoot '../smali'))
foreach($taskFile in Get-ChildItem -LiteralPath $taskPackage -File -Filter '*.smali'){
  if($taskFile.Name -notmatch '^(MediaChooserV178(\$|\.)|-\$\$Lambda\$MediaChooserV178\$)'){throw 'Unexpected helper class'}
  foreach($taskMirror in $taskMirrors){Copy-Item -LiteralPath $taskFile.FullName -Destination (Join-Path $taskMirror $taskFile.Name)}
}
foreach($taskFile in @('MainActivity.smali','MainActivity$AiderLogChromeClient.smali')){
  Copy-Item -LiteralPath (Join-Path $PSScriptRoot ('../smali/'+$taskFile)) -Destination (Join-Path $taskMirrors[0] $taskFile)
}
Write-Output "Compiled media chooser helpers: $taskOutput (not an installable release)"
