param([ValidateSet(184)][int]$Version=184,[Parameter(Mandatory=$true)][string]$OutputDirectory,[Parameter(Mandatory=$true)][string]$WorkDirectory)
# Versioned PC packages. The APK is separately built and verified.
# Run after the coordinator updates site links/metadata and finishes browser QA.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$pcWorkspace = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$pcRepo = $pcWorkspace
$pcStage = Join-Path $WorkDirectory ('release-v'+$Version+'-pc-' + (Get-Date -Format 'yyyyMMdd-HHmmss-fff'))
$pcOrigin = 'https://aiderdear1.vercel.app'
$pcEstateFiles = @('estate-v171.js','estate-v171.css','estate-client-v171.js','estate-domain-v171.js','estate-directory-v171.js','estate-directory-v171.css','estate-workflow-v171.js','estate-workflow-v171.css','estate-calendar-v171.js','estate-public-v171.js','estate-public-v171.css','estate-share.html')
$pcLayoutFiles = @('site-calendar-v172.js','site-calendar-v172.css','site-panels-v172.js','site-panels-v172.css','estate-calendar-view-v172.js','estate-calendar-view-v172.css')
$pcLayoutFiles += 'estate-cobroker-v173.css'
$pcLayoutFiles += @('calendar-sync-v184.js','schedule-ui-v184.js','schedule-ui-v184.css')
$pcLayoutFiles += 'retired-features-v178.js'
$pcLayoutFiles += @('dday-store-v174.js','todo-domain-v179.js','schedule-time-v179.js','schedule-editor-v179.css','site-calendar-v179.css')
$pcLayoutFiles += @('dday-display-v176.js','dday-display-v176.css')
$pcLayoutFiles += @('shared-schedule-v176.js','shared-schedule-v176.css')
$pcLayoutFiles += @('android-session-v176.js','photo-attachments-v176.js','photo-attachments-v176.css')
$pcLayoutFiles += @('private-calendar-v175.js','private-calendar-ui-v175.js','private-calendar-v175.css','friend-schedule-v175.js','friend-schedule-firebase-v175.js','friend-schedule-ui-v175.js','friend-schedule-v175.css','business-calendar-v175.js','business-calendar-v175.css','site-calendar-v175.js','site-calendar-v175.css')
$pcSourceIndex = [IO.File]::ReadAllText((Join-Path $pcRepo 'index.html'))
if ($pcSourceIndex -notmatch ('name="aiderlog-build" content="v'+$Version+'"') -or $pcSourceIndex -notmatch ('estate-v171\.js\?v='+$Version+'\b')) { throw "Coordinator must finalize v$Version site metadata/assets before packaging." }
if ($pcSourceIndex -notmatch ('estate-cobroker-v173\.css\?v='+$Version+'\b')) { throw "Coordinator must mount the completed v$Version co-broker stylesheet before packaging." }
foreach ($pcEstateFile in ($pcEstateFiles + $pcLayoutFiles)) {
  if (!(Test-Path -LiteralPath (Join-Path $pcRepo $pcEstateFile) -PathType Leaf)) { throw ('Missing ESTATE browser source: ' + $pcEstateFile) }
}
if (![IO.File]::ReadAllText((Join-Path $pcRepo 'firebase-app.js')).Contains("from './dday-store-v174.js'")) { throw 'Missing D-day static module dependency in firebase-app.js.' }
New-Item -ItemType Directory -Path $pcStage | Out-Null
$pcResults = @()
$pcBaselineHashes = $null

function Add-ArchiveText($Archive, [string]$Name, [string]$Content) {
  $pcEntry = $Archive.CreateEntry($Name, [IO.Compression.CompressionLevel]::Optimal)
  $pcStream = $pcEntry.Open()
  $pcWriter = New-Object IO.StreamWriter($pcStream, (New-Object Text.UTF8Encoding($false)))
  try { $pcWriter.Write($Content) } finally { $pcWriter.Dispose() }
}

foreach ($pcEdition in @(@{ID='modern';Name='Modern';Label='모던'},@{ID='editorial';Name='Editorial';Label='에디토리얼'})) {
  $pcFileName = 'AiderLog-' + $pcEdition.Name + '-v'+$Version+'-site-files.zip'
  $pcZip = Join-Path $pcStage $pcFileName
  $pcUrl = $pcOrigin + '/?release='+$Version+'&site-edition=' + $pcEdition.ID
  $pcArchive = [IO.Compression.ZipFile]::Open($pcZip, [IO.Compression.ZipArchiveMode]::Create)
  $pcCount = 0
  $pcSourceHashes = @{}
  $pcExpectedIndex = ''
  try {
    foreach ($pcFile in Get-ChildItem -LiteralPath $pcRepo -File -Recurse -Force) {
      $pcRelative = [IO.Path]::GetRelativePath($pcRepo, $pcFile.FullName).Replace('\','/')
      if ($pcRelative.StartsWith('../') -or [IO.Path]::IsPathRooted($pcRelative)) { throw 'Unsafe archive path' }
      # Browser source only. Backend/configuration/tests/native code and former
      # archives are not needed to use the HTTPS launcher and must not leak.
      if ($pcRelative.Contains('/') -and !$pcRelative.StartsWith('vendor/')) { continue }
      if ($pcRelative -match '^(?:insight-range-v175\.(?:js|css)|insight-motion-v132\.js)$') { throw ('Retired browser feature still present: ' + $pcRelative) }
      if ($pcRelative -match '(^|/)\.' -or $pcRelative -notmatch '\.(html|js|css|svg|png|jpe?g|webp|webmanifest|json|txt)$') { continue }
      if (!$pcRelative.Contains('/') -and $pcRelative.EndsWith('.json')) { continue }
      if ($pcRelative.EndsWith('.txt') -and $pcRelative -notmatch '^paper-(analysis|verification)-prompt-v159\.txt$' -and $pcRelative -ne 'vendor/pako-LICENSE.txt') { continue }
      if ($pcFile.Length -ge 100000000) { throw ('Oversized file: ' + $pcRelative) }
      if ($pcRelative -eq 'index.html') {
        $pcHtml = [IO.File]::ReadAllText($pcFile.FullName)
        if ($pcHtml -cne $pcSourceIndex) { throw 'Index changed during packaging; restart after source edits finish.' }
        $pcHtml = $pcHtml.Replace('<html lang="ko">', ('<html lang="ko" data-site-default-edition="' + $pcEdition.ID + '">'))
        # A file:// page has neither an authenticated HTTPS origin nor /api.
        # Opening the downloaded index therefore enters the real deployment;
        # local HTTP remains available for developers with a matching backend.
        $pcGuard = '<script>if(location.protocol==="file:"){location.replace(' + ($pcUrl | ConvertTo-Json -Compress) + ');}</script>'
        $pcHtml = $pcHtml.Replace('<meta charset="utf-8">', ('<meta charset="utf-8">' + "`n" + $pcGuard))
        foreach ($pcArtifact in @("AiderLog-v$Version.apk","AiderLog-Modern-v$Version-site-files.zip","AiderLog-Editorial-v$Version-site-files.zip")) {
          $pcHtml = $pcHtml.Replace(('href="./' + $pcArtifact + '"'), ('href="' + $pcOrigin + '/' + $pcArtifact + '"'))
        }
        $pcExpectedIndex = $pcHtml
        Add-ArchiveText $pcArchive $pcRelative $pcHtml
      } else {
        # Preserve every included browser source byte-for-byte, including new
        # hotfix assets discovered at execution time. Detect concurrent changes.
        $pcSourceHashes[$pcRelative] = (Get-FileHash -LiteralPath $pcFile.FullName -Algorithm SHA256).Hash
        [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($pcArchive, $pcFile.FullName, $pcRelative, [IO.Compression.CompressionLevel]::Optimal) | Out-Null
      }
      $pcCount++
    }
    Add-ArchiveText $pcArchive 'AiderLog-시작.url' ("[InternetShortcut]`r`nURL=" + $pcUrl + "`r`n")
    $pcReadme = @"
AiderLog v$Version · $($pcEdition.Label) · Windows PC 사이트 파일

현재 운영 사이트와 동일한 버전의 캘린더·일정 편집·친구 공유·사진 및 동영상 첨부·투두 및 메모 기능을 포함하는 배포 소스입니다.
Android 앱은 별도 APK v$Version 버전으로 설치합니다.

개인 날짜의 일별 기록과 연결된 커플 공유에는 v178 Firestore 규칙이 필요합니다.
새로 기록한 생리·관계일은 연결된 커플에게만 공유하며 친구 공유에는 포함되지 않습니다. 관계일은 허용된 계정에만 표시됩니다.
예상 생리일은 입력한 주기와 최근 시작일을 바탕으로 한 참고값입니다.
Google 캘린더 자동 동기화를 개선했습니다. 기존 연결이 만료된 경우 설정에서 Google을 한 번 다시 연결해주세요.

1. 압축을 풀고 AiderLog-시작.url을 열어주세요.
   현재 운영 중인 HTTPS 사이트를 $($pcEdition.Label) 디자인으로 엽니다.
   로그인, Work/Consult/ESTATE 저장, 파일 첨부와 동기화는 이 운영 사이트에서 사용합니다.
2. index.html을 파일로 직접 열어도 같은 HTTPS 사이트로 이동합니다.
   로컬 파일 화면에서 저장한 것처럼 보이고 API 호출만 실패하는 일을 방지합니다.
3. 사이트는 개인 페이지에서 모던/에디토리얼을 다시 선택할 수 있습니다.
   두 ZIP의 기능과 저장 데이터는 같으며 시작 디자인만 다릅니다.

이 ZIP은 독립 실행형 Windows 프로그램이나 오프라인 서버가 아닙니다.
브라우저용 원본 HTML/JS/CSS와 공개 앱 이미지가 포함되며, 삭제된 어학 콘텐츠는 포함하지 않습니다.
로그인과 Work/Consult/ESTATE의 변경·첨부에는 네트워크와 운영 API가 필요합니다.
브라우저가 이전에 저장한 오프라인 화면 범위는 브라우저의 캐시 상태에 따릅니다.

개발 참고:
- 로컬 HTTP 서버로 이 소스를 열려면 동일 출처의 /api 백엔드와 Firebase 인증
  구성이 별도로 필요합니다. 이 ZIP만 정적 서버에 올려서는 Work/Consult/ESTATE 저장이
  동작하지 않습니다. API 키나 CORS 권한을 임의로 완화하지 마세요.
- 서비스 계정, 개인 인증키, 서버/API 코드, Firestore 규칙, 환경 파일, APK,
  이전 배포 ZIP, Android 네이티브 소스는 이 사용자용 ZIP에 넣지 않았습니다.
- 수정/배포용 전체 소스는 별도의 source-files ZIP 또는 Git 저장소를 사용합니다.

운영 주소: $pcUrl
"@
    Add-ArchiveText $pcArchive '먼저_읽어주세요.txt' $pcReadme
  } finally { $pcArchive.Dispose() }
  if ((Get-Item -LiteralPath $pcZip).Length -ge 100000000) { throw 'Archive exceeds 100MB' }
  $pcCheck = [IO.Compression.ZipFile]::OpenRead($pcZip)
  try {
    foreach ($pcRequired in @('index.html','AiderLog-시작.url','먼저_읽어주세요.txt','sw.js','site-layout-v165.js','site-editions-v164.js','site-editions-v164.css','consult-sync-v167.js','work-client-v167.js','site-work-v167.js','site-typography-v169.css','site-typography-v169.js','archive-codec-v168.js','vendor/pako-2.1.0.min.js','retired-features-v178.js')) {
      if (!$pcCheck.GetEntry($pcRequired)) { throw ('Missing archive entry: ' + $pcRequired) }
    }
    foreach ($pcRequired in ($pcEstateFiles + $pcLayoutFiles)) {
      if (!$pcCheck.GetEntry($pcRequired)) { throw ('Missing ESTATE archive entry: ' + $pcRequired) }
    }
    $pcIndexStream = $pcCheck.GetEntry('index.html').Open()
    $pcIndexReader = New-Object IO.StreamReader($pcIndexStream)
    try { $pcIndexText = $pcIndexReader.ReadToEnd() } finally { $pcIndexReader.Dispose() }
    if ($pcIndexText -cne $pcExpectedIndex) { throw 'Index source changed beyond the documented edition/file-launch/download-link adaptations' }
    if ($pcIndexText -notmatch ('release='+$Version+'\b') -or $pcIndexText -match 'release=167') { throw 'Incorrect PC launch release' }
    if ($pcIndexText -notmatch ('site-typography-v169.css\?v='+$Version+'\b') -or $pcIndexText -notmatch ('site-typography-v169.js\?v='+$Version+'\b')) { throw 'Missing current typography query on retained v169 assets' }
    if ($pcIndexText -notmatch ('name="aiderlog-build" content="v'+$Version+'"')) { throw 'Stale website build metadata' }
    foreach ($pcArtifact in @("AiderLog-v$Version.apk","AiderLog-Modern-v$Version-site-files.zip","AiderLog-Editorial-v$Version-site-files.zip")) {
      if (!$pcIndexText.Contains('href="' + $pcOrigin + '/' + $pcArtifact + '"')) { throw ('Missing expected release download: ' + $pcArtifact) }
    }
    if ($pcIndexText -match ('AiderLog-v(?!'+$Version+'\b)\d+\.apk') -or $pcIndexText -match ('AiderLog-(?:Modern|Editorial)-v(?!'+$Version+'\b)\d+-site-files\.zip')) { throw "Release v$Version must use matching APK and PC ZIP links" }
    if ($pcIndexText -notmatch ('estate-v171\.js\?v='+$Version+'\b') -or $pcIndexText -notmatch ('estate-v171\.css\?v='+$Version+'\b')) { throw 'Missing current ESTATE entry assets' }
    # A new navigation/hotfix file need not be hard-coded here: every local JS
    # or CSS reference in the actual final index must be present in the ZIP.
    foreach ($pcReference in [regex]::Matches($pcIndexText,'\b(?:src|href)\s*=\s*["'']([^"''<>]+\.(?:m?js|css)(?:[?#][^"''<>]*)?)["'']')) {
      $pcReferenceValue = $pcReference.Groups[1].Value
      if ($pcReferenceValue -match '^(?:[a-z][a-z0-9+.-]*:|//|#)') { continue }
      $pcReferenceUrl = [Uri]::new([Uri]'https://archive.invalid/',$pcReferenceValue)
      $pcReferenceName = [Uri]::UnescapeDataString($pcReferenceUrl.AbsolutePath).TrimStart('/')
      if (!$pcCheck.GetEntry($pcReferenceName)) { throw ('Missing local index dependency: ' + $pcReferenceName) }
    }
    foreach ($pcEntry in $pcCheck.Entries) {
      if ($pcEntry.FullName -match '^insight-range-v175\.|^insight-motion-v132\.|^language-|^site-language-|(^|/)(api|server|android-src|\.git|node_modules|verification|tests|fixtures|outputs|scripts|language-data-v2)/|ESTATE_V171_CONTRACT\.md$|\.env|\.(apk|zip|jks|keystore)$') { throw ('Forbidden archive entry: ' + $pcEntry.FullName) }
      $pcStream = $pcEntry.Open()
      try {
        if ($pcSourceHashes.ContainsKey($pcEntry.FullName)) {
          $pcHasher = [Security.Cryptography.SHA256]::Create()
          try { $pcHash = [BitConverter]::ToString($pcHasher.ComputeHash($pcStream)).Replace('-','') } finally { $pcHasher.Dispose() }
          if ($pcHash -ne $pcSourceHashes[$pcEntry.FullName]) { throw ('Browser source bytes changed: ' + $pcEntry.FullName) }
        } else { $pcStream.CopyTo([IO.Stream]::Null) }
      } finally { $pcStream.Dispose() }
    }
  } finally { $pcCheck.Dispose() }
  if ($null -eq $pcBaselineHashes) { $pcBaselineHashes = $pcSourceHashes.Clone() }
  if ($pcBaselineHashes.Count -ne $pcSourceHashes.Count) { throw 'Browser source inventory changed between editions.' }
  foreach ($pcSourceName in $pcSourceHashes.Keys) {
    if (!$pcBaselineHashes.ContainsKey($pcSourceName) -or $pcBaselineHashes[$pcSourceName] -ne $pcSourceHashes[$pcSourceName]) { throw ('Browser source changed between editions: ' + $pcSourceName) }
  }
  $pcResults += @{ file=$pcFileName;bytes=(Get-Item -LiteralPath $pcZip).Length;sha256=(Get-FileHash -LiteralPath $pcZip -Algorithm SHA256).Hash.ToLower();browserSourceFiles=$pcCount }
}
# A browser QA fix must not race the release artifacts. Both editions must
# contain the same complete source snapshot, and it must still be current.
if ([IO.File]::ReadAllText((Join-Path $pcRepo 'index.html')) -cne $pcSourceIndex) { throw 'Index changed before publishing PC packages.' }
foreach ($pcSourceName in $pcBaselineHashes.Keys) {
  if ((Get-FileHash -LiteralPath (Join-Path $pcRepo $pcSourceName) -Algorithm SHA256).Hash -ne $pcBaselineHashes[$pcSourceName]) { throw ('Browser source changed before publishing: ' + $pcSourceName) }
}
# Keep old published releases until the coordinator has passed live gates.
foreach ($pcResult in $pcResults) {
  $pcTarget = Join-Path $OutputDirectory $pcResult.file
  if (Test-Path -LiteralPath $pcTarget) {
    $pcPrevious = Join-Path $pcStage ($pcResult.file + '.previous')
    $pcPreviousHash = (Get-FileHash -LiteralPath $pcTarget -Algorithm SHA256).Hash
    Copy-Item -LiteralPath $pcTarget -Destination $pcPrevious
    if ((Get-FileHash -LiteralPath $pcPrevious -Algorithm SHA256).Hash -ne $pcPreviousHash) { throw ('Previous archive backup verification failed: ' + $pcResult.file) }
  }
  Copy-Item -LiteralPath (Join-Path $pcStage $pcResult.file) -Destination $pcTarget
  if ((Get-FileHash -LiteralPath $pcTarget -Algorithm SHA256).Hash.ToLower() -ne $pcResult.sha256) { throw ('Published archive copy verification failed: ' + $pcResult.file) }
}
$pcResults | ConvertTo-Json -Depth 5
Write-Output ('Staging and recoverable previous copies: ' + $pcStage)
