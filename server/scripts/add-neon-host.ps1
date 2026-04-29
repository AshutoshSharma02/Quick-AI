# Adds Neon host entry to Windows hosts file. Run as Administrator.
$hostsPath = 'C:\Windows\System32\drivers\etc\hosts'
$ip = '52.167.188.143'
$hostname = 'ep-plain-mountain-a8486yxa-pooler.eastus2.azure.neon.tech'
$entry = "$ip`t$hostname"

try {
    if (-not (Test-Path $hostsPath)) { throw "Hosts file not found: $hostsPath" }

    $content = Get-Content -Path $hostsPath -Raw -ErrorAction Stop
    if ($content -match [Regex]::Escape($hostname)) {
        Write-Output "Hosts already contains an entry for $hostname"
        exit 0
    }

    # Backup hosts file
    $bak = "$hostsPath.bak.$((Get-Date).ToString('yyyyMMddHHmmss'))"
    Copy-Item -Path $hostsPath -Destination $bak -Force
    Write-Output "Backup created at $bak"

    # Append entry
    Add-Content -Path $hostsPath -Value "`n# Added by Quick AI helper`n$entry"
    Write-Output "Added hosts entry: $entry"
    exit 0
} catch {
    Write-Error "Failed to update hosts file: $_"
    exit 1
}