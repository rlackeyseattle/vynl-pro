# Copy show photos to vynl-pro-clean/public/shows for GitHub/Vercel
# Run: powershell -ExecutionPolicy Bypass -File copy_shows.ps1

$src = "C:\Users\rlack\OneDrive\Desktop\Photos Organized\Shows"
$dst = "C:\Users\rlack\vynl-pro-clean\public\shows"

New-Item -ItemType Directory -Force -Path $dst | Out-Null
Get-ChildItem -Path $src -File | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $dst -Force
}
$count = (Get-ChildItem $dst -File).Count
Write-Host "Done. $count show photos in: $dst"
