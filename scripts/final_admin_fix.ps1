$file = "d:\Projects\Campus food ordering system\github desktop\src\styles\admincss\AdminDashboard.css"
$content = [IO.File]::ReadAllText($file)

# Replace all property name underscores with hyphens
$replacements = @{
    'font_family' = 'font-family'
    'font_weight' = 'font-weight'
    'font_size' = 'font-size'
    'text_transform' = 'text-transform'
    'text_shadow' = 'text-shadow'
    'text_align' = 'text-align'
    'border_radius' = 'border-radius'
    'border_color' = 'border-color'
    'border_bottom' = 'border-bottom'
    'border_top' = 'border-top'
    'margin_top' = 'margin-top'
    'margin_bottom' = 'margin-bottom'
    'margin_left' = 'margin-left'
    'padding_top' = 'padding-top'
    'padding_left' = 'padding-left'
    'padding_right' = 'padding-right'
    'padding_bottom' = 'padding-bottom'
    'line_height' = 'line-height'
    'letter_spacing' = 'letter-spacing'
    'box_shadow' = 'box-shadow'
    'align_items' = 'align-items'
    'justify_content' = 'justify-content'
    'flex_direction' = 'flex-direction'
    'flex_shrink' = 'flex-shrink'
    'grid_template_columns' = 'grid-template-columns'
    'backdrop_filter' = 'backdrop-filter'
    'overflow_y' = 'overflow-y'
    'pointer_events' = 'pointer-events'
    'white_space' = 'white-space'
    'object_fit' = 'object-fit'
    'z_index' = 'z-index'
    'cubic_bezier' = 'cubic-bezier'
    'linear_gradient' = 'linear-gradient'
}

foreach ($old in $replacements.Keys) {
    $new = $replacements[$old]
    $content = $content -replace "\b$old\b", $new
}

# Replace numeric negatives _1px to -1px, etc.
$content = $content -replace '_(\d)', '-$1'

[IO.File]::WriteAllText($file, $content)
Write-Host "AdminDashboard.css: All underscores fixed!"
