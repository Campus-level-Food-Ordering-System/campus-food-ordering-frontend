$files = Get-ChildItem -Path 'src/styles' -Recurse -Filter '*.css'
foreach ($file in $files) {
  $p = $file.FullName
  $text = Get-Content -Raw -Encoding UTF8 $p
  $regex = [regex]::new('(^\s*)([a-zA-Z][\w_]*_[\w_]*)(\s*:)',[System.Text.RegularExpressions.RegexOptions]::Multiline)
  $text2 = $regex.Replace($text, { param($m) $m.Groups[1].Value + ($m.Groups[2].Value -replace '_','-') + $m.Groups[3].Value })
  $text2 = [regex]::Replace($text2,'_(?=\d)','-')
  $text2 = $text2 -replace 'space_between','space-between'
  $text2 = $text2 -replace 'flex_start','flex-start'
  $text2 = $text2 -replace 'flex_end','flex-end'
  $text2 = $text2 -replace 'inline_flex','inline-flex'
  $text2 = $text2 -replace 'auto_fill','auto-fill'
  $text2 = $text2 -replace 'linear_gradient','linear-gradient'
  $text2 = $text2 -replace 'cubic_bezier','cubic-bezier'
  $text2 = $text2 -replace ':last_child',':last-child'
  $text2 = $text2 -replace ':first_child',':first-child'
  $text2 = $text2 -replace '::-webkit_scrollbar','::-webkit-scrollbar'
  $text2 = $text2 -replace '::-webkit_scrollbar_track','::-webkit-scrollbar-track'
  $text2 = $text2 -replace '::-webkit_scrollbar_thumb','::-webkit-scrollbar-thumb'
  if ($text2 -ne $text) {
    Set-Content -Path $p -Value $text2 -Encoding UTF8
    Write-Host "Patched $p"
  }
}
