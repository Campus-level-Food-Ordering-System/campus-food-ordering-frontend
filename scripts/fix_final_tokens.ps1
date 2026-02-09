$file = "d:\Projects\Campus food ordering system\github desktop\src\styles\admincss\AdminDashboard.css"
$content = [IO.File]::ReadAllText($file)
$content = $content -replace 'flex_start', 'flex-start'
$content = $content -replace 'space_between', 'space-between'
[IO.File]::WriteAllText($file, $content)
Write-Host "Fixed final value tokens in AdminDashboard.css"
