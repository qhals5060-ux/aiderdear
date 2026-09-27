param([Parameter(Mandatory=$true)][string]$ApkPath)
$ErrorActionPreference = 'Stop'
$repository = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$destination = Join-Path $repository 'android-src/assets/aiderlog-launch-v145.gif'
$expectedHash = 'a9936a466a395f644def8c8e5dd612a0598e9752e7f2a2d708835c160dc9e52b'
$expectedBytes = 16848406
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [IO.Compression.ZipFile]::OpenRead([IO.Path]::GetFullPath($ApkPath))
try {
    $entry = $archive.GetEntry('assets/aiderlog-launch-v145.gif')
    if (!$entry -or $entry.Length -ne $expectedBytes) { throw 'The supplied APK does not contain the original launch animation.' }
    $memory = [IO.MemoryStream]::new()
    $source = $entry.Open()
    try { $source.CopyTo($memory) } finally { $source.Dispose() }
    try {
        $data = $memory.ToArray()
        $sha = [Security.Cryptography.SHA256]::Create()
        try { $actual = [BitConverter]::ToString($sha.ComputeHash($data)).Replace('-','').ToLowerInvariant() } finally { $sha.Dispose() }
        if ($actual -ne $expectedHash) { throw 'Launch animation checksum mismatch; destination was not changed.' }
        [IO.File]::WriteAllBytes($destination, $data)
    } finally { $memory.Dispose() }
} finally { $archive.Dispose() }
Write-Output 'Restored the verified original launch animation. It remains ignored by Git and is included in APK builds.'
