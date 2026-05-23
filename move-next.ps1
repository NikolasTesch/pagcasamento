# Script temporário para mover os arquivos do next-temp para o root
$source = "next-temp"
$destRoot = "."

if (Test-Path -Path $source) {
    Get-ChildItem -Path $source -Force | ForEach-Object {
        $destPath = Join-Path -Path $destRoot -ChildPath $_.Name
        if (Test-Path -Path $destPath) {
            if ($_.Name -eq ".gitignore") {
                Remove-Item -Path $destPath -Force -ErrorAction SilentlyContinue
                Move-Item -Path $_.FullName -Destination $destRoot -Force
            } elseif ($_.Name -eq "CLAUDE.md") {
                Remove-Item -Path $_.FullName -Force -ErrorAction SilentlyContinue
            } else {
                Move-Item -Path $_.FullName -Destination $destRoot -Force
            }
        } else {
            Move-Item -Path $_.FullName -Destination $destRoot -Force
        }
    }
    Remove-Item -Path $source -Recurse -Force -ErrorAction SilentlyContinue
    Write-Output "Files moved successfully!"
} else {
    Write-Output "Source directory next-temp not found!"
}
