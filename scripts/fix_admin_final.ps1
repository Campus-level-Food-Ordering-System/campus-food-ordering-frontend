$file = "d:\Projects\Campus food ordering system\github desktop\src\styles\admincss\AdminDashboard.css"
$content = [IO.File]::ReadAllText($file)

# Replace all underscored property names with hyphens
# Match patterns like: property_name:
$content = $content -replace '^\s+([a-z]+)_([a-z])', '    $1-$2'

# Replace numeric negatives with hyphens: _1px, _2px, _3px, etc.
$content = $content -replace '_(\d)', '-$1'

# Write back
[IO.File]::WriteAllText($file, $content)
Write-Host "Completed final pass on AdminDashboard.css"
