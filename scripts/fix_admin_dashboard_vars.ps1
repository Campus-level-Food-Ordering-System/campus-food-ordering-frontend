$file = "d:\Projects\Campus food ordering system\github desktop\src\styles\admincss\AdminDashboard.css"
$content = [IO.File]::ReadAllText($file)

# Replace all var(-_admin_* with var(--admin-*
$content = $content -replace 'var\(\s*-_admin_', 'var(--admin-'

[IO.File]::WriteAllText($file, $content)
Write-Host "Fixed all var(-_admin_* references in AdminDashboard.css"
